import React from 'react';

const Step2JobDetails = ({
    jobTitle,
    setJobTitle,
    category,
    setCategory,
    jobDescription,
    setJobDescription,
    skills,
    skillInput,
    setSkillInput,
    onAddSkillKeyDown,
    onRemoveSkill,
    onContinue,
    onBack
}) => {
    return (
        <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Tell us about the role
                    </h1>
                    <p className="text-sm text-gray-600">
                        Provide the specific details so we can match you with the right candidates.
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Job Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Job Title
                        </label>
                        <input
                            type="text"
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                            placeholder="e.g. Senior Product Designer"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none bg-white bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M6%209L1%204h10z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat pr-10"
                        >
                            <option value="">Select a category</option>
                            <option value="design">Design</option>
                            <option value="development">Development</option>
                            <option value="marketing">Marketing</option>
                            <option value="writing">Writing</option>
                            <option value="business">Business</option>
                        </select>
                    </div>

                    {/* Job Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Job Description
                        </label>
                        <div className="border border-gray-300 rounded-lg overflow-hidden">
                            {/* Toolbar */}
                            <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200 bg-gray-50">
                                <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-gray-700">
                                    <span className="font-bold text-sm">B</span>
                                </button>
                                <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-gray-700">
                                    <span className="italic text-sm">I</span>
                                </button>
                                <div className="w-px h-4 bg-gray-300"></div>
                                <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-gray-700">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                                <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-gray-700">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                    </svg>
                                </button>
                                <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-gray-700">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                    </svg>
                                </button>
                            </div>
                            {/* Textarea */}
                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                placeholder="Describe the responsibilities, requirements, and benefits..."
                                rows={8}
                                className="w-full px-4 py-3 border-0 focus:outline-none focus:ring-0 resize-y text-sm"
                            />
                        </div>
                    </div>

                    {/* Skills Required */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Skills Required
                        </label>
                        <div className="flex flex-wrap gap-2 px-4 py-2.5 border border-gray-300 rounded-lg min-h-[44px] items-center">
                            {skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                                >
                                    {skill}
                                    <button
                                        type="button"
                                        onClick={() => onRemoveSkill(skill)}
                                        className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </span>
                            ))}
                            {skills.length < 5 && (
                                <input
                                    type="text"
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    onKeyDown={onAddSkillKeyDown}
                                    placeholder="Type a skill and press Enter..."
                                    className="flex-1 min-w-[200px] border-0 focus:outline-none text-sm"
                                />
                            )}
                        </div>
                        <p className="mt-2 text-xs text-gray-500">
                            Add up to 5 skills to help candidates find your job.
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 mt-8">
                    <button
                        onClick={onContinue}
                        className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-md transition-colors"
                    >
                        Continue
                    </button>
                    <button
                        onClick={onBack}
                        className="text-sm text-gray-600 hover:text-gray-900 font-medium self-start"
                    >
                        ← Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Step2JobDetails;
