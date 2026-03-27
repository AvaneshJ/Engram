import React, { Suspense, lazy, Component } from "react";
import './App.css';
import { Routes, Route, Navigate } from "react-router-dom";

const Auth = lazy(() => import("./components/auth/Auth"));
const NewPage = lazy(() => import("./components/new_page/new_page"));
const ChatInterface = lazy(() => import("./components/chat_page/ChatInterface"));
const DiaryApp = lazy(() => import("./components/diary_page/DiaryApp"));
const LandingPage = lazy(() => import("./components/LandingPage/landing"));

const PageLoader = () => (
  <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", fontFamily: "system-ui, sans-serif" }}>
    Loading...
  </div>
);

const ErrorFallback = () => (
  <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", fontFamily: "system-ui, sans-serif", textAlign: "center" }}>
    <div>
      <h2>Failed to load page</h2>
      <p>Please try refreshing or go back to the <a href="/">home page</a></p>
    </div>
  </div>
);

// Error boundary for lazy loading failures
class LazyErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("Lazy loading error:", error);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}

// Public routes - accessible only when NOT logged in
// If logged in, redirect to /new_page
const PublicRoute = ({ element }) => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/new_page" replace /> : element;
};

// Protected routes - accessible only when logged in
// If not logged in, redirect to /auth
const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem("token");
  return !token ? <Navigate to="/auth" replace /> : element;
};

const App = () => {
  return (
    <div className="main-app-container">
      <Suspense fallback={<PageLoader />}>
        <LazyErrorBoundary>
          <Routes>
            {/* Public routes - only accessible when NOT logged in */}
            <Route path="/" element={<PublicRoute element={<LandingPage />} />} />
            <Route path="/auth" element={<PublicRoute element={<Auth />} />} />
            
            {/* Protected routes - only accessible when logged in */}
            <Route path="/new_page" element={<ProtectedRoute element={<NewPage />} />} />
            <Route path="/chat" element={<ProtectedRoute element={<ChatInterface />} />} />
            <Route path="/diary" element={<ProtectedRoute element={<DiaryApp />} />} />
            
            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </LazyErrorBoundary>
      </Suspense>
    </div>
  );
};

export default App;