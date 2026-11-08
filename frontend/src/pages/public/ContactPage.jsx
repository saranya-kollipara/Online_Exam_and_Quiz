import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { useToast } from '../../hooks/useToast';
import { Mail, MapPin, Phone, Building2, Send } from 'lucide-react';

export default function ContactPage() {
  const { success } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    institution: '',
    role: 'Faculty / Professor',
    message: ''
  });
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsSending(false);
    success('Your inquiry has been received. Our academic team will respond within 24 hours.');
    setFormData({ name: '', email: '', institution: '', role: 'Faculty / Professor', message: '' });
  };

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '1000px' }}>
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <Badge variant="secondary" style={{ marginBottom: '0.85rem' }}>Institutional Inquiries</Badge>
        <h1 className="heading-1" style={{ marginBottom: '1rem' }}>
          Partner With Quentrix AI
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '650px', margin: '0 auto', lineHeight: 1.6 }}>
          Schedule a tailored platform demonstration for your department, college, or university assessment council.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
        {/* Contact Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Card style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--accent-highlight)' }}>
              Academic Operations Hub
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <Mail size={18} color="var(--accent-primary)" />
                <span>academics@quentrix.ai</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <Phone size={18} color="var(--accent-secondary)" />
                <span>+91 (080) 4128-9200</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                <MapPin size={18} color="var(--accent-highlight)" style={{ marginTop: '2px' }} />
                <span>Quentrix Academic AI Labs, Tech Park Avenue, Bangalore, KA, India</span>
              </div>
            </div>
          </Card>

          <Card style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              Campus Pilot Inquiries
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Universities with 500+ engineering students are eligible for a 60-day complimentary proctored pilot including custom Judge0 container configurations.
            </p>
          </Card>
        </div>

        {/* Contact Form */}
        <Card style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <Input
              label="Your Full Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Dr. Radhika Sharma"
            />
            <Input
              label="Official Institutional Email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="r.sharma@nitb.ac.in"
            />
            <Input
              label="College / University Name"
              required
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              placeholder="National Institute of Technology"
            />
            <Input
              as="select"
              label="Your Academic Role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="Head of Department" style={{ background: '#252923' }}>Head of Department (HOD)</option>
              <option value="Faculty / Professor" style={{ background: '#252923' }}>Faculty / Professor</option>
              <option value="Dean of Examinations" style={{ background: '#252923' }}>Dean of Examinations</option>
              <option value="Student Representative" style={{ background: '#252923' }}>Student Representative</option>
            </Input>
            <Input
              as="textarea"
              label="Message or Pilot Request"
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="We are looking to conduct midterm programming assessments for 300 Computer Science students..."
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSending}
              rightIcon={<Send size={15} />}
            >
              Submit Partnership Request
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

