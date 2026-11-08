# Quentrix AI — Intelligent Online Examination & Programming Platform

> **Tagline:** *Learn Smarter. Practice Better. Perform Higher.*

**Quentrix AI** is a complete, enterprise-grade, responsive AI-powered online examination and programming assessment platform engineered for modern technical universities, computer science faculties, and high-stakes coding evaluations.

The platform unites an ultra-modern, dark-themed **React.js & Vite** frontend with a robust, scalable **Node.js, Express.js, Prisma ORM, and MySQL 8.0** backend.

---

## 🎨 Design System & Color Palette

Quentrix AI adheres strictly to a technology-focused dark theme:

| Role | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Background** | `#191B18` | Primary deep surface tone |
| **Secondary Background** | `#252923` | Sidebar, toolbars, and inputs |
| **Card Background** | `#30342D` | Elevated panels, dialogs, question cards |
| **Primary Accent** | `#D87855` | Terracotta warm orange for primary CTAs and alerts |
| **Secondary Accent** | `#B8D58B` | Soft sage green for success indicators, active status |
| **Highlight** | `#E8C58D` | Warm gold for difficulty highlights, badges, ranks |
| **Muted Accent** | `#82769D` | Violet for marked review tags and category tags |
| **Main Text** | `#F4F0E8` | High-contrast warm off-white headings & body |
| **Secondary Text** | `#B8B8AE` | Readable muted stone for metadata and hints |

*Strict Rules Followed: Zero Tailwind CSS, zero Bootstrap, pure modular CSS and custom properties, accessible focus indicators, and smooth Framer Motion transitions.*

---

## 🏗️ System Architecture

```
c:\Online_Quiz_and_Exam\
├── frontend/                     # React.js + Vite Client Application
│   ├── src/
│   │   ├── components/           # Common, Admin, Student, Exam, Coding, AI, Analytics
│   │   ├── pages/                # Public, Auth, Admin, Student, Exam, Coding, Chatbot
│   │   ├── services/             # Axios API client with automatic offline fallback
│   │   ├── context/              # Auth, Exam, and Toast Context Providers
│   │   ├── styles/               # Design token CSS variables and theme rules
│   │   └── App.jsx               # React Router DOM v6 route tree
│   ├── package.json
│   └── vite.config.js
│
├── backend/                      # Node.js + Express + Prisma + MySQL API Server
│   ├── prisma/
│   │   ├── schema.prisma         # 22 normalized relational models
│   │   ├── migrations/           # Versioned MySQL migration scripts
│   │   └── seed.js               # Comprehensive academic master data seed
│   ├── src/
│   │   ├── config/               # MySQL Prisma client, Gemini/OpenAI, Judge0
│   │   ├── controllers/          # 12 specialized domain controllers
│   │   ├── middleware/           # JWT Auth, Role RBAC, Zod validation, Error mapper
│   │   ├── routes/               # Modular Express REST endpoints
│   │   ├── services/             # AI question synthesis, Judge0 runner, grading transaction
│   │   ├── utils/                # SHA-256 hasher, Jaccard similarity, JWT signer
│   │   ├── app.js                # Express app configuration
│   │   └── server.js             # HTTP + Socket.IO real-time proctoring telemetry
│   ├── tests/                    # Jest + Supertest automated test suites
│   ├── package.json
│   └── README.md
│
├── package.json                  # Root workspace script runner
└── README.md
```

---

## 🚀 Quick Start Guide (Fullstack)

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **MySQL Server 8.0+** running on `localhost:3306`

---

### 2. Database Setup (MySQL)
Create the database in MySQL:
```sql
CREATE DATABASE quentrix_ai_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

In `backend/.env`, configure your database connection string:
```env
DATABASE_URL="mysql://root:password@localhost:3306/quentrix_ai_db"
JWT_SECRET=super_secret_quentrix_jwt_key_change_in_production
PORT=5000
CLIENT_URL=http://localhost:5173
```

---

### 3. Initialize Database with Prisma
Run the following commands inside `backend/`:
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
```

This generates the Prisma client, creates all 22 relational MySQL tables, and seeds the academic streams, subjects, sample questions, and active exams.

---

### 4. Run the Backend Server
```bash
cd backend
npm run dev
```
*Backend runs at `http://localhost:5000` with health check at `http://localhost:5000/api/health`.*

---

### 5. Run the Frontend Client
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
*Frontend opens at `http://localhost:5173`.*

---

## 🔑 Demo Access & Role Switching

Quentrix AI features two distinct role experiences:
1. **Academic Admin** (Faculty, Deans, Examination Controllers)
2. **Student Candidate** (Undergraduates, Engineering Cohort)

### Instant One-Click Demo Role Switcher
- In the navigation bar on all pages, click the **"Role: Admin / Student"** pill button at any time to instantly toggle between the **Admin Console** and the **Student Learning Portal**.
- On the Login page (`/auth/login`), click either:
  - 🛡️ **Admin Console** (Quick Login as `Dr. Aris Thorne` / `admin@quentrix.ai`)
  - 🎓 **Student Portal** (Quick Login as `Aditya Vardhan` / `aditya@quentrix.ai`)

---

## 🌟 Key Functional Highlights

### 1. AI Examination Creation Wizard & Faculty Guardrail
Configures 12 institutional parameters:
1. Academic Stream (CSE, IT, ECE, EEE, MECH, CIVIL, AI&DS, CHEMICAL, BIOTECH)
2. Subject (Data Structures, Algorithms, OS, DBMS, Web Tech)
3. Topic (Binary Trees, Deadlocks, Graph Algorithms, Memory Paging)
4. Question Count
5. Duration in minutes
6. Difficulty (Easy, Medium, Hard, Mixed)
7. Question Type (MCQ, Multiple select, True/False, Programming, Mixed)
8. Marks per question
9. Negative marking penalty
10. Start date & time
11. End date & time
12. Max attempts allowed

> [!IMPORTANT]
> **Strict Human-in-the-Loop Review Guardrail:** Questions synthesized by Quentrix AI are **never published automatically**. Faculty members review each generated item, check correct keys, edit formulations, regenerate individual items, and explicitly click **Approve Questions**. An examination cannot be published until 100% of its questions are approved.

### 2. Distraction-Free Examination Room & Proctoring Telemetry
- **Tamper-Resistant Server Timer:** Remaining time is validated server-side based on `startedAt + duration`. Client-side clock manipulation is impossible.
- **Autosave Engine:** Answers and review marks are autosaved in real-time.
- **Visual Question Palette:** Real-time color feedback for answered, unanswered, marked for review, and combined states.
- **Socket.IO Proctoring:** Detects fullscreen exits and tab switching with live warnings broadcast from server.
- **Deterministic Server-Side Grading:** Submissions are scored inside an atomic MySQL transaction (`prisma.$transaction`).

### 3. Integrated Programming IDE (Monaco Editor)
- Polyglot execution: C, C++, Java, Python, JavaScript.
- Standard problem description, sample test cases, hidden test cases, runtime profiling, and memory tracking via Judge0 API.
- **Web Sandbox:** Real-time hot-reloading iframe browser preview for HTML/CSS/JS frontend challenges.

### 4. Bilingual AI Academic Tutor (English & Telugu)
- Clarifies engineering concepts, algorithm time complexity ($O(n \log n)$, $O(V + E)$), and exam strategies.
- Native bilingual support for **Telugu (తెలుగు)** script and English technical explanations.
- Persistent conversation and message logging in MySQL database.

### 5. Cognitive Analytics & Radar Mastery
- Score summary: Total marks, percentage, percentile, speed rating, and topic breakdown.
- Multi-axis Radar and Bar analytics charts powered by Recharts.
- Personalized diagnostic feedback with identified strengths and focused revision areas.

---

## 🧪 Automated Testing

Backend unit and integration tests:
```bash
npm --prefix backend test
```
Tests cover:
- Text normalization, content hashing (SHA-256), and Jaccard similarity for duplicate detection.
- Security boundaries: Public student registration role locking and admin privilege escalation prevention.
- API health and JWT token validation.

Frontend production build check:
```bash
npm --prefix frontend run build
```
Builds 2,670+ optimized chunks with zero errors using Vite.

---

## 📄 License
Quentrix AI Academic Engine — Developed for educational excellence.
