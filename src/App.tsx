import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MemberProfiles from './pages/MemberProfiles';
import DuesTracking from './pages/DuesTracking';
import ServiceHours from './pages/ServiceHours';
import Communications from './pages/Communications';
import AdminApprovals from './pages/AdminApprovals';
import AdminDashboard from './pages/AdminDashboard';
import TitleManagement from './pages/TitleManagement'; // Import the new component
import { Toaster } from './components/ui/toaster';
import './App.css';

// Mock user type
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'officer' | 'member' | 'national_hq' | 'regional' | 'chapter';
  chapter?: string;
  region?: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route 
            path="/login" 
            element={
              user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/members" 
            element={
              user ? <MemberProfiles user={user} onLogout={handleLogout} /> : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/dues" 
            element={
              user ? <DuesTracking user={user} onLogout={handleLogout} /> : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/service" 
            element={
              user ? <ServiceHours user={user} onLogout={handleLogout} /> : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/communications" 
            element={
              user ? <Communications user={user} onLogout={handleLogout} /> : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/admin" 
            element={
              user && (user.role === 'admin' || user.role === 'national_hq') ? 
              <AdminApprovals user={user} onLogout={handleLogout} /> : 
              <Navigate to="/dashboard" />
            } 
          />
          <Route 
            path="/admin-dashboard" 
            element={
              user && (user.role === 'admin' || user.role === 'national_hq') ? 
              <AdminDashboard user={user} onLogout={handleLogout} /> : 
              <Navigate to="/dashboard" />
            } 
          />
          <Route 
            path="/title-management" 
            element={
              user && (user.role === 'admin' || user.role === 'national_hq') ? 
              <TitleManagement user={user} onLogout={handleLogout} /> : 
              <Navigate to="/dashboard" />
            } 
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;