import { Routes, Route, Navigate } from 'react-router-dom';
import UploadPage from './pages/UploadPage';
import AnalysisPage from './pages/AnalysisPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<UploadPage />} />
      <Route path="/analysis" element={<AnalysisPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
