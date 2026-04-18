import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class AdminViewErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Admin view crashed:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false });
    if (typeof this.props.onReset === 'function') {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-100">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 text-red-300" />
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-semibold text-white">This panel failed to load</h3>
                <p className="text-sm text-red-100/80">
                  The bulk import view hit a runtime error. The admin shell is still available.
                </p>
              </div>
              <button
                type="button"
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
              >
                <RefreshCw className="h-4 w-4" />
                Retry panel
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AdminViewErrorBoundary;