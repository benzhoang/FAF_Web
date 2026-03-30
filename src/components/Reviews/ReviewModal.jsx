import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';
import { reviewsApi } from '../../api/reviews.api';
import { jobsApi } from '../../api/jobs.api';

const ReviewModal = ({ isOpen, onClose, contractId, jobId, onSuccess }) => {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const isLight = theme === 'light';
    const toast = useToast();

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [skills, setSkills] = useState([]);
    const [skillRatings, setSkillRatings] = useState({});
    const [loading, setLoading] = useState(false);

    // Fetch Job Skills when modal opens
    useEffect(() => {
        const loadSkills = async () => {
            if (isOpen && jobId) {
                try {
                    const res = await jobsApi.getJobDetail(jobId);
                    if (res?.data?.skills) {
                        setSkills(res.data.skills);
                        // Init skills rating to 0
                        const initR = {};
                        res.data.skills.forEach(s => initR[s.id] = 0);
                        setSkillRatings(initR);
                    }
                } catch (error) {
                    console.error("Failed to load skills:", error);
                }
            }
        };
        loadSkills();
    }, [isOpen, jobId]);

    const handleSkillRatingChange = (skillId, star) => {
        setSkillRatings(prev => ({ ...prev, [skillId]: star }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (rating < 1) {
            toast.error("Vui lòng chọn số sao đánh giá chung.");
            return;
        }

        const formattedSkillRatings = Object.entries(skillRatings)
            .filter(([_, r]) => r > 0)
            .map(([id, r]) => ({ skillId: id, rating: r }));

        setLoading(true);
        try {
            await reviewsApi.createReview({
                contractId,
                rating,
                comment,
                skillRatings: formattedSkillRatings
            });
            toast.success("Đánh giá thành công!");
            onSuccess();
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi khi gửi đánh giá.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div 
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={onClose}
            />
            
            <div className={`relative w-full max-w-lg rounded-2xl border shadow-xl flex flex-col max-h-[90vh] ${
                isLight 
                    ? 'bg-white border-slate-200' 
                    : 'bg-slate-900 border-slate-700'
            }`}>
                <div className="p-6 border-b border-inherit">
                    <h2 className={`text-xl font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>
                        Đánh giá Worker
                    </h2>
                    <p className={`text-sm mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        Nhận xét và chấm điểm kỹ năng sau khi hoàn thành công việc.
                    </p>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                    <form id="review-form" onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Overall Rating */}
                        <div>
                            <label className={`block text-sm font-bold mb-3 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                                Đánh giá chung (Bắt buộc)
                            </label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className="focus:outline-none transition-transform hover:scale-110"
                                    >
                                        <svg 
                                            className={`w-8 h-8 ${rating >= star ? 'text-amber-400 drop-shadow-md' : (isLight ? 'text-slate-200' : 'text-slate-700')}`} 
                                            fill="currentColor" viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Comment */}
                        <div>
                            <label className={`block text-sm font-bold mb-2 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                                Nhận xét chi tiết
                            </label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows="3"
                                placeholder="Viết nhận xét của bạn về chất lượng và tiến độ..."
                                className={`w-full rounded-xl p-3 border focus:ring-2 focus:outline-none transition-all ${
                                    isLight 
                                        ? 'border-slate-300 bg-white text-slate-800 focus:border-cyan-500 focus:ring-cyan-500/20' 
                                        : 'border-slate-700 bg-slate-800/50 text-white focus:border-cyan-500 focus:ring-cyan-500/20'
                                }`}
                            />
                        </div>

                        {/* Skills Rating */}
                        {skills.length > 0 && (
                            <div className="pt-4 border-t border-inherit">
                                <label className={`block text-sm font-bold mb-4 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                                    Đánh giá kỹ năng chuyên môn
                                </label>
                                <div className="space-y-4">
                                    {skills.map(skill => (
                                        <div key={skill.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                            <span className={`text-sm font-medium px-3 py-1 rounded-full ${isLight ? 'bg-slate-100 text-slate-700' : 'bg-slate-800 text-slate-300'}`}>
                                                {skill.name}
                                            </span>
                                            <div className="flex gap-1.5 ml-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={`skill-${skill.id}-${star}`}
                                                        type="button"
                                                        onClick={() => handleSkillRatingChange(skill.id, star)}
                                                        className="focus:outline-none transition-all hover:scale-110"
                                                    >
                                                        <svg 
                                                            className={`w-5 h-5 ${skillRatings[skill.id] >= star ? 'text-green-500' : (isLight ? 'text-slate-200' : 'text-slate-700')}`} 
                                                            fill="currentColor" viewBox="0 0 20 20"
                                                        >
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <p className={`text-[11px] mt-4 italic ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                                    * Kỹ năng rating sẽ cộng trực tiếp vào tổng kinh nghiệm của Worker
                                </p>
                            </div>
                        )}
                        
                    </form>
                </div>

                <div className="p-4 sm:p-6 border-t border-inherit flex gap-3 justify-end shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                            isLight
                                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                        }`}
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        form="review-form"
                        disabled={loading}
                        className="px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center min-w-[120px]"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            'Gửi Đánh Giá'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;
