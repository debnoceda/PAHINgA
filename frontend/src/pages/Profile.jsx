import { useState } from 'react';
import '../styles/Profile.css';
import NavigationBar from '../components/NavigationBar';
import FloatingActionButton from '../components/FloatingActionButton';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { Icon } from '@iconify/react';
import { useUser } from '../context/UserContext';
import { useEffect } from 'react';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, fetchUserData } = useUser();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    username: '',
    newEmail: '',
    confirmEmail: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Fetch user data when component mounts
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Update local state when user data changes
  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setEmail(user.email || '');
      setNewEmail(user.email || '');
    }
  }, [user]);

  const handleEditProfile = () => {
    setEditMode(true);
    setNewEmail(email);
    setConfirmEmail('');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setFieldErrors({
      username: '',
      newEmail: '',
      confirmEmail: '',
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleCancel = () => {
    setEditMode(false);
    setNewEmail(email);
    setFieldErrors({
      username: '',
      newEmail: '',
      confirmEmail: '',
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleSave = async () => {
    // Basic validation
    let errors = {
      username: '',
      newEmail: '',
      confirmEmail: '',
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    };

    // Only validate username if it's changed
    if (username !== user.username && !username.trim()) {
      errors.username = 'Username is required';
    }
    
    // Only validate email if it's changed
    if (newEmail !== email) {
      if (!newEmail.trim()) {
        errors.newEmail = 'New email is required';
      } else if (!/^\S+@\S+\.\S+$/.test(newEmail)) {
        errors.newEmail = 'Invalid email address';
      }
      if (newEmail !== confirmEmail) {
        errors.confirmEmail = 'Emails do not match';
      }
    }

    // Only validate password if any password field is filled
    if (newPassword || confirmPassword || oldPassword) {
      if (!oldPassword) errors.oldPassword = 'Current password is required';
      if (!newPassword) errors.newPassword = 'New password is required';
      else if (newPassword.length < 8) errors.newPassword = 'Password must be at least 8 characters';
      if (newPassword !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
    }

    setFieldErrors(errors);
    if (Object.values(errors).some(e => e)) return;

    try {
      // Prepare update data with only changed fields
      const updateData = {};
      
      if (username !== user.username) {
        updateData.username = username;
      }
      
      if (newEmail !== email) {
        updateData.email = newEmail;
      }
      
      if (newPassword) {
        updateData.old_password = oldPassword;
        updateData.password = newPassword;
      }

      // Only make API call if there are changes
      if (Object.keys(updateData).length > 0) {
        try {
          const response = await api.put('/users/me/', updateData);
          toast.success('Profile updated successfully');
          
          // Update local state
          if (updateData.username) setUsername(updateData.username);
          if (updateData.email) {
            setEmail(updateData.email);
            setNewEmail(updateData.email);
          }
          setEditMode(false);
        } catch (error) {
          console.error('Error updating profile:', error);
          // Handle validation errors from the backend
          if (error.response?.data) {
            const errors = error.response.data;
            // Update field errors with backend validation messages
            setFieldErrors(prev => ({
              ...prev,
              ...errors
            }));
            
            // Show specific error messages
            if (errors.old_password) {
              toast.error(errors.old_password);
            } else if (errors.password) {
              toast.error(errors.password);
            } else {
              toast.error('Failed to update profile. Please check the form for errors.');
            }
          } else {
            toast.error('Failed to update profile. Please try again.');
          }
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    }
  };

  const handleDelete = () => {
    setShowConfirmDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete('/users/delete_account/');
      // Clear tokens and user data
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(REFRESH_TOKEN);
      // Show success message
      toast.success('Account deleted successfully');
      // Redirect to landing page
      navigate('/landing');
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account. Please try again.');
    } finally {
      setShowConfirmDeleteModal(false);
    }
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
                <div className="info-row edit-mode">
                  <span className="info-label">Username</span>
                  <div className="input-container">
                    <InputField
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      hasError={!!fieldErrors.username}
                      errorMessage={fieldErrors.username}
                      placeholder="Username"
                      className="input-field"
                    />
                  </div>
                </div>
                <div className="info-row edit-mode">
                  <span className="info-label">Email Address</span>
                  <div className="input-container">
                    <InputField
                      value={newEmail}
                      onChange={e => setNewEmail(e.target.value)}
                      hasError={!!fieldErrors.newEmail}
                      errorMessage={fieldErrors.newEmail}
                      placeholder="New Email Address"
                      className="input-field"
                    />
                  </div>
                </div>
                <div className="info-row edit-mode">
                  <span className="info-label">Current Password</span>
                  <div className="input-container">
                    <InputField
                      type="password"
                      value={oldPassword}
                      onChange={e => setOldPassword(e.target.value)}
                      hasError={!!fieldErrors.oldPassword}
                      errorMessage={fieldErrors.oldPassword}
                      placeholder="Enter current password"
                      className="input-field"
                    />
                  </div>
                </div>
                <div className="info-row edit-mode">
                  <span className="info-label">New Password</span>
                  <div className="input-container">
                    <InputField
                      type="password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      hasError={!!fieldErrors.newPassword}
                      errorMessage={fieldErrors.newPassword}
                      placeholder="Enter new password"
                      className="input-field"
                    />
                  </div>
                </div>
                <div className="info-row edit-mode">
                  <span className="info-label">Confirm New Password</span>
                  <div className="input-container">
                    <InputField
                      type="password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      hasError={!!fieldErrors.confirmPassword}
                      errorMessage={fieldErrors.confirmPassword}
                      placeholder="Confirm new password"
                      className="input-field"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {editMode && (
            <>
              <div style={{ display: 'flex', width: '100%', gap: 8, marginTop: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%', gap: 8, marginTop: 8 }}>
                  <Button
                      type="small-compact"
                      onClick={handleDelete}
                      style={{ minWidth: '200px', width: '100px', height: '36px', fontSize: 'var(--font-regular)', fontWeight: 400, borderRadius: 10, padding: 0, textAlign: 'center', background: "#D57F80" }}
                    >
                      Delete Account
                  </Button>
                </div>
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
              </div>
            </>
          )}
        </div>
      </div>
      <FloatingActionButton />
      <ConfirmDeleteModal
        isOpen={showConfirmDeleteModal}
        onCancel={() => setShowConfirmDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Account"
        description="All your data, including journal entries and mood logs, will be lost. This action is irreversible. Please proceed with care."
      />
    </div>
  );
};

export default Profile;
