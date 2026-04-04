import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AnalysisProvider } from './context/AnalysisContext';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import { Component } from 'react';

// Error Boundary to prevent full white screen crashes
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full p-8">
          <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-8 max-w-lg text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-red-500 mb-2">Something went wrong</h2>
            <p className="text-sm text-gray-500 mb-4">{this.state.error?.message || 'Unknown error'}</p>
            <button
              onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-xl text-sm font-bold transition-colors"
            >
              Reload App
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  const { darkMode } = useTheme();

  return (
    <Router>
      <div className={`flex h-screen font-sans overflow-hidden transition-colors duration-300 ${
        darkMode ? 'bg-gray-950 text-gray-100' : 'bg-[#f4f7fe] text-gray-800'
      }`}>
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto px-8 py-6">
            <div className="max-w-[1400px] mx-auto">
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/analytics" element={<Dashboard />} />
                  <Route path="/schedule" element={<Dashboard />} />
                  <Route path="/help" element={<Dashboard />} />
                  <Route path="/settings" element={<Dashboard />} />
                </Routes>
              </ErrorBoundary>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AnalysisProvider>
        <AppContent />
      </AnalysisProvider>
    </ThemeProvider>
  );
}

export default App;
