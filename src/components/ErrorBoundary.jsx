import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('App crashed:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#0f1a14', color: '#fff', flexDirection: 'column', gap: '1rem',
          fontFamily: 'system-ui, sans-serif', padding: '2rem', textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem' }}>🍽️</div>
          <h1 style={{ fontSize: '1.8rem', color: '#D4AF37', margin: 0 }}>Savoury — Configuration Error</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '500px', lineHeight: 1.6 }}>
            The app failed to start. This is usually caused by missing environment variables
            (Firebase API keys) not being set on the hosting platform.
          </p>
          <pre style={{
            background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px',
            fontSize: '0.75rem', color: '#f87171', maxWidth: '600px', overflowX: 'auto',
            textAlign: 'left'
          }}>
            {this.state.error?.message || 'Unknown error'}
          </pre>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>
            Set VITE_FIREBASE_* environment variables in Vercel → Project Settings → Environment Variables
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
