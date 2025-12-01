import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LenisProvider from './components/providers/LenisProvider';
import LandingPage from './pages/LandingPage';
import EditorPage from './pages/EditorPage';
import ExamplesPage from './pages/ExamplesPage';
import ProductPage from './pages/ProductPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';

function App() {
  return (
    <BrowserRouter>
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
        <Route path="/editor" element={<EditorPage />} />
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
