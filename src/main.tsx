import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { ErrorBoundary } from './components/ErrorBoundary'

window.onerror = (message, _source, _lineno, _colno, error) => {
  document.body.innerHTML = `<pre style="padding:20px;font-family:monospace;font-size:12px;color:#c0392b;white-space:pre-wrap;word-break:break-all"><strong>Uncaught Error</strong>\n\n${message}\n\n${error?.stack ?? ''}</pre>`
}

window.onunhandledrejection = (event) => {
  document.body.innerHTML = `<pre style="padding:20px;font-family:monospace;font-size:12px;color:#c0392b;white-space:pre-wrap;word-break:break-all"><strong>Unhandled Promise Rejection</strong>\n\n${event.reason?.stack ?? event.reason}</pre>`
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
)
