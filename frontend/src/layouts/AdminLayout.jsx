import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';

export default function AdminLayout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      <Navbar variant="admin" />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar role="admin" />
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

