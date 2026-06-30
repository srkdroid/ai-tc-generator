import React from 'react';
import PropTypes from 'prop-types';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error in React component tree:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full glass-card p-8 flex flex-col items-center gap-4 animate-fade-in border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full text-red-500">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Something went wrong</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              An unexpected error occurred in the application interface. 
              {this.state.error && <span className="block mt-2 font-mono text-xs bg-white dark:bg-slate-800 p-2 rounded border border-gray-200 dark:border-slate-700 overflow-x-auto text-left text-red-600 dark:text-red-400">{this.state.error.message}</span>}
            </p>
            <button 
              onClick={this.handleReset}
              className="btn flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-gray-100 w-full justify-center"
            >
              <RefreshCcw size={16} />
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
};
