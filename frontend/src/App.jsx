import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ExamProvider } from './context/ExamContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import StudentLayout from './layouts/StudentLayout';
import ExamLayout from './layouts/ExamLayout';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import AboutPage from './pages/public/AboutPage';
import FeaturesPage from './pages/public/FeaturesPage';
import ContactPage from './pages/public/ContactPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateExamPage from './pages/admin/CreateExamPage';
import QuestionBankPage from './pages/admin/QuestionBankPage';
import ManageExamsPage from './pages/admin/ManageExamsPage';
import ResultsPage from './pages/admin/ResultsPage';
import AdminLeaderboardPage from './pages/admin/AdminLeaderboardPage';
import StudentsPage from './pages/admin/StudentsPage';
import AIAnalyticsPage from './pages/admin/AIAnalyticsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import AvailableExamsPage from './pages/student/AvailableExamsPage';
import MyExamsPage from './pages/student/MyExamsPage';
import AIMockTestsPage from './pages/student/AIMockTestsPage';
import CodingPracticePage from './pages/coding/CodingPracticePage';
import PerformanceAnalysisPage from './pages/student/PerformanceAnalysisPage';
import StudentLeaderboardPage from './pages/student/StudentLeaderboardPage';
import AIAssistantPage from './pages/chatbot/AIAssistantPage';
import StudentProfilePage from './pages/student/StudentProfilePage';

// Exam Taking Pages
import ExamInstructionsPage from './pages/exams/ExamInstructionsPage';
import ExamTakingPage from './pages/exams/ExamTakingPage';
import ExamResultPage from './pages/exams/ExamResultPage';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <ExamProvider>
            <Routes>
              {/* Public Website Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/features" element={<FeaturesPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/auth/login" element={<LoginPage />} />
                <Route path="/auth/register" element={<RegisterPage />} />
                <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/exam/:examId/instructions" element={<ExamInstructionsPage />} />
                <Route path="/exam/:examId/result" element={<ExamResultPage />} />
              </Route>

              {/* Admin Portal Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="create-exam" element={<CreateExamPage />} />
                <Route path="question-bank" element={<QuestionBankPage />} />
                <Route path="manage-exams" element={<ManageExamsPage />} />
                <Route path="results" element={<ResultsPage />} />
                <Route path="leaderboard" element={<AdminLeaderboardPage />} />
                <Route path="students" element={<StudentsPage />} />
                <Route path="analytics" element={<AIAnalyticsPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
              </Route>

              {/* Student Learning Portal Routes */}
              <Route path="/student" element={<StudentLayout />}>
                <Route index element={<Navigate to="/student/dashboard" replace />} />
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="available-exams" element={<AvailableExamsPage />} />
                <Route path="my-exams" element={<MyExamsPage />} />
                <Route path="mock-tests" element={<AIMockTestsPage />} />
                <Route path="coding-practice" element={<CodingPracticePage />} />
                <Route path="performance" element={<PerformanceAnalysisPage />} />
                <Route path="leaderboard" element={<StudentLeaderboardPage />} />
                <Route path="ai-assistant" element={<AIAssistantPage />} />
                <Route path="profile" element={<StudentProfilePage />} />
              </Route>

              {/* Distraction-Free Exam Execution Room */}
              <Route element={<ExamLayout />}>
                <Route path="/exam/:examId" element={<ExamTakingPage />} />
              </Route>

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ExamProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

