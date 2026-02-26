import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userApi } from '../api/user.api';
import TaskOwnerSidebar from '../components/TaskOwnerSidebar'; // Or generic layout if available

const PublicProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const res = await userApi.getById(id);
                setProfile(res.data);
            } catch (err) {
                console.error("Error fetching profile:", err);
                setError("Could not load profile.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProfile();
        }
    }, [id]);

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
    if (!profile) return <div className="min-h-screen flex items-center justify-center">User not found.</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Ideally we check user role to decide sidebar, but for now assuming TaskOwner context or generic */}
             <TaskOwnerSidebar /> 

            <div className="flex-1 flex flex-col">
                <header className="bg-white border-b border-gray-200 px-6 py-4">
                    <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-700 mb-2">
                        &larr; Back
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">Worker Profile</h1>
                </header>

                <main className="flex-1 p-6 overflow-y-auto">
                    <div className="max-w-4xl mx-auto bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-8">
                            <div className="flex items-start gap-6">
                                <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-2xl shrink-0">
                                    {getInitials(profile.full_name)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-2xl font-bold text-gray-900">{profile.full_name}</h2>
                                        {profile.tier && (
                                            <span className={`text-[10px] font-extrabold tracking-wide uppercase rounded-full px-2 py-1 border ${
                                                profile.tier === 'EXPERT' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                                profile.tier === 'PRO' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                'bg-gray-50 text-gray-700 border-gray-100'
                                            }`}>
                                                {profile.tier}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-600 text-lg">{profile.title || "Freelancer"}</p>
                                    <p className="text-sm text-gray-500 mt-1">{profile.location || "Remote"}</p>
                                    
                                    <div className="flex items-center gap-4 mt-4">
                                        <div className="flex items-center gap-1">
                                            <span className="text-yellow-400 text-lg">★</span>
                                            <span className="font-semibold">{Number(profile.rating_avg || 0).toFixed(1)}</span>
                                            <span className="text-gray-500 text-sm">({profile.total_jobs_done || 0} jobs)</span>
                                        </div>
                                        <div className="h-4 w-px bg-gray-300"></div>
                                        <div className="font-semibold text-gray-900">
                                            ${Number(profile.hourly_rate || 0).toLocaleString()}/hr
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
                                        Invite to Job
                                    </button>
                                </div>
                            </div>

                             <div className="mt-8">
                                <h3 className="text-lg font-bold text-gray-900 mb-3">Portfolio</h3>
                                {profile.portfolio_items && profile.portfolio_items.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {profile.portfolio_items.map((item, idx) => (
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
                                    <p className="text-sm text-gray-500 italic">No items in portfolio yet.</p>
                                )}
                            </div>

                            <div className="mt-8">
                                <h3 className="text-lg font-bold text-gray-900 mb-3">About</h3>
                                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                    {profile.bio || "No overview provided."}
                                </p>
                            </div>

                            <div className="mt-8">
                                <h3 className="text-lg font-bold text-gray-900 mb-3">Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {profile.skills && profile.skills.length > 0 ? (
                                        profile.skills.map((skill, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                                {typeof skill === 'object' ? skill.name : skill}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-500 italic">No skills listed.</span>
                                    )}
                                </div>
                            </div>

                            {/* Additional sections like Education, Experience could go here if data exists */}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PublicProfile;
