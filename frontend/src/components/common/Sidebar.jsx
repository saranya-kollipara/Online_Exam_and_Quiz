import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  Database,
  FileCheck2,
  Award,
  Trophy,
  Users,
  LineChart,
  Settings,
  BookOpen,
  History,
  Sparkles,
  Code2,
  BarChart3,
  BotMessageSquare,
  UserCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import styles from './Sidebar.module.css';

export default function Sidebar({ role = 'admin' }) {
  const [collapsed, setCollapsed] = useState(false);

  const adminNav = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'Create Exam', path: '/admin/create-exam', icon: <PlusCircle size={20} />, badge: 'AI' },
    { label: 'Question Bank', path: '/admin/question-bank', icon: <Database size={20} /> },
    { label: 'Manage Exams', path: '/admin/manage-exams', icon: <FileCheck2 size={20} /> },
    { label: 'Results', path: '/admin/results', icon: <Award size={20} /> },
    { label: 'Leaderboard', path: '/admin/leaderboard', icon: <Trophy size={20} /> },
    { label: 'Students', path: '/admin/students', icon: <Users size={20} /> },
    { label: 'AI Analytics', path: '/admin/analytics', icon: <LineChart size={20} /> },
    { label: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> }
  ];

  const studentNav = [
    { label: 'Overview', path: '/student/dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'Available Exams', path: '/student/available-exams', icon: <BookOpen size={20} />, badge: 'Live' },
    { label: 'My Exams', path: '/student/my-exams', icon: <History size={20} /> },
    { label: 'AI Mock Tests', path: '/student/mock-tests', icon: <Sparkles size={20} />, badge: 'New' },
    { label: 'Programming Practice', path: '/student/coding-practice', icon: <Code2 size={20} /> },
    { label: 'Performance Analysis', path: '/student/performance', icon: <BarChart3 size={20} /> },
    { label: 'Leaderboard', path: '/student/leaderboard', icon: <Trophy size={20} /> },
    { label: 'AI Assistant', path: '/student/ai-assistant', icon: <BotMessageSquare size={20} /> },
    { label: 'Profile', path: '/student/profile', icon: <UserCircle size={20} /> }
  ];

  const items = role === 'admin' ? adminNav : studentNav;

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      <div className={styles.navSection}>
        {!collapsed && (
          <div className={styles.sectionHeader}>
            {role === 'admin' ? 'Academic Administration' : 'Student Learning Hub'}
          </div>
        )}

        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `${styles.navItem} ${
                isActive
                  ? role === 'student'
                    ? `${styles.active} ${styles.studentActive}`
                    : styles.active
                  : ''
              }`
            }
            title={collapsed ? item.label : undefined}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            {!collapsed && <span className={styles.navLabel}>{item.label}</span>}
            {!collapsed && item.badge && (
              <span
                style={{
                  backgroundColor:
                    item.badge === 'AI' || item.badge === 'New'
                      ? 'var(--accent-primary)'
                      : 'var(--accent-secondary)',
                  color: item.badge === 'Live' ? '#191B18' : '#ffffff',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  padding: '0.15rem 0.45rem',
                  borderRadius: 'var(--radius-full)',
                  marginLeft: 'auto'
                }}
              >
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </div>

      <button
        className={styles.collapseToggle}
        onClick={() => setCollapsed(!collapsed)}
        aria-label="Toggle sidebar collapse"
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
    </aside>
  );
}

