import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createUser, getUserById, updateUser } from '../api/user.api';

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: 'Other',
    status: 'Active'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      const fetchUser = async () => {
        try {
          const data = await getUserById(id);
          setFormData(data.data);
        } catch (err) {
          setApiError('Failed to load user details.');
        }
      };
      fetchUser();
    }
  }, [id, isEditMode]);

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First Name is required';
    if (!formData.lastName) newErrors.lastName = 'Last Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be 10 digits';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setApiError('');
    try {
      if (isEditMode) {
        await updateUser(id, formData);
      } else {
        await createUser(formData);
      }
      navigate('/users');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <Link to="/users" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            Back to Directory
          </Link>
          <h1 className="page-title">{isEditMode ? 'Edit Member Profile' : 'Add New Member'}</h1>
        </div>
      </div>

      <div className="surface">
        <form onSubmit={handleSubmit}>
          <div style={{ padding: '2rem' }}>
            {apiError && (
              <div style={{ backgroundColor: '#fef2f2', color: 'var(--danger)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', border: '1px solid #fecaca' }}>
                {apiError}
              </div>
            )}
            
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>Personal Information</h3>
            
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  className={`form-control ${errors.firstName ? 'error' : ''}`}
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="e.g. Jane"
                />
                {errors.firstName && <span className="error-text">{errors.firstName}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  className={`form-control ${errors.lastName ? 'error' : ''}`}
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="e.g. Doe"
                />
                {errors.lastName && <span className="error-text">{errors.lastName}</span>}
              </div>

              <div className="form-group full-width">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className={`form-control ${errors.email ? 'error' : ''}`}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="jane.doe@company.com"
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  className={`form-control ${errors.phone ? 'error' : ''}`}
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit number"
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Gender</label>
                <select
                  name="gender"
                  className="form-control"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Account Status</label>
                <select
                  name="status"
                  className="form-control"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ padding: '1.25rem 2rem', backgroundColor: 'var(--bg-app)', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <Link to="/users" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
