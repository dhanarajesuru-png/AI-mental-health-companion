import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { getUserByEmail, getUserById, createUser, getTotalUsersCount, getDatabaseHandle } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'auramind_jwt_secure_secret_2026';

// Apply security headers & middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Initialize SQLite DB connection on launch
getDatabaseHandle();

// Auth rate limiter to prevent brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 requests per windowMs
  message: { error: 'Too many auth requests from this IP. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/auth/', authLimiter);

// Health Check Endpoint
app.get('/api/health', async (req, res) => {
  try {
    const totalUsers = await getTotalUsersCount();
    res.json({
      status: 'ok',
      service: 'AuraMind SQLite Database Auth Service',
      database: 'auramind.db',
      totalUsers,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Register Endpoint (SQLite Database Connected)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists in the database.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = `usr_${Date.now()}`;
    const createdAt = new Date().toISOString();

    const newUser = await createUser({
      id: userId,
      name,
      email,
      password: hashedPassword,
      createdAt
    });

    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '365d' });

    res.status(201).json({
      message: 'Account created and saved in SQLite database',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error during registration.' });
  }
});

// Login Endpoint (SQLite Database Connected)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '365d' });

    res.json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error during login.' });
  }
});

// Get Current Profile Endpoint (SQLite Database Connected)
app.get('/api/auth/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization header missing or invalid.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await getUserById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found in database.' });
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired authentication token.' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 AuraMind SQLite Database Auth Server running on http://localhost:${PORT}`);
});

