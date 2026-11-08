# Quentrix AI — Backend Architecture & MySQL Database Engine

> **Tagline:** *Learn Smarter. Practice Better. Perform Higher.*

Quentrix AI backend is an enterprise-grade academic engine and real-time proctoring assessment platform engineered with **Node.js**, **Express.js**, **Prisma ORM**, and **MySQL 8.0**. It powers deterministic examination evaluation, AI-synthesized question generation with human-in-the-loop review guardrails, sandboxed multi-language code execution via Judge0, real-time Socket.IO proctoring telemetry, and bilingual academic chatbot tutoring.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Runtime & Framework** | Node.js (ESM), Express.js |
| **Primary Database** | **MySQL 8.0+** |
| **ORM & Schema Migrations** | Prisma ORM (`@prisma/client`, `prisma`) |
| **Authentication & Tokens** | JSON Web Tokens (`jsonwebtoken`), `bcryptjs` (salt rounds: 12) |
| **Validation & Integrity** | Zod schema validation, text normalization & SHA-256 content hashing |
| **AI Integration** | Google Gemini API / OpenAI API + Deterministic Academic Fallback Engine |
| **Code Execution Engine** | Judge0 API (C, C++, Java, Python, JavaScript) + Sandbox Fallback |
| **Real-time WebSockets** | Socket.IO (room-based proctoring telemetry, live warnings, tab tracking) |
| **Testing** | Jest with Experimental VM Modules, Supertest |

---

## 📁 Backend Directory Architecture

```
backend/
├── prisma/
│   ├── schema.prisma              # Complete 22 relational models schema
│   ├── migrations/                # Initial MySQL migration DDL scripts
│   └── seed.js                    # Multi-stream seed data script
│
├── src/
│   ├── config/
│   │   ├── database.js            # Prisma client instance & connectivity tester
│   │   ├── ai.js                  # Gemini / OpenAI LLM configuration
│   │   └── judge0.js              # Judge0 API endpoints & language mappings
│   │
│   ├── controllers/
│   │   ├── academicController.js  # Stream, Subject, Unit, Topic CRUD
│   │   ├── adminController.js     # Exam drafts, AI synthesis, faculty approval
│   │   ├── analyticsController.js # Admin platform KPIs & student report cards
│   │   ├── authController.js      # Register, login, refresh, password reset
│   │   ├── chatbotController.js   # English & Telugu AI academic chat
│   │   ├── codingController.js    # Problem catalog, run code, multi-case submission
│   │   ├── examController.js      # Exam discovery, timer room, real-time autosave
│   │   ├── leaderboardController.js # Global & stream-specific rankings
│   │   ├── mockTestController.js  # Adaptive AI mock test generation
│   │   ├── questionController.js  # Question bank, search, filters, JSON/CSV import
│   │   ├── resultController.js    # Student results & diagnostic breakdowns
│   │   └── studentController.js   # Student overview, enrolled exams, results
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT Bearer token authentication
│   │   ├── roleMiddleware.js      # RBAC guards (requireAdmin, requireStudent)
│   │   ├── validationMiddleware.js# Zod schema input validator
│   │   └── errorMiddleware.js     # Centralized error handler & Prisma code mapper
│   │
│   ├── routes/
│   │   ├── academicRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── analyticsRoutes.js
│   │   ├── authRoutes.js
│   │   ├── chatbotRoutes.js
│   │   ├── codingRoutes.js
│   │   ├── examRoutes.js
│   │   ├── leaderboardRoutes.js
│   │   ├── mockTestRoutes.js
│   │   ├── questionRoutes.js
│   │   ├── resultRoutes.js
│   │   └── studentRoutes.js
│   │
│   ├── services/
│   │   ├── aiQuestionService.js   # Gemini/OpenAI prompt generator with JSON schema
│   │   ├── analyticsService.js    # Metric aggregations, percentile calculation
│   │   ├── chatbotService.js      # Bilingual (EN/TE) conversation persistence
│   │   ├── codeExecutionService.js# Judge0 REST execution & sandbox simulator
│   │   ├── duplicateDetectionService.js # SHA-256 hash & Jaccard similarity
│   │   ├── examService.js         # Room provisioning, timer, autosave, shuffling
│   │   └── gradingService.js      # Deterministic server-side grading transaction
│   │
│   ├── utils/
│   │   ├── apiResponse.js         # Standardized { success, message, data } JSON
│   │   ├── logger.js              # Timestamped console logging
│   │   ├── textHasher.js          # Normalization, SHA-256, Jaccard similarity
│   │   └── token.js               # Sign & verify access tokens
│   │
│   ├── validators/
│   │   ├── authValidator.js
│   │   ├── chatValidator.js
│   │   ├── codingValidator.js
│   │   ├── examValidator.js
│   │   └── questionValidator.js
│   │
│   ├── app.js                     # Express application configuration
│   └── server.js                  # HTTP server + Socket.IO proctoring handler
│
├── tests/
│   ├── apiEndpoints.test.js       # Health, auth, and protected route tests
│   ├── authAndSecurity.test.js    # Admin escalation & token verification tests
│   └── duplicateDetection.test.js # SHA-256 and Jaccard similarity unit tests
│
├── .env.example
├── package.json
└── README.md
```

---

## 🗄️ MySQL Database Design & Relational Models

The system architecture utilizes **MySQL 8.0** as the primary relational database with **22 normalized Prisma models**:

1. **`User`**: Account identity, hashed passwords, active status, system role (`ADMIN`, `STUDENT`).
2. **`StudentProfile`**: Institution, engineering stream, roll number, semester, year of study, global rank, points.
3. **`AdminProfile`**: Department, designation, permissions, contact phone.
4. **`Stream`**: Engineering departments (CSE, ECE, EEE, MECH, CIVIL, IT, AI&DS, CHEMICAL, BIOTECH).
5. **`Subject`**: Academic subjects organized under engineering streams (e.g., Data Structures, Operating Systems).
6. **`Unit`**: Course units or modules partitioned within a subject.
7. **`Topic`**: Granular learning concepts attached to units (e.g., AVL Trees, Deadlocks).
8. **`Question`**: Master question repository. Holds text, normalized text, SHA-256 `contentHash`, difficulty (`EASY`, `MEDIUM`, `HARD`), question type (`MCQ`, `MULTIPLE_SELECT`, `TRUE_FALSE`, `PROGRAMMING`), default marks, negative marks, `isAiGenerated`, and mandatory **`isApproved`** approval flag.
9. **`QuestionOption`**: Options for MCQs and Multiple-Select questions (`isCorrect`, order index).
10. **`Exam`**: Scheduled examinations with 12 configuration parameters: duration, total marks, pass marks, negative marking, question type, difficulty, start/end dates, max attempts, and question/option randomization toggles.
11. **`ExamQuestion`**: Many-to-many junction table between Exam and Question with question-specific weights and order indexing.
12. **`ExamAttempt`**: Student exam sessions. Records server-calculated `expiresAt`, status (`IN_PROGRESS`, `SUBMITTED`, `EXPIRED`, `DISQUALIFIED`), IP address, browser fingerprint, and proctoring violation counts.
13. **`StudentAnswer`**: Real-time autosaved student responses. Stores selected option IDs, text responses, or code snippets, with review flags.
14. **`Result`**: Deterministic final grading result evaluated within a database transaction. Contains total score, percentage, percentile, grade, topic accuracy JSON, and AI-generated diagnostic feedback.
15. **`MockTest`**: Adaptive student self-practice mock test definitions.
16. **`MockTestAttempt`**: Student self-practice assessment attempts.
17. **`CodeSubmission`**: Multi-language programming submissions evaluated by Judge0 API. Tracks execution time, memory usage, stdout, stderr, compile errors, and testcase pass ratios.
18. **`LeaderboardEntry`**: Cached aggregated rankings (global, stream-specific, weekly).
19. **`ChatConversation`**: User AI tutoring sessions.
20. **`ChatMessage`**: Bilingual academic chat messages with role tracking (`USER`, `ASSISTANT`) and detected language (`en`, `te`).
21. **`Notification`**: System and faculty alerts broadcast to students.
22. **`QuestionExposureHistory`**: Anti-memorization audit log tracking which questions each student has been exposed to in prior attempts, ensuring fresh question generation.

---

## 🚀 Setup & Installation Instructions

### 1. Prerequisites
- **Node.js** v18.0.0 or higher
- **npm** v9.0.0 or higher
- **MySQL Server 8.0+** running locally (or via XAMPP, Laragon, MySQL Workbench)

### 2. Configure Database
In your local MySQL instance, create a database for Quentrix AI:
```sql
CREATE DATABASE quentrix_ai_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Environment Configuration
Navigate to the `backend` directory and copy the environment template:
```bash
cd backend
cp .env.example .env
```
Edit `.env` with your MySQL credentials:
```env
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# MySQL Database Connection URL
DATABASE_URL="mysql://root:password@localhost:3306/quentrix_ai_db"

# JWT Authentication
JWT_SECRET=super_secret_quentrix_jwt_key_change_in_production
JWT_EXPIRES_IN=24h

# AI Engine (Optional - system falls back to academic synthesizer if omitted)
GEMINI_API_KEY=your_gemini_api_key_here
# OPENAI_API_KEY=your_openai_api_key_here

# Judge0 Code Execution API (Optional - system falls back to sandboxed runner)
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=your_rapidapi_judge0_key_here
```

### 4. Install Dependencies
```bash
npm install
```

### 5. Generate Prisma Client & Run Migrations
Generate the type-safe Prisma client:
```bash
npx prisma generate
```
Apply the database migrations to your MySQL instance:
```bash
npx prisma migrate dev --name init
```
*(Or use `npx prisma db push` to synchronize the schema directly).*

### 6. Seed Academic Master Data
Populate the database with engineering streams, subjects, sample questions, mock exams, and rankings:
```bash
npm run prisma:seed
```

### 7. Start the Backend Server
```bash
# Development mode with hot-reloading
npm run dev

# Production mode
npm start
```
The server will start listening at: `http://localhost:5000` with health check at `http://localhost:5000/api/health`.

---

## 🧪 Running the Test Suite

The test suite validates duplicate detection algorithms, authentication boundaries, role authorization guards, and API health:

```bash
cd backend
npm test
```

Expected output:
```
PASS tests/apiEndpoints.test.js
PASS tests/authAndSecurity.test.js
PASS tests/duplicateDetection.test.js

Test Suites: 3 passed, 3 total
Tests:       11 passed, 11 total
Time:        2.3 s
```

---

## 🛡️ Critical Security & Academic Integrity Rules

1. **Strict Human-in-the-Loop Review Guardrail**:
   - AI-generated questions are saved with `isApproved: false`.
   - The exam publishing endpoint (`POST /api/admin/exams/:id/publish`) checks that **every question is approved**. If any question is unapproved, publishing is strictly blocked.
2. **Deterministic Server-Side Grading**:
   - Client-side scores are never accepted by the server. All calculations (MCQ matching, multiple-select set comparison, True/False, and negative marking formulas) occur inside an atomic database transaction (`prisma.$transaction`).
3. **Tamper-Resistant Server Timing**:
   - The server records `startedAt` and calculates `expiresAt = startedAt + (durationMinutes * 60)`.
   - Late submissions or autosaves beyond `expiresAt` are automatically rejected.
4. **Role Isolation**:
   - The public registration endpoint (`/api/auth/register`) strictly sets `role: STUDENT`.
   - Admin accounts can only be provisioned through secure database seeding or by authenticated super-administrators.

---

## 📡 API Reference Catalog

### 1. Health
- `GET /api/health` — System status and MySQL connectivity check.

### 2. Authentication (`/api/auth`)
- `POST /api/auth/register` — Student registration (creates `User` and `StudentProfile`).
- `POST /api/auth/login` — Authenticate user and issue JWT bearer token.
- `GET /api/auth/profile` — Get authenticated user's profile details.
- `POST /api/auth/logout` — Revoke session.
- `POST /api/auth/forgot-password` — Request password reset email token.
- `POST /api/auth/reset-password` — Submit new password with reset token.

### 3. Academic Structure (`/api/academic`)
- `GET /api/academic/streams` — List engineering streams.
- `POST /api/academic/streams` — (Admin) Add engineering stream.
- `GET /api/academic/streams/:streamId/subjects` — List subjects under a stream.
- `POST /api/academic/subjects` — (Admin) Create academic subject.
- `GET /api/academic/subjects/:subjectId/units` — List units under a subject.
- `POST /api/academic/units` — (Admin) Create course unit.
- `GET /api/academic/units/:unitId/topics` — List topics under a unit.
- `POST /api/academic/topics` — (Admin) Create topic.

### 4. Admin Management (`/api/admin`)
- `GET /api/admin/dashboard` — Platform telemetry, active exams, participant KPIs.
- `GET /api/admin/exams` — List all examinations across all statuses.
- `POST /api/admin/exams` — Create a new examination draft (12 configuration parameters).
- `PUT /api/admin/exams/:id` — Update examination schedule and settings.
- `DELETE /api/admin/exams/:id` — Delete examination draft.
- `POST /api/admin/exams/:id/generate` — Generate AI questions for this exam (`isApproved: false`).
- `POST /api/admin/exams/:id/approve` — Faculty approval of synthesized questions.
- `POST /api/admin/exams/:id/publish` — Publish exam (validates that all questions are approved).
- `GET /api/admin/students` — Cohort roster with search, pagination, and performance stats.

### 5. Question Bank (`/api/questions`)
- `GET /api/questions` — Filter questions by stream, subject, topic, difficulty, type, search.
- `GET /api/questions/:id` — Get question details.
- `POST /api/questions` — (Admin) Add new question with options.
- `PUT /api/questions/:id` — (Admin) Update question.
- `DELETE /api/questions/:id` — (Admin) Soft/hard delete question.
- `POST /api/questions/import` — (Admin) Bulk import questions via structured JSON or CSV array.

### 6. Student Examination Lifecycle (`/api/exams`)
- `GET /api/exams` — List available exams for students.
- `GET /api/exams/:id` — Get sanitized exam details (hides correct answers for students).
- `POST /api/exams/:id/start` — Initialize exam attempt, starts server countdown timer, randomizes questions and options.
- `GET /api/exams/attempts/:attemptId` — Retrieve active attempt state and questions.
- `PUT /api/exams/attempts/:attemptId/answers` — Real-time autosave of student responses.
- `POST /api/exams/attempts/:attemptId/submit` — Final submission and deterministic grading.

### 7. Results & Analytics (`/api/results`, `/api/analytics`)
- `GET /api/results/my` — List current student's exam results and scorecards.
- `GET /api/results/:id` — Comprehensive exam result breakdown with question review.
- `GET /api/analytics/student` — Personalized student analytics (accuracy, strengths, weaknesses).
- `GET /api/analytics/admin` — Global platform KPIs, pass rates, and subject distributions.

### 8. Leaderboard (`/api/leaderboard`)
- `GET /api/leaderboard` — Global student rankings by points and score.
- `GET /api/leaderboard/stream/:streamId` — Department/stream-specific leaderboard.

### 9. Code Execution (`/api/coding`)
- `GET /api/coding/problems` — List coding problems with difficulty and tags.
- `GET /api/coding/problems/:id` — Problem statement, sample testcases, starter templates.
- `POST /api/coding/run` — Run user code against sample test cases via Judge0.
- `POST /api/coding/submit` — Submit code against all hidden test cases with runtime/memory profiling.

### 10. AI Chatbot Tutoring (`/api/ai`)
- `GET /api/ai/conversations` — Retrieve student conversation threads.
- `POST /api/ai/message` — Send academic question in **English** or **Telugu**; persists conversation and messages in MySQL.

### 11. Real-Time WebSockets (`Socket.IO`)
- Connection URL: `ws://localhost:5000`
- `join-exam-room` `{ attemptId, examId, userId }` — Join proctored examination room.
- `proctor-event` `{ eventType: 'TAB_SWITCH' | 'FULLSCREEN_EXIT', count }` — Log violation.
- `proctor-warning` — Server-dispatched warning to student when violation threshold is reached.

---

## 📄 License
Quentrix AI Academic Engine — All rights reserved.

