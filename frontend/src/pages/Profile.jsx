import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';
import NavigationBar from '../components/NavigationBar';
import FloatingActionButton from '../components/FloatingActionButton';
import InputField from '../components/InputField';
import Button from '../components/Button';

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
            <div className="info-row">
              <span className="info-label">Username</span>
              {!editMode ? (
                <p className="info-value">{username}</p>
              ) : (
                <InputField
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  hasError={!!fieldErrors.username}
                  errorMessage={fieldErrors.username}
                  placeholder="Username"
                  style={{ width: '60%' }}
                />
              )}
            </div>
            <div className="info-row">
              <span className="info-label">Email Address</span>
              {!editMode ? (
                <p className="info-value">{email}</p>
              ) : (
                <div style={{ width: '60%' }}>
                  <InputField
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    hasError={!!fieldErrors.newEmail}
                    errorMessage={fieldErrors.newEmail}
                    placeholder="New Email Address"
                    style={{ marginBottom: 8 }}
                  />
                  <InputField
                    value={confirmEmail}
                    onChange={e => setConfirmEmail(e.target.value)}
                    hasError={!!fieldErrors.confirmEmail}
                    errorMessage={fieldErrors.confirmEmail}
                    placeholder="Confirm Email Address"
                  />
                </div>
              )}
            </div>
          </div>

          {editMode && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', gap: 8, marginTop: 16 }}>
              <Button type="small-compact" onClick={handleCancel}>Cancel</Button>
              <Button type="small-compact" onClick={handleSave}>Save</Button>
            </div>
          )}

          <hr className="dashed-line" />
        </div>
      </div>
      <FloatingActionButton />
    </div>
  );
};

export default Profile;
