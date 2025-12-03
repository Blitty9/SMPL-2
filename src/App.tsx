import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LenisProvider from './components/providers/LenisProvider';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import LandingPage from './pages/LandingPage';
import EditorPage from './pages/EditorPage';
import ExamplesPage from './pages/ExamplesPage';
import ProductPage from './pages/ProductPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ThankYouPage from './pages/ThankYouPage';
import { useAnalytics } from './hooks/useAnalytics';

function AppContent() {
  useAnalytics(); // Track page views automatically

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={
          <LenisProvider>
            <LandingPage />
          </LenisProvider>
        } />
        <Route path="/product" element={
          <LenisProvider>
            <ProductPage />
          </LenisProvider>
        } />
        <Route path="/editor" element={
          <ErrorBoundary>
            <EditorPage />
          </ErrorBoundary>
        } />
        <Route path="/examples" element={<ExamplesPage />} />
        <Route path="/privacy" element={
          <LenisProvider>
            <PrivacyPage />
          </LenisProvider>
        } />
        <Route path="/terms" element={
          <LenisProvider>
            <TermsPage />
          </LenisProvider>
        } />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
