import React from 'react';

const PostingProgress = ({ currentStep, stepProgress }) => {
    return (
        <section className="px-10 pt-8">
            <p className="text-xs font-semibold text-blue-600 tracking-[0.2em] mb-1">
                POSTING PROCESS
            </p>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span>{stepProgress[currentStep].label}</span>
                <span>{stepProgress[currentStep].percent}% Complete</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                    className="h-1.5 bg-blue-600 rounded-full transition-all duration-300"
                    style={{ width: `${stepProgress[currentStep].percent}%` }}
                />
            </div>
        </section>
    );
};

export default PostingProgress;
