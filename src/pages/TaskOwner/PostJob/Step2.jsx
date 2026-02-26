import React, { useEffect, useState } from "react";
import { jobsApi } from "../../../api/jobs.api";
import SkillSelector from "../../../components/SkillSelector";

const Step2JobDetails = ({
  jobTitle,
  setJobTitle,
  category,
  setCategory,
  jobDescription,
  setJobDescription,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  skills,
  setSkills,
  onContinue,
  onBack,
}) => {
  const [categories, setCategories] = useState([]);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    jobsApi
      .getCate()
      .then((res) => setCategories(res.data))
      .catch(console.error);
  }, []);

  /* ================= UI ================= */
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Tell us about the role
          </h1>
          <p className="text-sm text-gray-600">
            Provide the details so we can match the right candidates.
          </p>
        </div>

        <div className="space-y-6">
          {/* JOB TITLE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title
            </label>
            <input
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Senior Frontend Developer"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={category?.id || ""}
              onChange={(e) => {
                const selectedId = e.target.value;
                const selectedCategory = categories.find(
                  (c) => String(c.id) === selectedId,
                );
                setCategory(selectedCategory);
              }}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* JOB DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={6}
              placeholder="Describe responsibilities, requirements..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* JOB DURATION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate ? String(startDate).split('T')[0] : ''}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                min={startDate ? String(startDate).split('T')[0] : ''}
                value={endDate ? String(endDate).split('T')[0] : ''}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* SKILLS */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills Required
            </label>
            <SkillSelector 
              selectedSkills={skills} 
              onChange={setSkills} 
              limit={5}
            />
            <p className="text-xs text-gray-500 mt-2">
              Select up to 5 skills.
            </p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={onContinue}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg"
          >
            Continue
          </button>

          <button
            onClick={onBack}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step2JobDetails;
