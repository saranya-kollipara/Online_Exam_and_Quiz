import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { STREAMS } from '../../utils/mockData';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { BrainCircuit, Lock, Mail, User, School, Sparkles } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    institution: '',
    stream: 'cse',
    yearOfStudy: '3rd Year'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toastError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const user = await register(formData);
      success(`Account created successfully for ${user.name}!`);
      navigate('/student/dashboard');
    } catch (err) {
      toastError(err.message || 'Registration failed');
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
        padding: '2.5rem 1.5rem',
        backgroundColor: 'var(--bg-primary)'
      }}
    >
      <div style={{ width: '100%', maxWidth: '580px' }}>
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
            Register Student Account
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Join your university cohort and access intelligent exam assessments.
          </p>
        </div>

        <Card style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <Input
                label="Full Name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Aditya Vardhan"
                leftIcon={<User size={16} />}
              />

              <Input
                label="Official Student Email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="aditya.v@university.edu"
                leftIcon={<Mail size={16} />}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <Input
                label="Password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Create strong password"
                leftIcon={<Lock size={16} />}
              />

              <Input
                label="Confirm Password"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Re-enter password"
                leftIcon={<Lock size={16} />}
              />
            </div>

            <Input
              label="College / Institution"
              required
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              placeholder="e.g. Indian Institute of Information Technology"
              leftIcon={<School size={16} />}
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <Input
                as="select"
                label="Engineering Stream"
                value={formData.stream}
                onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
              >
                {STREAMS.map((s) => (
                  <option key={s.id} value={s.id} style={{ background: '#252923' }}>
                    {s.name}
                  </option>
                ))}
              </Input>

              <Input
                as="select"
                label="Year of Study"
                value={formData.yearOfStudy}
                onChange={(e) => setFormData({ ...formData, yearOfStudy: e.target.value })}
              >
                <option value="1st Year" style={{ background: '#252923' }}>1st Year (Freshman)</option>
                <option value="2nd Year" style={{ background: '#252923' }}>2nd Year (Sophomore)</option>
                <option value="3rd Year" style={{ background: '#252923' }}>3rd Year (Junior)</option>
                <option value="4th Year" style={{ background: '#252923' }}>4th Year (Senior)</option>
              </Input>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              rightIcon={<Sparkles size={16} />}
              style={{ marginTop: '0.5rem' }}
            >
              Complete Registration
            </Button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Already have an active student profile?{' '}
            <Link to="/auth/login" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
              Sign In Instead
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

