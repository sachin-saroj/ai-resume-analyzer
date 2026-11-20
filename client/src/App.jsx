import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AnalysisProvider } from './context/AnalysisContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Auth from './pages/Auth';
import Analytics from './pages/Analytics';
import Schedule from './pages/Schedule';
import Help from './pages/Help';
import Settings from './pages/Settings';
import ScrollProgress from './components/ui/ScrollProgress';
import { Component, useEffect } from 'react';
import Lenis from 'lenis';

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

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const { darkMode } = useTheme();

  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center h-screen transition-colors duration-300 ${
        darkMode ? 'bg-gray-950 text-white' : 'bg-neutral-light text-gray-800'
      }`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
        <p className="mt-4 text-xs font-bold tracking-widest uppercase opacity-75 animate-pulse">Verifying Credentials...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

// Route for Guest users (Auth screen)
function AuthRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppContent() {
  const { user } = useAuth();

  useEffect(() => {
    let lenisInstance;
    try {
      lenisInstance = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      function raf(time) {
        lenisInstance?.raf(time);
        requestAnimationFrame(raf);
      }

      const id = requestAnimationFrame(raf);
      return () => {
        cancelAnimationFrame(id);
        lenisInstance?.destroy();
      };
    } catch (e) {
      console.warn('Lenis initialization skipped:', e);
    }
  }, []);

  return (
    <Router>
      <ScrollProgress />
      <div className="min-h-screen font-sans transition-colors duration-300 flex flex-col bg-[var(--background)] text-[var(--text-main)]">
        {user && <Navbar />}
        <main className={`flex-1 w-full ${user ? 'pb-16' : ''}`}>
          <div className={user ? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' : 'h-full w-full'}>
            <ErrorBoundary>
              <Routes>
                <Route path="/auth" element={
                  <AuthRoute>
                    <Auth />
                  </AuthRoute>
                } />
                <Route path="/" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/history" element={
                  <ProtectedRoute>
                    <History />
                  </ProtectedRoute>
                } />
                <Route path="/analytics" element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                } />
                <Route path="/schedule" element={
                  <ProtectedRoute>
                    <Schedule />
                  </ProtectedRoute>
                } />
                <Route path="/help" element={
                  <ProtectedRoute>
                    <Help />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AnalysisProvider>
          <AppContent />
        </AnalysisProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
