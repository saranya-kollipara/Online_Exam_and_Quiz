import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { BrainCircuit, Lock, Mail, ArrowRight, AlertCircle, UserPlus } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(null);
    try {
      const user = await login({ email, password });
      success(`Welcome back, ${user.name || user.firstName || 'User'}!`);
      const userRole = String(user.role || '').toLowerCase();
      if (userRole === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      const msg = err.message || 'Login failed. Please check your credentials.';
      const isNotFound = msg.toLowerCase().includes('no account found') || msg.toLowerCase().includes('sign up');
      setLoginError({ message: msg, isNotFound });
      toastError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 70px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        backgroundColor: 'var(--bg-primary)'
      }}
    >
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-highlight))',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              marginBottom: '1rem',
              boxShadow: '0 0 20px var(--accent-primary-glow)'
            }}
          >
            <BrainCircuit size={26} />
          </div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
            Sign In to Quentrix AI
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Learn Smarter. Practice Better. Perform Higher.
          </p>
        </div>

        <Card style={{ padding: '2rem' }}>
          {loginError && (
            <div
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.9rem 1.1rem',
                marginBottom: '1.25rem',
                color: '#f87171',
                fontSize: '0.88rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                <AlertCircle size={18} color="#ef4444" />
                <span>{loginError.message}</span>
              </div>
              {loginError.isNotFound && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={() => navigate('/auth/register')}
                    rightIcon={<UserPlus size={14} />}
                    style={{
                      fontWeight: 700,
                      padding: '0.45rem 0.9rem',
                      fontSize: '0.82rem'
                    }}
                  >
                    Sign up to continue
                  </Button>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Input
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              leftIcon={<Mail size={16} />}
            />

            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              leftIcon={<Lock size={16} />}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: 'var(--accent-primary)' }}
                />
                Remember me
              </label>

              <Link to="/auth/forgot-password" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              rightIcon={<ArrowRight size={16} />}
              style={{ marginTop: '0.5rem' }}
            >
              Sign In
            </Button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Don't have an account yet?{' '}
            <Link to="/auth/register" style={{ color: 'var(--accent-secondary)', fontWeight: 600 }}>
              Create an Account
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

