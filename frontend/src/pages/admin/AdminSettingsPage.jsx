import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { Settings, Shield, Bell, Key, Save } from 'lucide-react';

export default function AdminSettingsPage() {
  const { user, updateProfile } = useAuth();
  const { success } = useToast();

  const [profileData, setProfileData] = useState({
    name: user?.name || 'Dr. Aris Thorne',
    email: user?.email || 'admin@quentrix.ai',
    institution: user?.institution || 'National Institute of Technology & AI',
    title: user?.title || 'Head of Examination & Academic Assessment'
  });

  const [platformSettings, setPlatformSettings] = useState({
    autoShuffleQuestions: true,
    autoShuffleOptions: true,
    enforceFullscreen: true,
    defaultNegativeMarks: 0.5,
    judge0TimeoutMs: 5000,
    allowTeluguChatbot: true
  });

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    await updateProfile(profileData);
    success('Administrator profile settings updated.');
  };

  const handleSavePlatform = (e) => {
    e.preventDefault();
    success('Examination engine parameters updated.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '960px' }}>
      <div>
        <h1 className="heading-2" style={{ margin: 0 }}>System Settings & Policies</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
          Manage administrator profile credentials, examination defaults, and automated proctoring rules.
        </p>
      </div>

      {/* Admin Profile */}
      <Card title="Administrator Identity" subtitle="Academic credentials and institutional affiliation">
        <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <Input
              label="Full Name & Title"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
            />
            <Input
              label="Institutional Email"
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <Input
              label="Institution / University"
              value={profileData.institution}
              onChange={(e) => setProfileData({ ...profileData, institution: e.target.value })}
            />
            <Input
              label="Departmental Role"
              value={profileData.title}
              onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <Button type="submit" variant="primary" size="md" leftIcon={<Save size={16} />}>
              Save Identity Details
            </Button>
          </div>
        </form>
      </Card>

      {/* Platform Assessment Policies */}
      <Card title="Examination Engine Defaults" subtitle="Global assessment execution and integrity parameters">
        <form onSubmit={handleSavePlatform} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.9rem' }}>
              <input
                type="checkbox"
                checked={platformSettings.autoShuffleQuestions}
                onChange={(e) => setPlatformSettings({ ...platformSettings, autoShuffleQuestions: e.target.checked })}
                style={{ accentColor: 'var(--accent-primary)', width: '18px', height: '18px' }}
              />
              <div>
                <strong>Auto-Shuffle Question Order</strong>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Randomizes candidate question order automatically during live exams.</div>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.9rem' }}>
              <input
                type="checkbox"
                checked={platformSettings.autoShuffleOptions}
                onChange={(e) => setPlatformSettings({ ...platformSettings, autoShuffleOptions: e.target.checked })}
                style={{ accentColor: 'var(--accent-primary)', width: '18px', height: '18px' }}
              />
              <div>
                <strong>Shuffle Multiple Choice Options</strong>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Permutes options A/B/C/D while preserving verified key pairings.</div>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.9rem' }}>
              <input
                type="checkbox"
                checked={platformSettings.enforceFullscreen}
                onChange={(e) => setPlatformSettings({ ...platformSettings, enforceFullscreen: e.target.checked })}
                style={{ accentColor: 'var(--accent-primary)', width: '18px', height: '18px' }}
              />
              <div>
                <strong>Enforce Distraction-Free Fullscreen Prompt</strong>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Triggers browser fullscreen request when candidate starts an assessment.</div>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.9rem' }}>
              <input
                type="checkbox"
                checked={platformSettings.allowTeluguChatbot}
                onChange={(e) => setPlatformSettings({ ...platformSettings, allowTeluguChatbot: e.target.checked })}
                style={{ accentColor: 'var(--accent-primary)', width: '18px', height: '18px' }}
              />
              <div>
                <strong>Enable Regional Telugu Language Academic AI</strong>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Permits students to interact with Quentrix AI in Telugu script.</div>
              </div>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <Button type="submit" variant="primary" size="md" leftIcon={<Save size={16} />}>
              Save Engine Defaults
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

