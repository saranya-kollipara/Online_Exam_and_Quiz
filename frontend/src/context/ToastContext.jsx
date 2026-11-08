import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({ title, message, type = 'info', duration = 4000 }) => {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    setToasts((prev) => [...prev, { id, title, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  }, [removeToast]);

  const success = useCallback((message, title = 'Success') => addToast({ title, message, type: 'success' }), [addToast]);
  const error = useCallback((message, title = 'Error') => addToast({ title, message, type: 'error' }), [addToast]);
  const warning = useCallback((message, title = 'Warning') => addToast({ title, message, type: 'warning' }), [addToast]);
  const info = useCallback((message, title = 'Notice') => addToast({ title, message, type: 'info' }), [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, warning, info }}>
      {children}
      <div
        style={{
          position: 'fixed',
          top: '1.5rem',
          right: '1.5rem',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          maxWidth: '380px',
          width: '100%',
          pointerEvents: 'none'
        }}
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              style={{
                pointerEvents: 'auto',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                padding: '0.9rem 1.1rem',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-medium)',
                borderLeft: `4px solid ${
                  toast.type === 'success'
                    ? 'var(--accent-secondary)'
                    : toast.type === 'error'
                    ? 'var(--status-danger)'
                    : toast.type === 'warning'
                    ? 'var(--accent-highlight)'
                    : 'var(--accent-primary)'
                }`,
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                color: 'var(--text-primary)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <div style={{ marginTop: '2px', flexShrink: 0 }}>
                {toast.type === 'success' && <CheckCircle2 size={18} color="var(--accent-secondary)" />}
                {toast.type === 'error' && <AlertCircle size={18} color="var(--status-danger)" />}
                {toast.type === 'warning' && <AlertTriangle size={18} color="var(--accent-highlight)" />}
                {toast.type === 'info' && <Info size={18} color="var(--accent-primary)" />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                {toast.title && (
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: '2px' }}>
                    {toast.title}
                  </div>
                )}
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {toast.message}
                </div>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                style={{
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center'
                }}
                aria-label="Dismiss toast"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

