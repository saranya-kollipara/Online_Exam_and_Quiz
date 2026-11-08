import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';

export default function StudentLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)', color: 'var(--text-secondary)' }}>
        Loading student workspace...
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      <Navbar variant="student" />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar role="student" />
        <main
          style={{
            flex: 1,
            padding: '2rem',
            overflowY: 'auto',
            maxWidth: '100%'
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

