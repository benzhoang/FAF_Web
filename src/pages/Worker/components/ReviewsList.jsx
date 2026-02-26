import React from 'react';

const ReviewsList = ({ reviews, summary }) => {
    const renderStars = (rating) => {
        return (
            <div className="flex text-yellow-400 text-sm">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star}>{star <= rating ? '★' : '☆'}</span>
                ))}
            </div>
        );
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Client Feedback</h2>

            {summary && (
                <div className="mb-8 flex items-center gap-6 p-4 bg-gray-50 rounded-xl">
                    <div className="text-center">
                        <span className="text-4xl font-black text-gray-900">{Number(summary.average_rating || 0).toFixed(1)}</span>
                        <div className="mt-1 flex justify-center">{renderStars(Math.round(summary.average_rating || 0))}</div>
                        <span className="text-xs text-gray-500 mt-1 block">{summary.total_reviews} reviews</span>
                    </div>
                </div>
            )}

            <div className="space-y-6">
                {!reviews || reviews.length === 0 ? (
                    <p className="text-center text-gray-500 py-6 italic text-sm">No reviews yet.</p>
                ) : (
                    reviews.map(review => (
                        <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className="font-bold text-gray-900">{review.reviewer_name || 'Anonymous Client'}</h4>
                                    <p className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString()}</p>
                                </div>
                                <div>{renderStars(review.rating)}</div>
                            </div>
                            <p className="text-sm text-gray-700 mt-2">{review.comment || 'No comment provided.'}</p>
                            
                            {/* Skill Ratings inside review if any */}
                            {review.skillRatings && review.skillRatings.length > 0 && (
                                <div className="mt-3 flex gap-2 flex-wrap">
                                    {review.skillRatings.map(sr => (
                                        <span key={sr.id} className="inline-flex items-center gap-1 text-[10px] uppercase font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                            {sr.skill_name}: {sr.rating}★
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ReviewsList;
