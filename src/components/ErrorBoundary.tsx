import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback error={this.state.error} onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  onReset: () => void;
}

function ErrorFallback({ error, onReset }: ErrorFallbackProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0C0D10] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#111215] border border-[#2F333A] rounded-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
        </div>
        
        <h1 className="text-2xl font-semibold text-[#ECECEC] mb-2">
          Something went wrong
        </h1>
        
        <p className="text-graphite-gray mb-6">
          We encountered an unexpected error. Don't worry, your data is safe.
        </p>

        {error && (
          <details className="mb-6 text-left">
            <summary className="text-sm text-graphite-gray cursor-pointer hover:text-[#ECECEC] mb-2">
              Error details
            </summary>
            <div className="mt-2 p-3 bg-[#0C0D10] border border-[#2F333A] rounded text-xs font-mono text-red-400 overflow-auto max-h-32">
              {error.message}
            </div>
          </details>
        )}

        <div className="flex flex-col gap-3">
          <Button
            onClick={onReset}
            className="w-full bg-[#6D5AE0] hover:bg-[#7a68e6] text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try again
          </Button>
          
          <Button
            onClick={() => {
              navigate('/');
              onReset();
            }}
            variant="outline"
            className="w-full border-[#2F333A] text-[#ECECEC] hover:bg-[#1A1D21]"
          >
            <Home className="w-4 h-4 mr-2" />
            Go home
          </Button>
        </div>
      </div>
    </div>
  );
}

