import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SidebarLayout from './components/SidebarLayout';
import LoginPage from './pages/LoginForm';
import RegisterForm from './pages/RegisterForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/*" element={<SidebarLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;