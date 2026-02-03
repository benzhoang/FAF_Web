import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TaskOwnerSidebar from '../../components/TaskOwnerSidebar';
import { userApi } from '../../api/user.api';

const ProfilesPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingWallet, setIsEditingWallet] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        company: '',
        address: '',
        bio: ''
    });
    const [walletData, setWalletData] = useState({
        walletId: '',
        balance: 0,
        currency: 'VND'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const response = await userApi.getMe();
            setUser(response);

            // Set form data
            setFormData({
                full_name: response.full_name || '',
                email: response.email || '',
                phone: response.phone || '',
                company: response.company || '',
                address: response.address || '',
                bio: response.bio || ''
            });

            // Set wallet data (giả sử từ response hoặc localStorage)
            const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
            setWalletData({
                walletId: storedUser.walletId || `faf_${Math.random().toString(36).substr(2, 9)}`,
                balance: storedUser.walletBalance || 0,
                currency: 'VND'
            });
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleWalletChange = (e) => {
        const { name, value } = e.target;
        setWalletData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveProfile = async () => {
        try {
            setSaving(true);
            // TODO: Gọi API update profile
            // await userApi.updateProfile(formData);

            // Tạm thời update local state
            setUser(prev => ({ ...prev, ...formData }));
            setIsEditing(false);

            // Update localStorage
            const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
            localStorage.setItem('user', JSON.stringify({ ...storedUser, ...formData }));

            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile!');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveWallet = async () => {
        try {
            setSaving(true);
            // TODO: Gọi API update wallet
            // await userApi.updateWallet(walletData);

            // Update localStorage
            const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
            localStorage.setItem('user', JSON.stringify({
                ...storedUser,
                walletId: walletData.walletId,
                walletBalance: parseFloat(walletData.balance)
            }));

            setIsEditingWallet(false);
            alert('Wallet updated successfully!');
        } catch (error) {
            console.error('Error updating wallet:', error);
            alert('Error updating wallet!');
        } finally {
            setSaving(false);
        }
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    if (loading) {
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
                                <h2 className="text-xl font-bold text-gray-900">Client Information</h2>
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
                                                setFormData({
                                                    full_name: user?.full_name || '',
                                                    email: user?.email || '',
                                                    phone: user?.phone || '',
                                                    company: user?.company || '',
                                                    address: user?.address || '',
                                                    bio: user?.bio || ''
                                                });
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
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                                            {formData.full_name || user?.full_name || 'No name'}
                                        </h3>
                                        <p className="text-gray-600">{formData.company || user?.company || 'No company'}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Email
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                                            />
                                        ) : (
                                            <p className="text-gray-900">{formData.email || 'Not provided'}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Phone Number
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                                            />
                                        ) : (
                                            <p className="text-gray-900">{formData.phone || 'Not provided'}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Company
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="company"
                                                value={formData.company}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                                            />
                                        ) : (
                                            <p className="text-gray-900">{formData.company || 'Not provided'}</p>
                                        )}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Address
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                                            />
                                        ) : (
                                            <p className="text-gray-900">{formData.address || 'Not provided'}</p>
                                        )}
                                    </div>

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
                                            <p className="text-gray-900">{formData.bio || 'No bio'}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Wallet Information Card */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">My Wallet</h2>
                                {!isEditingWallet ? (
                                    <button
                                        onClick={() => setIsEditingWallet(true)}
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
                                                setIsEditingWallet(false);
                                                const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
                                                setWalletData({
                                                    walletId: storedUser.walletId || walletData.walletId,
                                                    balance: storedUser.walletBalance || walletData.balance,
                                                    currency: 'VND'
                                                });
                                            }}
                                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSaveWallet}
                                            disabled={saving}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            {saving ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="p-6">
                                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-6 text-white mb-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <p className="text-sm font-semibold text-blue-100 mb-2">Current Balance</p>
                                            <p className="text-4xl font-bold mb-1">
                                                {parseFloat(walletData.balance).toLocaleString('vi-VN')} {walletData.currency}
                                            </p>
                                        </div>
                                        <div className="bg-white/20 rounded-lg p-3">
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-white/20">
                                        <p className="text-xs font-semibold text-blue-100 mb-1">WALLET ID</p>
                                        <p className="text-sm font-mono font-bold">{walletData.walletId}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Wallet ID
                                        </label>
                                        {isEditingWallet ? (
                                            <input
                                                type="text"
                                                name="walletId"
                                                value={walletData.walletId}
                                                onChange={handleWalletChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-mono"
                                            />
                                        ) : (
                                            <p className="text-gray-900 font-mono">{walletData.walletId}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Balance
                                        </label>
                                        {isEditingWallet ? (
                                            <input
                                                type="number"
                                                name="balance"
                                                value={walletData.balance}
                                                onChange={handleWalletChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                                            />
                                        ) : (
                                            <p className="text-gray-900 text-lg font-semibold">
                                                {parseFloat(walletData.balance).toLocaleString('vi-VN')} {walletData.currency}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Currency
                                        </label>
                                        {isEditingWallet ? (
                                            <select
                                                name="currency"
                                                value={walletData.currency}
                                                onChange={handleWalletChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                                            >
                                                <option value="VND">VND</option>
                                                <option value="USD">USD</option>
                                                <option value="EUR">EUR</option>
                                            </select>
                                        ) : (
                                            <p className="text-gray-900">{walletData.currency}</p>
                                        )}
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
