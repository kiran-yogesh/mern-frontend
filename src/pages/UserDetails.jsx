import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getUserById, deleteUser } from '../api/user.api';

const getAvatarUrl = (user) => {
  let hash = 0;
  if (user._id) {
    for (let i = 0; i < user._id.length; i++) {
      hash = user._id.charCodeAt(i) + ((hash << 5) - hash);
    }
  }
  const index = Math.abs(hash) % 90 + 1;

  if (user.gender === 'Male') return `https://randomuser.me/api/portraits/men/${index}.jpg`;
  if (user.gender === 'Female') return `https://randomuser.me/api/portraits/women/${index}.jpg`;
  return `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=c7d2fe&color=3730a3&bold=true`;
};

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserById(id);
        setUser(data.data);
      } catch (err) {
        setError('Failed to fetch user details');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleDelete = async () => {
    if (!isDeleting) {
      setIsDeleting(true);
      return;
    }
    try {
      await deleteUser(id);
      navigate('/users');
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-muted)' }}>Loading profile...</div>;
  if (error) return <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--danger)' }}>{error}</div>;
  if (!user) return <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-muted)' }}>User not found</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <Link to="/users" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            Back to Directory
          </Link>
          <h1 className="page-title">Member Profile</h1>
        </div>
        <div className="flex-between gap-4">
          <Link to={`/users/edit/${user._id}`} className="btn btn-secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            Edit
          </Link>
          <button onClick={handleDelete} className="btn btn-danger">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            {isDeleting ? 'Click again to confirm' : 'Delete'}
          </button>
        </div>
      </div>

      <div className="surface" style={{ marginBottom: '2rem' }}>
        <div className="profile-header-container">
          <img 
            src={getAvatarUrl(user)} 
            alt={`${user.firstName} ${user.lastName}`} 
            style={{
              width: '96px',
              height: '96px',
              borderRadius: '50%',
              boxShadow: '0 4px 14px 0 rgba(37, 99, 235, 0.39)',
              flexShrink: 0,
              objectFit: 'cover'
            }}
          />
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
              {user.firstName} {user.lastName}
            </h2>
            <div style={{ color: 'var(--text-muted)', marginBottom: '0.75rem', fontSize: '1rem' }}>
              {user.email}
            </div>
            <span className={`badge ${user.status === 'Active' ? 'badge-success' : 'badge-neutral'}`}>
              {user.status === 'Active' ? (
                <span style={{ marginRight: '6px', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'currentColor', display: 'inline-block' }}></span>
              ) : null}
              {user.status}
            </span>
          </div>
        </div>

        <div className="profile-grid">
          <div className="profile-grid-col-1">
            <h3 style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>
              Contact Information
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Email Address</div>
                <div style={{ fontWeight: 500 }}>{user.email}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Phone Number</div>
                <div style={{ fontWeight: 500 }}>{user.phone}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Gender</div>
                <div style={{ fontWeight: 500 }}>{user.gender || 'Not specified'}</div>
              </div>
            </div>
          </div>
          
          <div className="profile-grid-col-2">
            <h3 style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>
              System Details
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Join Date</div>
                <div style={{ fontWeight: 500 }}>
                  {new Date(user.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
