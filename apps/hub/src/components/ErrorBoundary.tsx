import { Component, type ReactNode } from 'react';
import { SentryService } from '../learnos/services/sentry';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  copied: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: undefined, copied: false };

  private copyResetTimer: ReturnType<typeof setTimeout> | null = null;

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, copied: false };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('[LearnOS] Error caught by boundary:', error, errorInfo);
    }

    SentryService.captureException(error, {
      componentStack: errorInfo.componentStack ?? 'N/A',
    });
  }

  componentWillUnmount() {
    if (this.copyResetTimer) {
      clearTimeout(this.copyResetTimer);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, copied: false });
  };

  handleCopyError = async () => {
    if (!this.state.error) return;
    const text = `Error: ${this.state.error.message}\nStack: ${this.state.error.stack ?? 'N/A'}`;
    try {
      await navigator.clipboard.writeText(text);
      this.setState({ copied: true });
      this.copyResetTimer = setTimeout(() => this.setState({ copied: false }), 2000);
    } catch {
      // Clipboard is not available in every browser context.
    }
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-pink-50 p-4 sm:p-8" role="alert" aria-live="assertive" aria-labelledby="error-title">
          <section className="text-center max-w-md">
            <div className="text-7xl mb-6 animate-bounce-slow" aria-hidden="true">
              🦚
            </div>
            <h2 id="error-title" className="text-3xl font-black text-gray-800 mb-3">
              Oops! Something went wrong
            </h2>
            <p className="text-gray-600 mb-2 text-lg">
              Don't worry, your progress is safe!
            </p>
            <p className="text-gray-500 mb-8">
              Let's try again or go back to explore more fun activities.
            </p>

            <div className="space-y-4">
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-2xl font-bold hover:from-orange-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg min-h-[52px] text-lg focus-visible:outline-2 focus-visible:outline-orange-500 focus-visible:outline-offset-2"
              >
                🔄 Try Again
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="w-full px-8 py-4 bg-white text-gray-700 rounded-2xl font-bold border-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all transform hover:scale-105 shadow-md min-h-[52px] text-lg focus-visible:outline-2 focus-visible:outline-orange-500 focus-visible:outline-offset-2"
              >
                🏠 Go Home
              </button>

              {import.meta.env.DEV && (
                <button
                  type="button"
                  onClick={this.handleCopyError}
                  className="w-full px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors min-h-[44px] text-sm focus-visible:outline-2 focus-visible:outline-gray-400 focus-visible:outline-offset-2"
                  aria-label={this.state.copied ? 'Error details copied to clipboard' : 'Copy error details to clipboard'}
                >
                  {this.state.copied ? '✓ Copied!' : '📋 Copy Error Details'}
                </button>
              )}
            </div>

            {import.meta.env.DEV && this.state.error && (
              <details className="mt-8 text-left">
                <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700 font-medium">
                  🔧 Technical details (for developers)
                </summary>
                <pre className="mt-3 p-4 bg-gray-100 rounded-xl text-sm text-gray-600 overflow-auto max-h-40 border border-gray-200">
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
