import { Component, ErrorInfo, ReactNode } from 'react';
import { trackEvent } from '@jigyasu/storage';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    
    trackEvent('react_error', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border-4 border-red-100">
            <div className="text-6xl mb-4">🔧</div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Oops! We hit a bump.</h1>
            <p className="text-slate-500 mb-6 font-medium">
              Something broke in the lab! Don't worry, the Owl is sending a report so we can fix it.
            </p>
            <button 
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-red-500/30"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
