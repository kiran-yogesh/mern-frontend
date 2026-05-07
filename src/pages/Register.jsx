import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/auth.api';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await register(name, email, password);
      setUser(user);
      navigate('/users');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto' }}>
      <div className="surface" style={{ padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 className="page-title" style={{ fontSize: '1.5rem' }}>Create Account</h1>
          <p className="page-subtitle">Start managing your workspace today.</p>
        </div>
        
        {error && <div style={{ backgroundColor: '#fef2f2', color: 'var(--danger)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid #fecaca', fontSize: '0.875rem' }}>{error}</div>}

        <form onSubmit={handleRegister}>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              className="form-control" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-control" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-control" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>Log In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
