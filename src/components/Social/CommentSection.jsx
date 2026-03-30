import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { postsApi } from '../../api/posts.api';
import { useToast } from '../../contexts/ToastContext';

const CommentSection = ({ postId, initialCommentsCount }) => {
    const { user } = useAuth();
    const toast = useToast();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const res = await postsApi.getComments(postId);
            setComments(res.data || []);
        } catch (error) {
            console.error('Error fetching comments:', error);
            // Non-critical, just keep empty
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !user) return;

        try {
            setSubmitting(true);
            const res = await postsApi.addComment(postId, newComment);
            const newCmnt = res.data;
            if (newCmnt) {
                // Optimistic UI update for the new comment
                setComments(prev => [...prev, {
                    ...newCmnt,
                    author_name: user.full_name,
                    author_avatar: user.avatar_url
                }]);
                setNewComment('');
                toast.success('Comment posted!');
            }
        } catch (error) {
            console.error('Error adding comment:', error);
            toast.error('Failed to post comment');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="pt-4 border-t border-gray-100 mt-4 space-y-4">
            {loading ? (
                <div className="text-center text-sm text-gray-500 py-2">Loading comments...</div>
            ) : comments.length > 0 ? (
                <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                    {comments.map((c) => (
                        <div key={c.id} className="flex gap-3">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold overflow-hidden text-xs">
                                    {c.author_avatar ? (
                                        <img src={c.author_avatar} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        c.author_name?.charAt(0).toUpperCase() || 'U'
                                    )}
                                </div>
                            </div>
                            <div className="flex-1 bg-gray-50 rounded-2xl px-4 py-2">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-bold text-sm text-gray-900">{c.author_name}</span>
                                    <span className="text-xs text-gray-400">
                                        {new Date(c.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">{c.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-sm text-gray-500 py-2">No comments yet. Be the first!</div>
            )}

            {user && (
                <form onSubmit={handleAddComment} className="flex gap-3 pt-2">
                    <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold overflow-hidden text-xs">
                            {user.avatar_url ? (
                                <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                user.full_name?.charAt(0).toUpperCase() || 'U'
                            )}
                        </div>
                    </div>
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            className="w-full bg-gray-100 border-transparent rounded-full px-4 py-2 pr-12 text-sm focus:border-blue-500 focus:bg-white focus:ring-0 transition-colors"
                            disabled={submitting}
                        />
                        <button
                            type="submit"
                            disabled={!newComment.trim() || submitting}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default CommentSection;
