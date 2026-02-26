import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import TaskOwnerSidebar from '../../components/TaskOwnerSidebar';
import { useAuth } from '../../auth/AuthContext';
import { userApi } from '../../api/user.api';
import SkillSelector from '../../components/SkillSelector';

const ProfilesPage = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const { user, loading: authLoading, fetchMe } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingWallet, setIsEditingWallet] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        bio: '',
        skills: [],
        location: '',
        hourly_rate: null,
        availability: 'available'
    });
    const [walletData, setWalletData] = useState({
        walletId: '',
        balance: 0,
        currency: 'VND'
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (user) {
            initializeFormData();
        }
    }, [user]);

    const initializeFormData = () => {
        // Set form data from backend user object
        setFormData({
            full_name: user.full_name || '',
            bio: user.bio || '',
            skills: user.skills || [],
            location: user.location || '',
            hourly_rate: user.hourly_rate || null,
            availability: user.availability || 'available'
        });

        // Wallet data from backend (read-only)
        setWalletData({
            walletId: `FAF-${user.id}`,
            balance: user.balance_points || 0,
            currency: 'Points'
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveProfile = async () => {
        try {
            setSaving(true);
            
            // Call API to update profile
            await userApi.updateProfile(formData);

            // Refresh user data from AuthContext
            await fetchMe();
            
            setIsEditing(false);
            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.response?.data?.message || 'Error updating profile!');
        } finally {
            setSaving(false);
        }
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex">
                <TaskOwnerSidebar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-gray-600">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <TaskOwnerSidebar />

            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-900">Profile Information</h1>
                        <div className="text-xs text-gray-500">Last updated: Just now</div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-6 overflow-y-auto">
                    <div className="max-w-6xl mx-auto space-y-6">
                        {/* Profile Information Card */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">User Profile</h2>
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Edit
                                    </button>
                                ) : (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setIsEditing(false);
                                                initializeFormData(); // Reset to original data
                                            }}
                                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSaveProfile}
                                            disabled={saving}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            {saving ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="p-6">
                                <div className="flex items-start gap-6 mb-6">
                                    <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-2xl">
                                        {getInitials(formData.full_name || user?.full_name)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-xl font-bold text-gray-900">
                                                {formData.full_name || user?.full_name || 'No name'}
                                            </h3>
                                            {user?.tier && (
                                                <span className={`text-[10px] font-extrabold tracking-wide uppercase rounded-full px-2 py-1 border ${
                                                    user.tier === 'EXPERT' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                                    user.tier === 'PRO' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                    'bg-gray-50 text-gray-700 border-gray-100'
                                                }`}>
                                                    {user.tier}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-600">{user?.role ? user?.role.toUpperCase() : 'USER'}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Full Name */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Full Name
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="full_name"
                                                value={formData.full_name}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                                            />
                                        ) : (
                                            <p className="text-gray-900">{formData.full_name || 'Not provided'}</p>
                                        )}
                                    </div>

                                    {/* Email (Read only) */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Email
                                        </label>
                                        <p className="text-gray-900">{user?.email || 'Not provided'}</p>
                                    </div>

                                    {/* Location */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Location
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleInputChange}
                                                placeholder="e.g., Ho Chi Minh City, Vietnam"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                                            />
                                        ) : (
                                            <p className="text-gray-900">{formData.location || 'Not provided'}</p>
                                        )}
                                    </div>

                                    {/* Availability */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Availability
                                        </label>
                                        {isEditing ? (
                                            <select
                                                name="availability"
                                                value={formData.availability}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                                            >
                                                <option value="available">Available</option>
                                                <option value="busy">Busy</option>
                                                <option value="unavailable">Unavailable</option>
                                            </select>
                                        ) : (
                                            <p className="text-gray-900 capitalize">{formData.availability || 'Not set'}</p>
                                        )}
                                    </div>

                                    {/* Hourly Rate (Worker only) */}
                                    {user?.role === 'worker' && (
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Hourly Rate (VND)
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    name="hourly_rate"
                                                    value={formData.hourly_rate || ''}
                                                    onChange={handleInputChange}
                                                    min="0"
                                                    step="1000"
                                                    placeholder="e.g., 50000"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                                                />
                                            ) : (
                                                <p className="text-gray-900">
                                                    {formData.hourly_rate 
                                                        ? `${parseInt(formData.hourly_rate).toLocaleString('vi-VN')} VND/hour`
                                                        : 'Not set'
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Bio */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Bio / About
                                        </label>
                                        {isEditing ? (
                                            <textarea
                                                name="bio"
                                                value={formData.bio}
                                                onChange={handleInputChange}
                                                rows={4}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                                                placeholder="Write about yourself..."
                                            />
                                        ) : (
                                            <p className="text-gray-900 whitespace-pre-wrap">{formData.bio || 'No bio'}</p>
                                        )}
                                    </div>

                                    {/* Skills (Array Input) */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Skills
                                        </label>
                                        {isEditing ? (
                                            <SkillSelector 
                                                selectedSkills={formData.skills || []} 
                                                onChange={(newSkills) => setFormData(prev => ({ ...prev, skills: newSkills }))}
                                                placeholder="Add a skill (e.g. React, Design)..." 
                                            />
                                        ) : (
                                            <div className="flex flex-wrap gap-2">
                                                {formData.skills?.length > 0 ? (
                                                    formData.skills.map((skill, index) => (
                                                        <span
                                                            key={index}
                                                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                                                        >
                                                            {skill}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-500 italic">No skills added yet</span>
                                                )}
                                            </div>
                                        )}

                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Wallet Information Card - Read Only */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-xl font-bold text-gray-900">My Wallet</h2>
                            </div>

                            <div className="p-6">
                                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-6 text-white text-center">
                                    <div className="mb-6">
                                        <p className="text-sm font-semibold text-blue-100 mb-2">Available Balance</p>
                                        <p className="text-4xl font-bold mb-1">
                                            {walletData.balance.toLocaleString('vi-VN')} {walletData.currency}
                                        </p>
                                    </div>
                                    <div className="pt-4 border-t border-white/20">
                                        <p className="text-xs font-semibold text-blue-100 mb-1">WALLET ID</p>
                                        <p className="text-sm font-mono font-bold">{walletData.walletId}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ProfilesPage;
