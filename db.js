import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';

const DB_FILE = path.join(process.cwd(), 'auramind.db');
const USERS_JSON_FILE = path.join(process.cwd(), 'users.json');

let dbInstance = null;

export async function getDatabaseHandle() {
  if (dbInstance) return dbInstance;

  dbInstance = await open({
    filename: DB_FILE,
    driver: sqlite3.Database
  });

  // Initialize SQLite Users Schema
  await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );
  `);

  console.log('⚡ SQLite Database Engine Initialized (auramind.db)');

  // Auto-migrate legacy users.json data if present
  try {
    const userCountResult = await dbInstance.get('SELECT COUNT(*) as count FROM users');
    if (userCountResult.count === 0) {
      if (fs.existsSync(USERS_JSON_FILE)) {
        const raw = fs.readFileSync(USERS_JSON_FILE, 'utf8');
        const legacyUsers = JSON.parse(raw);

        for (const u of legacyUsers) {
          await dbInstance.run(
            `INSERT OR IGNORE INTO users (id, name, email, password, createdAt) VALUES (?, ?, ?, ?, ?)`,
            [u.id, u.name, u.email.toLowerCase(), u.password, u.createdAt || new Date().toISOString()]
          );
        }
        console.log(`📦 SQLite Migration: Migrated ${legacyUsers.length} user accounts from users.json to auramind.db`);
      } else {
        // Seed default demo user
        const hashedPassword = await bcrypt.hash('AuraMind2026!', 10);
        await dbInstance.run(
          `INSERT INTO users (id, name, email, password, createdAt) VALUES (?, ?, ?, ?, ?)`,
          ['usr_demo_01', 'Alex Johnson', 'user@auramind.org', hashedPassword, new Date().toISOString()]
        );
        console.log('✅ SQLite Database: Seeded default demo user (user@auramind.org)');
      }
    }
  } catch (err) {
    console.error('SQLite initialization/migration error:', err);
  }

  return dbInstance;
}

export async function getUserByEmail(email) {
  const db = await getDatabaseHandle();
  return await db.get('SELECT * FROM users WHERE LOWER(email) = LOWER(?)', [email]);
}

export async function getUserById(id) {
  const db = await getDatabaseHandle();
  return await db.get('SELECT id, name, email, createdAt FROM users WHERE id = ?', [id]);
}

export async function createUser({ id, name, email, password, createdAt }) {
  const db = await getDatabaseHandle();
  await db.run(
    'INSERT INTO users (id, name, email, password, createdAt) VALUES (?, ?, ?, ?, ?)',
    [id, name, email.toLowerCase(), password, createdAt]
  );
  return { id, name, email };
}

export async function getTotalUsersCount() {
  const db = await getDatabaseHandle();
  const res = await db.get('SELECT COUNT(*) as count FROM users');
  return res.count;
}
