import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUsers, deleteUser, exportUsers, exportUsersJSON } from '../api/user.api';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

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

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers(page, 10, search);
      setUsers(data.data);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      fetchUsers();
      setDeletingId(null);
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const handleExportPDF = async () => {
    try {
      const response = await exportUsersJSON();
      const allUsers = response.data;
      
      console.log('Generating PDF for users:', allUsers.length);
      const doc = new jsPDF();
      doc.text('TeamSync Directory Export', 14, 15);
      
      const tableData = allUsers.map((u, i) => [
        i + 1,
        `${u.firstName} ${u.lastName}`,
        u.email,
        u.phone,
        u.gender || 'N/A',
        u.status,
        new Date(u.createdAt).toLocaleDateString()
      ]);

      autoTable(doc, {
        head: [['S.No', 'Name', 'Email', 'Phone', 'Gender', 'Status', 'Joined']],
        body: tableData,
        startY: 20,
        theme: 'striped',
        headStyles: { fillColor: [55, 48, 163] }
      });

      doc.save('users.pdf');
      console.log('PDF downloaded successfully');
    } catch (error) {
      console.error('Failed to export data', error);
      alert('Failed to export data');
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Directory</h1>
          <p className="page-subtitle">Manage workspace members and their roles.</p>
        </div>
        <div className="flex-between gap-4">
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={exportUsers} className="btn btn-secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Export CSV
            </button>
            <button onClick={handleExportPDF} className="btn btn-secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              Export PDF
            </button>
          </div>
          <Link to="/users/new" className="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Add Member
          </Link>
        </div>
      </div>

      <div className="surface">
        <div className="surface-header">
          <div className="search-container">
            <div style={{ position: 'relative', width: '300px' }}>
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input
                type="text"
                className="form-control search-input"
                placeholder="Search by name or email..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (setSearch(searchInput), setPage(1))}
              />
            </div>
            <button className="btn btn-secondary" onClick={() => { setSearch(searchInput); setPage(1); }}>
              Search
            </button>
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Showing page {page} of {totalPages || 1}
          </div>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>S.No</th>
                <th>Member</th>
                <th>Contact</th>
                <th>Gender</th>
                <th>Status</th>
                <th>Joined</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    Loading members...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No members found matching your criteria.
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={user._id} onClick={() => navigate(`/users/${user._id}`)} style={{ cursor: 'pointer' }}>
                    <td>
                      <div style={{ color: 'var(--text-muted)', fontWeight: 500 }}>
                        {(page - 1) * 10 + index + 1}
                      </div>
                    </td>
                    <td>
                      <div className="flex-between" style={{ justifyContent: 'flex-start', gap: '0.75rem' }}>
                        <img 
                          src={getAvatarUrl(user)} 
                          alt={`${user.firstName} ${user.lastName}`} 
                          style={{ width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }} 
                        />
                        <div>
                          <div style={{ fontWeight: 500, color: 'var(--text-main)' }}>
                            {user.firstName} {user.lastName}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ color: 'var(--text-muted)' }}>{user.phone}</div>
                    </td>
                    <td>
                      <div style={{ color: 'var(--text-main)' }}>{user.gender || 'Other'}</div>
                    </td>
                    <td>
                      <span className={`badge ${user.status === 'Active' ? 'badge-success' : 'badge-neutral'}`}>
                        {user.status === 'Active' ? (
                          <span style={{ marginRight: '4px', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'currentColor', display: 'inline-block' }}></span>
                        ) : null}
                        {user.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ color: 'var(--text-muted)' }}>
                        {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                      <div className="flex-between gap-2" style={{ justifyContent: 'flex-end' }}>
                        <Link to={`/users/${user._id}`} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: 'var(--accent)' }}>
                          View
                        </Link>
                        <Link to={`/users/edit/${user._id}`} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                          Edit
                        </Link>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (deletingId === user._id) {
                              handleDelete(user._id);
                            } else {
                              setDeletingId(user._id);
                            }
                          }}
                          className="btn btn-secondary"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: deletingId === user._id ? '#fff' : 'var(--danger)', backgroundColor: deletingId === user._id ? 'var(--danger)' : '' }}
                        >
                          {deletingId === user._id ? 'Confirm?' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="surface-header" style={{ borderTop: '1px solid var(--border)', borderBottom: 'none' }}>
          <button
            className="btn btn-secondary"
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >
            Previous
          </button>
          <button
            className="btn btn-secondary"
            disabled={page >= totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default UserList;
