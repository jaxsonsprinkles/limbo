import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  render() {
    const { error } = this.state
    if (error) {
      return (
        <div style={{ padding: 20, fontFamily: 'monospace', fontSize: 12, color: '#c0392b', background: '#fff', height: '100vh', overflow: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
          <strong>Error</strong>
          {'\n\n'}{error.message}
          {'\n\n'}{error.stack}
        </div>
      )
    }
    return this.props.children
  }
}
