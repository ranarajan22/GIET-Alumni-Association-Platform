import React from 'react';
import PropTypes from 'prop-types';

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      errorMessage: error?.message || 'Unexpected application error'
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error('AppErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-6">
          <div className="max-w-xl w-full rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Application Error</p>
            <h1 className="mt-2 text-2xl font-bold">Something went wrong while loading this page</h1>
            <p className="mt-3 text-sm text-slate-300 break-words">{this.state.errorMessage}</p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={this.handleReload}
                className="rounded-lg bg-cyan-600 hover:bg-cyan-500 px-4 py-2 text-sm font-semibold text-white"
              >
                Reload Page
              </button>
              <a
                href="/login"
                className="rounded-lg border border-slate-700 hover:border-slate-500 px-4 py-2 text-sm font-semibold text-slate-200"
              >
                Go to Login
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

AppErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppErrorBoundary;
