import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';

export default function StudentLayout() {
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

