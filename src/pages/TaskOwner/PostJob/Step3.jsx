import React from 'react';

const Step3BudgetMilestones = ({
    totalBudget,
    setTotalBudget,
    checkpoints,
    onAddCheckpoint,
    onRemoveCheckpoint,
    onUpdateCheckpoint,
    totalBudgetNum,
    platformFee,
    totalEscrow,
    isBudgetAllocated,
    onContinue,
    onBack
}) => {
    return (
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Set Budget & Checkpoints
                        </h1>
                        <p className="text-sm text-gray-600">
                            Define the total value of this job and break it down into verifiable milestones for the escrow.
                        </p>
                    </div>

                    {/* Total Job Budget */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Total Job Budget
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                            <input
                                type="number"
                                value={totalBudget}
                                onChange={(e) => setTotalBudget(e.target.value)}
                                className="w-full pl-8 pr-20 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">PTS</span>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                            Total points allocated for the completion of all milestones.
                        </p>
                    </div>

                    {/* Project Checkpoints */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Project Checkpoints
                            </h2>
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                                {checkpoints.length} Checkpoint{checkpoints.length !== 1 ? 's' : ''}
                            </span>
                        </div>

                        <div className="space-y-4">
                            {checkpoints.map((checkpoint, index) => (
                                <div key={checkpoint.id} className="relative bg-white border border-gray-200 rounded-lg p-6">
                                    <button
                                        type="button"
                                        onClick={() => onRemoveCheckpoint(checkpoint.id)}
                                        className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-red-600 transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>

                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                                            <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                                        </div>
                                        <input
                                            type="text"
                                            value={checkpoint.name}
                                            onChange={(e) => onUpdateCheckpoint(checkpoint.id, 'name', e.target.value)}
                                            className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-medium"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                                Title
                                            </label>
                                            <input
                                                type="text"
                                                value={checkpoint.title}
                                                onChange={(e) => onUpdateCheckpoint(checkpoint.id, 'title', e.target.value)}
                                                placeholder="e.g. Initial Concept & Wireframes"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                                Points
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    value={checkpoint.points}
                                                    onChange={(e) => onUpdateCheckpoint(checkpoint.id, 'points', e.target.value)}
                                                    placeholder="2000"
                                                    className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">PTS</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                            Description
                                        </label>
                                        <textarea
                                            value={checkpoint.description}
                                            onChange={(e) => onUpdateCheckpoint(checkpoint.id, 'description', e.target.value)}
                                            placeholder="Describe what needs to be delivered for this checkpoint..."
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-y"
                                        />
                                    </div>
                                </div>
                            ))}

                            {/* Add Checkpoint Button */}
                            <button
                                type="button"
                                onClick={onAddCheckpoint}
                                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 hover:bg-blue-50 transition-colors text-center"
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    <span className="text-sm font-medium text-gray-600">Add Checkpoint</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar - Escrow Summary */}
                <div className="lg:col-span-1">
                    <div className="sticky top-8 bg-white border-l-4 border-blue-500 rounded-lg p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <h3 className="text-lg font-semibold text-gray-900">Escrow Summary</h3>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Total Budget</span>
                                <span className="font-medium text-gray-900">{totalBudgetNum.toLocaleString()} PTS</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Platform Fee (3%)</span>
                                <span className="font-medium text-gray-900">{platformFee.toLocaleString()} PTS</span>
                            </div>
                            <div className="flex justify-between text-sm pt-3 border-t border-gray-200">
                                <span className="font-semibold text-gray-900">Total Escrow</span>
                                <span className="font-bold text-blue-600">{totalEscrow.toLocaleString()} PTS</span>
                            </div>
                        </div>

                        <div className="bg-blue-50 rounded-lg p-4 mb-4">
                            <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-xs text-blue-800">
                                    Funds will be held securely in FAF Escrow and only released when you verify each milestone completion.
                                </p>
                            </div>
                        </div>

                        {isBudgetAllocated && (
                            <div className="bg-green-50 rounded-lg p-4 mb-6">
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <p className="text-xs text-green-800 font-medium">
                                        100% of budget allocated to milestones
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-3">
                            <button
                                onClick={onContinue}
                                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-md transition-colors"
                            >
                                Continue
                            </button>
                            <button
                                onClick={onBack}
                                className="w-full text-sm text-gray-600 hover:text-gray-900 font-medium text-center"
                            >
                                ← Back to details
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step3BudgetMilestones;
