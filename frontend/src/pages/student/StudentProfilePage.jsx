import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { User, Mail, School, BookOpen, Lock, Save, Camera } from 'lucide-react';

export default function StudentProfilePage() {
  const { user, updateProfile } = useAuth();
  const { success, error: toastError } = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || 'Aditya Vardhan',
    email: user?.email || 'student@quentrix.ai',
    institution: user?.institution || 'Indian Institute of Engineering & Technology',
    stream: user?.stream || 'Computer Science & Engineering',
    yearOfStudy: user?.yearOfStudy || '3rd Year (Semester 6)',
    rollNo: user?.rollNo || '22CS8042'
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateProfile(formData);
      success('Student academic profile updated.');
    } catch (err) {
      toastError('Update failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toastError('New passwords do not match');
      return;
    }
    success('Password updated successfully.');
    setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '850px' }}>
      <div>
        <h1 className="heading-2" style={{ margin: 0 }}>Student Profile & Academic Settings</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
          Manage your student identity, institutional credentials, and security settings.
        </p>
      </div>

      {/* Profile Overview Card */}
      <Card style={{ padding: '1.75rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative' }}>
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=250&q=80'}
            alt="Student Avatar"
            style={{ width: '84px', height: '84px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--accent-primary)' }}
          />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              {formData.name}
            </h3>
            <Badge variant="secondary">Verified Candidate</Badge>
          </div>
          <div style={{ fontSize: '0.88rem', color: 'var(--accent-highlight)', marginBottom: '0.4rem' }}>
            {formData.rollNo} • {formData.stream}
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {formData.institution} • {formData.yearOfStudy}
          </div>
        </div>
      </Card>

      {/* Details Form */}
      <Card title="Student Information" subtitle="Update official academic records">
        <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              leftIcon={<User size={16} />}
            />
            <Input
              label="Registered Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              leftIcon={<Mail size={16} />}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <Input
              label="Institution / University"
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              leftIcon={<School size={16} />}
            />
            <Input
              label="Roll / Registration No"
              value={formData.rollNo}
              onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <Input
              label="Engineering Stream"
              value={formData.stream}
              onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
            />
            <Input
              label="Year of Study"
              value={formData.yearOfStudy}
              onChange={(e) => setFormData({ ...formData, yearOfStudy: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <Button type="submit" variant="primary" size="md" isLoading={isLoading} leftIcon={<Save size={16} />}>
              Save Academic Profile
            </Button>
          </div>
        </form>
      </Card>

      {/* Password Update Interface */}
      <Card title="Security & Authentication" subtitle="Update your account password">
        <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
          <Input
            label="Current Password"
            type="password"
            value={passwords.currentPassword}
            onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
            placeholder="••••••••"
            leftIcon={<Lock size={16} />}
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <Input
              label="New Password"
              type="password"
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              placeholder="••••••••"
              leftIcon={<Lock size={16} />}
            />
            <Input
              label="Confirm New Password"
              type="password"
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
              placeholder="••••••••"
              leftIcon={<Lock size={16} />}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <Button type="submit" variant="secondary" size="md">
              Update Password
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

