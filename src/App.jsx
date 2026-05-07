import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import UserList from './pages/UserList';
import UserForm from './pages/UserForm';
import UserDetails from './pages/UserDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import { logout } from './api/auth.api';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  const { user, setUser } = useAuth();

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  return (
    <Router>
      <div className="app-layout">
        {user && (
          <header className="topbar">
            <Link to="/" className="brand">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              TeamSync
            </Link>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>{user.name}'s Workspace</span>
              <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>
                Logout
              </button>
            </div>
          </header>
        )}
        
        <main className="main-content" style={!user ? { display: 'flex', alignItems: 'center', justifyContent: 'center' } : {}}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/" element={<Navigate to="/users" replace />} />
            <Route path="/users" element={
              <ProtectedRoute>
                <UserList />
              </ProtectedRoute>
            } />
            <Route path="/users/new" element={
              <ProtectedRoute>
                <UserForm />
              </ProtectedRoute>
            } />
            <Route path="/users/edit/:id" element={
              <ProtectedRoute>
                <UserForm />
              </ProtectedRoute>
            } />
            <Route path="/users/:id" element={
              <ProtectedRoute>
                <UserDetails />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
