import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Button from './Button';
import Badge from './Badge';
import {
  BrainCircuit,
  Sparkles,
  ArrowRightLeft,
  LogOut,
  User,
  Menu,
  X,
  Shield,
  GraduationCap
} from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar({ variant = 'public' }) {
  const { user, isAuthenticated, isAdmin, isStudent, switchRole, logout } = useAuth();
  const { info } = useToast();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleRoleToggle = () => {
    const nextRole = isAdmin ? 'student' : 'admin';
    switchRole(nextRole);
    info(`Switched interface role to ${nextRole.toUpperCase()}`);
    if (nextRole === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/student/dashboard');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  return (
    <header className={styles.navbar}>
      <div className={`container ${styles.inner}`}>
        {/* Brand */}
        <Link to="/" className={styles.brand}>
          <div className={styles.logoIcon}>
            <BrainCircuit size={22} />
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandName}>
              Quentrix <span className={styles.brandAi}>AI</span>
            </span>
            <span className={styles.brandTagline}>
              Learn Smarter. Practice Better. Perform Higher.
            </span>
          </div>
        </Link>

        {/* Public Navigation Links */}
        {variant === 'public' && (
          <nav className={styles.navLinks}>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/features"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
            >
              Platform Features
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
            >
              Contact
            </NavLink>
          </nav>
        )}

        {/* Right actions */}
        <div className={styles.actions}>
          {/* Quick Role Switcher Button - visible for rapid demo testing */}
          <button
            onClick={handleRoleToggle}
            className={styles.roleSwitcherBtn}
            title="Toggle between Admin and Student experience"
          >
            <ArrowRightLeft size={13} />
            <span>Role: {isAdmin ? 'Admin' : 'Student'}</span>
            <Badge variant={isAdmin ? 'primary' : 'secondary'}>
              {isAdmin ? 'Admin' : 'Student'}
            </Badge>
          </button>

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link
                to={isAdmin ? '/admin/dashboard' : '/student/dashboard'}
                className={styles.userProfile}
              >
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
                  alt={user?.name}
                  className={styles.userAvatar}
                />
                <div className={styles.userInfo}>
                  <span className={styles.userName}>{user?.name?.split(' ')[0]}</span>
                  <span className={styles.userRole}>
                    {isAdmin ? 'Academic Admin' : 'Student'}
                  </span>
                </div>
              </Link>

              <button
                onClick={handleLogout}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '6px'
                }}
                title="Sign out"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/auth/login')}
              >
                Log In
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/auth/register')}
                rightIcon={<Sparkles size={14} />}
              >
                Get Started
              </Button>
            </div>
          )}

          <button
            className={styles.mobileToggle}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '70px',
            left: 0,
            width: '100%',
            backgroundColor: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-medium)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            zIndex: 99
          }}
        >
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link to="/features" onClick={() => setMobileMenuOpen(false)}>Features</Link>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)}>About</Link>
          <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
          <Link
            to={isAdmin ? '/admin/dashboard' : '/student/dashboard'}
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: 'var(--accent-highlight)', fontWeight: 600 }}
          >
            Go to {isAdmin ? 'Admin Console' : 'Student Portal'}
          </Link>
        </div>
      )}
    </header>
  );
}

