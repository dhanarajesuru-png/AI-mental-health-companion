# 🧠 AuraMind — AI Mental Health Companion & Wellness Grounding

> **A clinically-grounded, privacy-first AI mental health companion providing conversational support, daily mood analytics, interactive CBT/DBT coping exercises, voice dictation, and therapist report exports.**

---

## 🌟 Key Features

### 1. 🧠 AI Sanctuary Conversational Engine
- **Dual-Layer Safety Pre-Guardrails**: Pre-evaluates inputs via regex and semantic hopelessness risk scoring before AI processing (`SafetyPipeline.js`).
- **Semantic RAG Engine**: Uses a client-side **TF-IDF Vector Space Model** with **Cosine Similarity Scoring** over evidence-based clinical workbooks (`ragEngine.js`).
- **Google Gemini LLM Integration**: Generates warm, empathetic, non-judgmental active listening responses with graceful offline RAG fallback.

### 2. 🧘 Zen Mindfulness & Coping Studio
- **DBT TIPP Emergency Protocol**: Interactive step-by-step de-escalation wizard (*Cold Water Mammalian Dive Reflex, 60s Adrenaline Exercise, Paced Breathing, Paired Muscle Relaxation*).
- **CBT Thought Reframer**: Guided 4-step tool to identify cognitive distortions and build evidence-backed balanced thoughts.
- **4-7-8 Parasympathetic Breathing**: Visual animated breathing circle for rapid heart rate reduction.
- **5-4-3-2-1 Sensory Grounding**: Interactive 5-step sensory awareness exercise during panic or dissociation.

### 3. 📊 Pulse Analytics & Clinical Reports
- **Longitudinal Mood Trajectory**: Visual velocity bar charts, mood valence tracking, and trigger tag correlation.
- **Interactive Guided Reflection Journal**: Templates (*Unfiltered Worry Dump, Gratitude & Daily Wins, Evening Wind-Down*) with real-time cognitive distortion detection.
- **Printable Clinical Therapist PDF Export**: One-click summary report generator for sharing structured mood history with licensed doctors/therapists.

### 4. 🎙️ Voice & Accessibility Companion
- **Speech-to-Text Dictation (STT)**: Microphone dictation via browser `webkitSpeechRecognition`.
- **Calm Text-to-Speech Output (TTS)**: Reads AI companion responses aloud using `window.speechSynthesis`.

### 5. 📱 PWA & Offline Support
- **Progressive Web App**: Web App Manifest (`manifest.json`) and Service Worker (`sw.js`) network-first caching.
- **Offline Crisis Access**: Ensures crisis hotlines, 4-7-8 breathing, and grounding tools function 100% offline.

### 6. 🔒 Security & Privacy Engineering
- **App Passcode PIN Lock**: Optional 4-digit PIN lock screen with SHA-256 hashed validation (`PinLockModal.jsx`).
- **Backend Hardening**: Express auth server hardened with `helmet` security headers and `express-rate-limit` brute-force protection.
- **Client-Side Storage**: AES-256 encrypted local storage for journal logs and user facts.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite 5, Vanilla CSS Design System, Lucide React Icons
- **Analytics & Data**: Chart.js, react-chartjs-2, Crypto-JS (AES-256 & SHA-256)
- **AI & RAG Engine**: Google Gemini API (`gemini-1.5-flash`), Client-Side TF-IDF Cosine Similarity Engine
- **Backend Auth**: Node.js, Express, JWT, bcryptjs, Helmet, Express-Rate-Limit
- **Web APIs**: Web Speech API (STT/TTS), Service Worker (PWA), Web Print API

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/dhanarajesuru-png/AI-mental-health-companion.git
   cd AI-mental-health-companion
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Node Auth Backend Server**
   ```bash
   npm run server
   ```
   *(Server starts on `http://localhost:5000`)*

4. **Start Vite Development Frontend**
   ```bash
   npm run dev
   ```
   *(App opens on `http://localhost:3000`)*

5. **Build for Production**
   ```bash
   npm run build
   ```

---

## ⚠️ Clinical Safety Disclaimer

AuraMind is an AI-powered conversational wellness companion designed for self-reflection and coping skills practice. It is **not** a therapist, doctor, or licensed medical provider and cannot diagnose or treat clinical conditions. 

If you or someone you know is in distress or experiencing a mental health crisis, please reach out to emergency resources immediately:

- **United States & Canada**: Call or Text **988** (24/7 Lifeline) or Text **HOME** to **741741**
- **India**: Call **14416** / **1800-599-0019** (Tele-MANAS) or Emergency **112**
- **International**: Visit [https://findahelpline.com](https://findahelpline.com) for resources in 130+ countries.

---

## 👤 Author

Developed with care by **Dhanaraj Esuru**  
- **GitHub**: [@dhanarajesuru-png](https://github.com/dhanarajesuru-png)
