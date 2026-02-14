import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    textAlign: 'center',
                    fontFamily: "'Baloo 2', cursive",
                    color: '#37474F',
                    backgroundColor: '#E0F7FA',
                    padding: '20px'
                }}>
                    <h1 style={{ color: '#4CAF50', marginBottom: '10px' }}>Something went wrong 🌱</h1>
                    <p style={{ fontSize: '1.2rem', margin: '0 0 20px 0' }}>Please restart the app.</p>
                    <p style={{ fontSize: '0.9rem', color: '#666', fontStyle: 'italic' }}>Your progress is safe.</p>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
