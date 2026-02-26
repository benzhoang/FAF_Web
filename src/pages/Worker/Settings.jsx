import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { userApi } from '../../api/user.api';
import SkillSelector from '../../components/SkillSelector';

const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
};

const Stat = ({ value, label, isEditing, name, onChange, type = "text" }) => (
    <div className="flex-1 rounded-xl bg-white border border-gray-100 px-4 py-4 text-center flex flex-col items-center justify-center h-full">
        {isEditing && onChange ? (
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full text-center text-lg font-extrabold text-blue-600 border-b border-gray-300 focus:border-blue-600 focus:outline-none bg-transparent"
            />
        ) : (
            <div className="text-lg font-extrabold text-blue-600">{value}</div>
        )}
        <div className="mt-1 text-[11px] font-semibold tracking-wide text-gray-500 uppercase">
            {label}
        </div>
    </div>
);

const Pill = ({ children, onDelete }) => (
    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
        {children}
        {onDelete && (
            <button
                onClick={onDelete}
                className="hover:text-blue-900 focus:outline-none"
            >
                ×
            </button>
        )}
    </span>
);

const Card = ({ title, children, right }) => (
    <section className="rounded-2xl bg-white border border-gray-100 shadow-sm h-full flex flex-col">
        {title ? (
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
                <h2 className="text-sm font-extrabold tracking-wide text-gray-900">{title}</h2>
                {right}
            </div>
        ) : null}
        <div className="px-6 py-5 flex-1">{children}</div>
    </section>
);

const Settings = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const { user, fetchMe } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    
    const [formData, setFormData] = useState({
        full_name: '',
        location: '',
        bio: '',
        skills: [],
        hourly_rate: '',
        availability: 'available',
        // Mock data for display only
        title: 'Senior Developer', // Not in DB yet
        education: 'BFA in Communication Design, Pratt Institute', // Not editable via this flow yet
        languages: 'English (Fluent), Spanish (Conversational)' // Not editable via this flow yet
    });

    useEffect(() => {
        if (user) {
            initializeFormData();
        }
    }, [user]);

    const initializeFormData = () => {
        setFormData({
            full_name: user.full_name || '',
            location: user.location || '',
            bio: user.bio || '',
            skills: Array.isArray(user.skills) ? user.skills : [],
            hourly_rate: user.hourly_rate || '',
            availability: user.availability || 'available',
            // Keep existing logic for mocks or mapping
            title: user.title || 'Senior Developer', 
            education: user.education || 'Not provided',
            languages: user.languages || 'English'
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSkillsChange = (newSkills) => {
        setFormData(prev => ({
            ...prev,
            skills: newSkills
        }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await userApi.updateProfile({
                full_name: formData.full_name,
                location: formData.location,
                bio: formData.bio,
                skills: formData.skills,
                hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null,
                availability: formData.availability
            });
            await fetchMe();
            setIsEditing(false);
            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.response?.data?.message || 'Error updating profile');
        } finally {
            setSaving(false);
        }
    };

    const displayName = formData.full_name || user?.email || 'User';
    const memberSince = user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown';

    return (
        <div className="w-full min-h-screen bg-blue-50/50">
            <div className="mx-auto max-w-7xl px-4 py-8">
                <div className="mb-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Settings & Profile</h1>
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="inline-flex items-center justify-center rounded-xl bg-blue-600 text-white px-5 py-2.5 font-bold text-sm hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            Edit Profile
                        </button>
                    ) : (
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    initializeFormData();
                                }}
                                className="inline-flex items-center justify-center rounded-xl bg-white text-gray-700 border border-gray-200 px-5 py-2.5 font-bold text-sm hover:bg-gray-50 transition-colors"
                                disabled={saving}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="inline-flex items-center justify-center rounded-xl bg-blue-600 text-white px-5 py-2.5 font-bold text-sm hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
                                disabled={saving}
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left column */}
                    <div className="lg:col-span-2 space-y-6">
                        <section className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-6">
                                <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
                                    <div className="flex items-center gap-6">
                                        <div className="relative shrink-0">
                                            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-extrabold text-2xl shadow-md">
                                                {getInitials(displayName)}
                                            </div>
                                            <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center">
                                                <span className={`h-3 w-3 rounded-full ${formData.availability === 'available' ? 'bg-green-500' : 'bg-gray-400'}`} />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            {isEditing ? (
                                                <div className="flex flex-col gap-2">
                                                    <input
                                                        type="text"
                                                        name="full_name"
                                                        value={formData.full_name}
                                                        onChange={handleInputChange}
                                                        placeholder="Full Name"
                                                        className="text-xl font-extrabold text-gray-900 border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                                    />
                                                    <input
                                                        type="text"
                                                        name="location"
                                                        value={formData.location}
                                                        onChange={handleInputChange}
                                                        placeholder="Location"
                                                        className="text-sm font-semibold text-gray-600 border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                                    />
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex items-center gap-3">
                                                        <h1 className="text-xl font-extrabold text-gray-900">{displayName}</h1>
                                                        {user?.tier && (
                                                            <span className={`text-[10px] font-extrabold tracking-wide uppercase rounded-full px-2 py-1 border ${
                                                                user.tier === 'EXPERT' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                                                user.tier === 'PRO' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                                'bg-gray-50 text-gray-700 border-gray-100'
                                                            }`}>
                                                                {user.tier}
                                                            </span>
                                                        )}
                                                        {formData.availability === 'available' && (
                                                            <span className="text-[10px] font-extrabold tracking-wide uppercase rounded-full bg-green-50 text-green-700 border border-green-100 px-2 py-1">
                                                                Available
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-gray-500">
                                                        <span className="inline-flex items-center gap-1.5">
                                                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21s7-4.35 7-11a7 7 0 10-14 0c0 6.65 7 11 7 11z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10a2 2 0 110-4 2 2 0 010 4z" />
                                                            </svg>
                                                            {formData.location || 'No location set'}
                                                        </span>
                                                        <span className="inline-flex items-center gap-1.5">
                                                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3M4 11h16M5 7h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z" />
                                                            </svg>
                                                            Member since {memberSince}
                                                        </span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 pb-6">
                                <div className="rounded-2xl bg-gray-50 border border-gray-100 p-5">
                                    <div className="text-[11px] font-extrabold tracking-wide text-gray-500 uppercase">About</div>
                                    {isEditing ? (
                                        <textarea
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleInputChange}
                                            rows={4}
                                            className="mt-2 w-full text-sm text-gray-700 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                            placeholder="Write a short bio about yourself..."
                                        />
                                    ) : (
                                        <p className="mt-2 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                            {formData.bio || 'No bio provided yet.'}
                                        </p>
                                    )}
                                </div>

                                <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <Stat value={user?.total_jobs_done || 0} label="Jobs Done" />
                                    <Stat value={user?.rating_avg ? `${user.rating_avg}★` : 'N/A'} label="Rating" />
                                    <Stat 
                                        value={formData.hourly_rate} 
                                        label="Hourly Rate" 
                                        isEditing={isEditing}
                                        name="hourly_rate"
                                        onChange={handleInputChange}
                                        type="number"
                                    />
                                    <Stat 
                                        value={user?.balance_points || 0} 
                                        label="Wallet Balance" 
                                    />
                                </div>
                            </div>
                        </section>

                        <Card title="Skills & Expertise">
                            <div className="space-y-4">
                                {isEditing ? (
                                    <SkillSelector 
                                        selectedSkills={formData.skills} 
                                        onChange={handleSkillsChange}
                                        placeholder="Add a skill (e.g. React, Design)..." 
                                    />
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {formData.skills.length > 0 ? (
                                            formData.skills.map((s, i) => (
                                                <span key={i} className="inline-flex items-center rounded-full bg-gray-50 border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-700">
                                                    {typeof s === 'string' ? s : s.name || s}
                                                </span>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-500">No skills listed.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </Card>

                        <Card title="Portfolio">
                             <div className="space-y-4">
                                {user?.portfolio_items && user.portfolio_items.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {user.portfolio_items.map((item, idx) => (
                                            <div key={idx} className="group relative rounded-xl border border-gray-100 overflow-hidden bg-gray-50 aspect-video">
                                                {item.image_url ? (
                                                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-4 flex flex-col justify-end">
                                                    <div className="font-bold text-white text-sm">{item.title}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-2xl">
                                        <p className="text-sm text-gray-500">Chưa có dự án nào trong portfolio.</p>
                                        <p className="text-[10px] text-gray-400 mt-1">Cập nhật hồ sơ để thêm sản phẩm của bạn.</p>
                                    </div>
                                )}
                             </div>
                        </Card>
                    </div>

                    {/* Right column */}
                    <div className="space-y-6">
                        <section className="rounded-2xl bg-gradient-to-b from-blue-50 to-white border border-blue-100 shadow-sm overflow-hidden p-6">
                            <h3 className="text-sm font-extrabold text-gray-900 mb-4">Availability Status</h3>
                            
                            {isEditing ? (
                                <select
                                    name="availability"
                                    value={formData.availability}
                                    onChange={handleInputChange}
                                    className="w-full text-sm border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                >
                                    <option value="available">Available for Projects</option>
                                    <option value="busy">Busy / Limited Availability</option>
                                    <option value="unavailable">Unavailable</option>
                                </select>
                            ) : (
                                <div className={`inline-flex items-center rounded-lg px-4 py-2 text-sm font-bold ${
                                    formData.availability === 'available' ? 'bg-green-100 text-green-700' :
                                    formData.availability === 'busy' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-red-100 text-red-700'
                                }`}>
                                    {formData.availability === 'available' ? 'Available for Projects' :
                                     formData.availability === 'busy' ? 'Busy / Limited Availability' :
                                     'Unavailable'}
                                </div>
                            )}

                            {formData.availability === 'available' && (
                                <p className="mt-3 text-xs font-semibold text-gray-600">
                                    You are listed as available. Employers can invite you to jobs.
                                </p>
                            )}
                        </section>

                        <Card title="Quick Details">
                            <div className="space-y-4 text-sm">
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 h-9 w-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100">
                                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21s7-4.35 7-11a7 7 0 10-14 0c0 6.65 7 11 7 11z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10a2 2 0 110-4 2 2 0 010 4z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-xs font-extrabold tracking-wide text-gray-500 uppercase">Location</div>
                                        <div className="mt-1 font-semibold text-gray-900">{formData.location || 'Not set'}</div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 h-9 w-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100">
                                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422A12.083 12.083 0 0121 17.5c0 .334-.01.667-.03 1" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l-6.16-3.422A12.083 12.083 0 003 17.5c0 .334.01.667.03 1" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-xs font-extrabold tracking-wide text-gray-500 uppercase">Education</div>
                                        <div className="mt-1 font-semibold text-gray-900">{formData.education}</div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;