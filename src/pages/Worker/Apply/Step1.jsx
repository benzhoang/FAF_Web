import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../auth/AuthContext';

const Step1 = ({ onNext, job }) => {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 px-6 sm:px-10 py-8">
            {/* Title */}
            <div className="text-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
                    Confirm your application profile
                </h1>
                <p className="text-sm text-slate-500">
                    This is how the employer will see you. Make sure your details are up to date.
                </p>
            </div>

            {/* Profile Card */}
            <div className="max-w-xl mx-auto bg-slate-50 rounded-3xl border border-slate-100 p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-6">
                    {/* Avatar + name */}
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-extrabold text-2xl shadow-md">
                            {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                        </div>
                        <div>
                            <h2 className="text-lg font-extrabold text-slate-900">{user?.full_name || 'Your Name'}</h2>
                            <div className="text-sm text-slate-600">{user?.email}</div>
                            {user?.rating_avg && (
                                <div className="flex items-center gap-1 mt-2 text-xs text-slate-600">
                                    <span className="text-amber-400">★</span>
                                    <span className="font-semibold text-slate-900">{user.rating_avg}</span>
                                    <span>({user.total_reviews || 0} reviews)</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Skills + Verified */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    {/* Top skills */}
                    <div>
                        <div className="text-xs font-bold text-slate-500 uppercase mb-2">Your skills</div>
                        <div className="flex flex-wrap gap-2">
                            {user?.skills && user.skills.length > 0 ? (
                                user.skills.slice(0, 4).map((skill, idx) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1 rounded-full bg-blue-50 text-[11px] font-semibold text-blue-700"
                                    >
                                        {typeof skill === 'string' ? skill : skill.name}
                                    </span>
                                ))
                            ) : (
                                <span className="text-xs text-slate-500">No skills added yet</span>
                            )}
                        </div>
                    </div>

                    {/* Verified info */}
                    <div>
                        <div className="text-xs font-bold text-slate-500 uppercase mb-2">Profile info</div>
                        <div className="space-y-1.5 text-xs text-slate-700">
                            <div className="flex items-center gap-2">
                                <span className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                </span>
                                <span>Email Verified</span>
                            </div>
                            {user?.hourly_rate && (
                                <div className="flex items-center gap-2">
                                    <span className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center">
                                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                                    </span>
                                    <span>Hourly Rate: ${user.hourly_rate}</span>
                                </div>
                            )}
                            {user?.total_jobs_done && (
                                <div className="flex items-center gap-2">
                                    <span className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
                                        <span className="w-2 h-2 rounded-full bg-green-500" />
                                    </span>
                                    <span>{user.total_jobs_done} Jobs Completed</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bio */}
                {user?.bio && (
                    <div className="mb-6 p-4 bg-white rounded-xl border border-slate-200">
                        <div className="text-xs font-bold text-slate-500 uppercase mb-2">About</div>
                        <p className="text-sm text-slate-700 line-clamp-3">{user.bio}</p>
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col items-center gap-4">
                    <button
                        onClick={onNext}
                        className="w-full sm:w-auto px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-extrabold shadow-md"
                    >
                        Continue to Proposal
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(`/work/${job?.id || ''}`)}
                        className="text-xs text-slate-500 hover:text-slate-700 font-medium"
                    >
                        Cancel Application
                    </button>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                        <div className="w-4 h-4 rounded-full bg-blue-50 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                        </div>
                        <span>Your profile information is shared securely with the recruiter.</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step1;
