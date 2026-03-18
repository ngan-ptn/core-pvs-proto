import { Component, type ReactNode } from 'react'
import { Card, CardContent, Button } from '@tini/ui'
import { AlertTriangle } from 'lucide-react'

interface ErrorBoundaryProps {
  children: ReactNode
  title?: string
  message?: string
  retryLabel?: string
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  handleRetry = () => {
    this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card>
          <CardContent className="p-6 flex flex-col items-center gap-3 text-center">
            <div className="w-10 h-10 rounded-full bg-[var(--color-surface-muted)] flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-[var(--status-warning)]" />
            </div>
            <h3 className="text-sm font-semibold tracking-figma text-[var(--color-text-primary)]">
              {this.props.title}
            </h3>
            <p className="text-xs tracking-figma text-[var(--color-text-placeholder)] max-w-xs">
              {this.props.message}
            </p>
            <Button variant="outline" size="sm" className="tracking-figma mt-1" onClick={this.handleRetry}>
              {this.props.retryLabel}
            </Button>
          </CardContent>
        </Card>
      )
    }

    return this.props.children
  }
}
