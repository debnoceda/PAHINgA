import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';
import NavigationBar from '../components/NavigationBar';
import FloatingActionButton from '../components/FloatingActionButton';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { Icon } from '@iconify/react';

const Profile = () => {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState('name');
  const [email, setEmail] = useState('sjvbsv@gmail.com');
  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ username: '', newEmail: '', confirmEmail: '' });

  const handleEditProfile = () => {
    setEditMode(true);
    setNewEmail('');
    setConfirmEmail('');
    setFieldErrors({ username: '', newEmail: '', confirmEmail: '' });
  };

  const handleCancel = () => {
    setEditMode(false);
    setFieldErrors({ username: '', newEmail: '', confirmEmail: '' });
  };

  const handleSave = async () => {
    // Basic validation
    let errors = { username: '', newEmail: '', confirmEmail: '' };
    if (!username.trim()) errors.username = 'Username is required';
    if (!newEmail.trim()) errors.newEmail = 'New email is required';
    else if (!/^\S+@\S+\.\S+$/.test(newEmail)) errors.newEmail = 'Invalid email address';
    if (newEmail !== confirmEmail) errors.confirmEmail = 'Emails do not match';
    setFieldErrors(errors);
    if (Object.values(errors).some(e => e)) return;
    // TODO: Call API to update user info
    setEmail(newEmail);
    setEditMode(false);
  };

  return (
    <div>
      <NavigationBar />
      <div className="profile-container">
        <div className="profile-card">
          <h1 className="profile-title">Profile Page</h1>

          {!editMode ? (
            <Button
              type="text-only"
              underline
              onClick={handleEditProfile}
            >
              Edit Profile
            </Button>
          ) : null}

          <hr className="dashed-line" />

          <div className="profile-info">
            {!editMode ? (
              <>
                <div className="info-row">
                  <span className="info-label">Username</span>
                  <span className="info-value">{username}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Email Address</span>
                  <span className="info-value">{email}</span>
                </div>
              </>
            ) : (
              <>
                <div className="info-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 0 }}>
                  <span className="info-label">Username</span>
                  <div style={{ width: '100%', marginTop: 4 }}>
                    <InputField
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      hasError={!!fieldErrors.username}
                      errorMessage={fieldErrors.username}
                      placeholder="Username"
                    />
                  </div>
                </div>
                <div className="info-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 0 }}>
                  <span className="info-label">Email Address</span>
                  <div style={{ width: '100%', marginTop: 4 }}>
                    <InputField
                      value={newEmail}
                      onChange={e => setNewEmail(e.target.value)}
                      hasError={!!fieldErrors.newEmail}
                      errorMessage={fieldErrors.newEmail}
                      placeholder="New Email Address"
                    />
                  </div>
                </div>
                <div className="info-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 0 }}>
                  <span className="info-label">Confirm Email Address</span>
                  <div style={{ width: '100%', marginTop: 4 }}>
                    <InputField
                      value={confirmEmail}
                      onChange={e => setConfirmEmail(e.target.value)}
                      hasError={!!fieldErrors.confirmEmail}
                      errorMessage={fieldErrors.confirmEmail}
                      placeholder="Confirm Email Address"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {editMode && (
            <>
              <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', gap: 8, marginTop: 8 }}>
                <Button
                  type="small-compact"
                  onClick={handleCancel}
                  style={{ minWidth: '100px', width: '100px', height: '36px', fontSize: 'var(--font-regular)', fontWeight: 400, borderRadius: 10, padding: 0, textAlign: 'center', background: 'transparent' }}
                >
                  Cancel
                </Button>
                <Button
                  type="small-compact"
                  onClick={handleSave}
                  style={{ minWidth: '100px', width: '100px', height: '36px', fontSize: 'var(--font-regular)', fontWeight: 400, borderRadius: 10, padding: 0, textAlign: 'center' }}
                >
                  Save
                </Button>
              </div>
              <hr className="dashed-line" />
              {/* Delete Account Section (Edit Mode) */}
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 24, marginBottom: 8 }}>
                <Icon className="alert-icon" icon="mingcute:alert-fill" width="24" height="24"  style={{color: '#D57F80'}} />
                <div style={{ color: '#222', fontSize: 'var(--font-regular)', maxWidth: 600, textAlign: 'center', marginBottom: 16 }}>
                  All your data, including journal entries and mood logs, will be lost. This action is irreversible. Please proceed with care.
                </div>
                <Button
                  type="small-compact"
                  style={{ background: '#D57F80', color: '#fff', border: '1.5px solid #222', borderRadius: 10, minWidth: 160, width: 160, height: 40, fontWeight: 400, fontSize: 'var(--font-regular)', display: 'block', margin: '0 auto' }}
                  onClick={() => {/* TODO: Add delete logic */}}
                >
                  Delete Account
                </Button>
              </div>
            </>
          )}
        <hr className="dashed-line" />
        </div>
      </div>
      <FloatingActionButton />
    </div>
  );
};

export default Profile;
