import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Nails by Sirii App Error]:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          backgroundColor: '#FAF7F5',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          color: '#262220',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '480px',
            backgroundColor: '#ffffff',
            padding: '32px',
            borderRadius: '24px',
            boxShadow: '0 10px 25px rgba(217, 110, 133, 0.12)',
            border: '1px solid #F3C5CE'
          }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>💅✨</div>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 8px', color: '#1a1817' }}>
              Nails by Sirii Studio
            </h2>
            <p style={{ fontSize: '13px', color: '#736B66', margin: '0 0 16px', lineHeight: 1.5 }}>
              The application encountered a temporary display issue.
            </p>
            {this.state.error && (
              <pre style={{
                textAlign: 'left',
                backgroundColor: '#FFF5F7',
                border: '1px solid #FCE4E9',
                padding: '12px',
                borderRadius: '12px',
                fontSize: '11px',
                color: '#D96E85',
                overflowX: 'auto',
                marginBottom: '20px',
                whiteSpace: 'pre-wrap'
              }}>
                {this.state.error.message || String(this.state.error)}
              </pre>
            )}
            <button
              onClick={() => {
                window.location.hash = '';
                window.location.search = '';
                window.location.reload();
              }}
              style={{
                backgroundColor: '#D96E85',
                color: '#ffffff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '14px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Reload Website 💕
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
