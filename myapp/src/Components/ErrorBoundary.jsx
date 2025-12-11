import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, info: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    this.setState({ info })
    // Log for debugging
    // eslint-disable-next-line no-console
    console.error('Uncaught error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto', color: '#111' }}>
          <h2 style={{ marginTop: 0 }}>Something went wrong</h2>
          <p style={{ color: '#444' }}>An error occurred while rendering the app. Check the browser console for details.</p>
          <details style={{ whiteSpace: 'pre-wrap', background: '#fff', padding: 12, borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
            {this.state.error && String(this.state.error)}
            {this.state.info && '\n\n' + (this.state.info.componentStack || '')}
          </details>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary