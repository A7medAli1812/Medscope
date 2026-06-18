// src/patient/pages/Profile.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatient } from "../context/PatientContext";
import profileService from "../services/profileService";
import {
    UserIcon, PhoneIcon, MapPinIcon, PencilSquareIcon,
    IdentificationIcon, CalendarDaysIcon, ShieldCheckIcon, ClockIcon,
    BellIcon, XMarkIcon, HeartIcon
} from '@heroicons/react/24/outline';
import Loader from '../../components/Loader';
import '../styles/Profile.css';


/* ── Toast ─────────────────────────────────────────────────────────────── */
const Toast = ({ message, type, onClose }) => (
    <div className={`profile-toast profile-toast--${type}`}>
        <span>{message}</span>
        <button className="profile-toast__close" onClick={onClose}>
            <XMarkIcon />
        </button>
    </div>
);

/* ── Profile Page ───────────────────────────────────────────────────────── */
const Profile = () => {
    const navigate = useNavigate();
    const { setPatient, profileData, setProfileData } = usePatient();

    /* ── State ── */
    const [loading, setLoading]   = useState(true);
    const [saving, setSaving]     = useState(false);
    const [toast, setToast]       = useState(null);

    const [editForm, setEditForm] = useState({
        firstName: '', lastName: '', phoneNumber: '', address: '', bloodGroup: ''
    });
    const [notifications, setNotifications] = useState({
        emailNotifications: true, smsNotifications: false, appointmentReminders: true
    });
    const [passwordForm, setPasswordForm] = useState({
        oldPassword: '', newPassword: '', confirmPassword: ''
    });
    const [passwordError, setPasswordError]   = useState('');
    const [isEditModalOpen, setIsEditModalOpen]         = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen]     = useState(false);

    /* ── Helpers ── */
    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    }, []);

    const applyProfileToState = useCallback((data) => {
        setProfileData(data);
        setEditForm({
            firstName:   data.firstName   || '',
            lastName:    data.lastName    || '',
            phoneNumber: data.phoneNumber || '',
            address:     data.address     || '',
            bloodGroup:  data.bloodGroup  || '',
        });
        setNotifications({
            emailNotifications:  data.notifications?.emailNotifications  ?? true,
            smsNotifications:    data.notifications?.smsNotifications    ?? false,
            appointmentReminders: data.notifications?.appointmentReminders ?? true,
        });
    }, [setProfileData]);

    /* ── Fetch on mount ── */
    useEffect(() => {
        // profileData may already be loaded by PatientContext; use it immediately
        // and still refresh in the background to guarantee freshness.
        if (profileData) {
            applyProfileToState(profileData);
            setLoading(false);
        }

        const fetchProfile = async () => {
            try {
                const data = await profileService.getProfile();
                applyProfileToState(data);
            } catch (err) {
                showToast(err?.response?.data?.message || 'Failed to load profile', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* ── Edit Profile ── */
    const handleEditChange = (e) => {
        setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await profileService.updateProfile(editForm);
            // Re-fetch to get the latest server-confirmed data
            const refreshed = await profileService.getProfile();
            applyProfileToState(refreshed);
            setPatient(prev => ({ ...prev, name: refreshed.firstName || 'Patient' }));
            setIsEditModalOpen(false);
            showToast('Profile updated successfully');
        } catch (err) {
            showToast(err?.response?.data?.message || 'Failed to update profile', 'error');
        } finally {
            setSaving(false);
        }
    };

    /* ── Notifications (optimistic update) ── */
    const handleNotificationToggle = async (field) => {
        const previous = { ...notifications };
        const updated  = { ...notifications, [field]: !notifications[field] };
        setNotifications(updated); // optimistic
        try {
            await profileService.updateNotifications({ [field]: updated[field] });
        } catch {
            setNotifications(previous); // rollback
            showToast('Failed to update notification setting', 'error');
        }
    };

    /* ── Change Password ── */
    const handlePasswordChange = (e) => {
        setPasswordForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setPasswordError('');
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordError('');

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordError('Passwords do not match');
            return;
        }

        // Strong password check: min 8 chars, 1 uppercase, 1 lowercase, 1 number
        const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
        if (!strongRegex.test(passwordForm.newPassword)) {
            setPasswordError('Password must be at least 8 characters long, with 1 uppercase, 1 lowercase, and 1 number');
            return;
        }

        setSaving(true);
        try {
            await profileService.changePassword({
                oldPassword:     passwordForm.oldPassword,
                newPassword:     passwordForm.newPassword,
                confirmPassword: passwordForm.confirmPassword,
            });
            setIsPasswordModalOpen(false);
            setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
            showToast('Password changed successfully. Please login again.');
            
            // Force logout after password change
            setTimeout(() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            }, 2500);
            
        } catch (err) {
            setPasswordError(err?.response?.data?.message || 'Incorrect current password');
        } finally {
            setSaving(false);
        }
    };

    /* ── Delete Account ── */
    const handleDeleteAccount = async () => {
        setSaving(true);
        try {
            await profileService.deleteAccount();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
        } catch (err) {
            showToast(err?.response?.data?.message || 'Failed to delete account', 'error');
            setSaving(false);
        }
    };

    /* ── Render ── */
    if (loading) return <Loader message="Loading Your Profile..." />;

    return (
        <>

        <div className="profile-container">

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* ─── Personal Information ─── */}
            <div className="profile-card">
                <div className="profile-card-header">
                    <h3>Personal Information</h3>
                    <button className="btn-edit" onClick={() => setIsEditModalOpen(true)}>
                        <PencilSquareIcon /> Edit
                    </button>
                </div>
                <div className="info-grid">
                    <div className="info-item">
                        <div className="info-label"><UserIcon /> First Name</div>
                        <div className="info-value">{profileData?.firstName || '—'}</div>
                    </div>
                    <div className="info-item">
                        <div className="info-label"><UserIcon /> Last Name</div>
                        <div className="info-value">{profileData?.lastName || '—'}</div>
                    </div>
                    <div className="info-item">
                        <div className="info-label"><PhoneIcon /> Phone Number</div>
                        <div className="info-value">{profileData?.phoneNumber || '—'}</div>
                    </div>
                    <div className="info-item">
                        <div className="info-label"><MapPinIcon /> Address</div>
                        <div className="info-value">{profileData?.address || '—'}</div>
                    </div>
                    <div className="info-item">
                        <div className="info-label"><HeartIcon /> Blood Group</div>
                        <div className="info-value">{profileData?.bloodGroup || '—'}</div>
                    </div>
                </div>
            </div>

            {/* ─── Account Information ─── */}
            <div className="profile-card">
                <div className="profile-card-header">
                    <h3>Account Information</h3>
                </div>
                <div className="account-cards-grid">
                    <div className="account-box">
                        <div className="account-box-label"><IdentificationIcon /> Patient ID</div>
                        <div className="account-box-value">{profileData?.patientId || '—'}</div>
                    </div>
                    <div className="account-box">
                        <div className="account-box-label"><CalendarDaysIcon /> Registration Date</div>
                        <div className="account-box-value">{profileData?.registrationDate || '—'}</div>
                    </div>
                    <div className="account-box">
                        <div className="account-box-label"><ShieldCheckIcon /> Account Status</div>
                        <div className={`account-box-value ${profileData?.accountStatus === 'Active' ? 'value-active' : ''}`}>
                            {profileData?.accountStatus || '—'}
                        </div>
                    </div>
                    <div className="account-box">
                        <div className="account-box-label"><ClockIcon /> Last Login</div>
                        <div className="account-box-value">{profileData?.lastLogin || 'Never'}</div>
                    </div>
                </div>
            </div>

            {/* ─── Settings ─── */}
            <div className="profile-card">
                <div className="profile-card-header"><h3>Settings</h3></div>
                <h4 className="notification-heading"><BellIcon /> Notification Preferences</h4>
                <div className="settings-list">
                    {[
                        { key: 'emailNotifications',  label: 'Email Notifications' },
                        { key: 'smsNotifications',    label: 'SMS Notifications' },
                        { key: 'appointmentReminders',label: 'Appointment Reminders' },
                    ].map(({ key, label }) => (
                        <div className="setting-item" key={key}>
                            <span className="setting-label">{label}</span>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={notifications[key]}
                                    onChange={() => handleNotificationToggle(key)}
                                />
                                <span className="slider" />
                            </label>
                        </div>
                    ))}
                </div>
                <div className="settings-actions">
                    <div className="settings-action-col">
                        <button className="btn-action-primary" onClick={() => setIsPasswordModalOpen(true)}>
                            Change Password
                        </button>
                    </div>
                    <div className="settings-action-col">
                        <button className="btn-action-danger" onClick={() => setIsDeleteModalOpen(true)}>
                            Delete Account
                        </button>
                        <span className="danger-text">
                            Once you delete your account, there is no going back. Please be certain.
                        </span>
                    </div>
                </div>
            </div>

            {/* ══════════════════ MODALS ══════════════════ */}

            {/* Edit Profile */}
            {isEditModalOpen && (
                <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Edit Profile</h3>
                            <button className="modal-close" onClick={() => setIsEditModalOpen(false)}>
                                <XMarkIcon />
                            </button>
                        </div>
                        <form onSubmit={handleSaveEdit}>
                            {[
                                { name: 'firstName',   label: 'First Name',    required: true },
                                { name: 'lastName',    label: 'Last Name',     required: true },
                                { name: 'phoneNumber', label: 'Phone Number',  required: true },
                                { name: 'address',     label: 'Address',       required: true },
                                { name: 'bloodGroup',  label: 'Blood Group',   required: false },
                            ].map(({ name, label, required }) => (
                                <div className="edit-form-group" key={name}>
                                    <label>{label}</label>
                                    <input
                                        type="text"
                                        name={name}
                                        value={editForm[name]}
                                        onChange={handleEditChange}
                                        required={required}
                                    />
                                </div>
                            ))}
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setIsEditModalOpen(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-action-primary" disabled={saving}>
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Change Password */}
            {isPasswordModalOpen && (
                <div className="modal-overlay" onClick={() => setIsPasswordModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Change Password</h3>
                            <button className="modal-close" onClick={() => { setIsPasswordModalOpen(false); setPasswordError(''); }}>
                                <XMarkIcon />
                            </button>
                        </div>
                        <form onSubmit={handlePasswordSubmit}>
                            {[
                                { name: 'oldPassword',     label: 'Current Password' },
                                { name: 'newPassword',     label: 'New Password' },
                                { name: 'confirmPassword', label: 'Confirm New Password' },
                            ].map(({ name, label }) => (
                                <div className="edit-form-group" key={name}>
                                    <label>{label}</label>
                                    <input
                                        type="password"
                                        name={name}
                                        value={passwordForm[name]}
                                        onChange={handlePasswordChange}
                                        required
                                    />
                                </div>
                            ))}
                            {passwordError && <p className="password-error">{passwordError}</p>}
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => { setIsPasswordModalOpen(false); setPasswordError(''); }}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-action-primary" disabled={saving}>
                                    {saving ? 'Changing...' : 'Change Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Account */}
            {isDeleteModalOpen && (
                <div className="modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Delete Account</h3>
                            <button className="modal-close" onClick={() => setIsDeleteModalOpen(false)}>
                                <XMarkIcon />
                            </button>
                        </div>
                        <p className="modal-warning-text">
                            Are you absolutely sure you want to delete your account?{' '}
                            <strong>All your medical records, appointments, and personal data will be permanently removed.</strong>{' '}
                            This action cannot be undone.
                        </p>
                        <div className="modal-actions">
                            <button type="button" className="btn-cancel" onClick={() => setIsDeleteModalOpen(false)}>
                                Cancel
                            </button>
                            <button type="button" className="btn-action-danger" onClick={handleDeleteAccount} disabled={saving}>
                                {saving ? 'Deleting...' : 'Yes, Delete Account'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
        </>

    );
};

export default Profile;