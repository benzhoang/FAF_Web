import React, { useEffect, useState, useMemo } from "react";
import { jobsApi } from "../../../api/jobs.api";

const Step2JobDetails = ({
  jobTitle,
  setJobTitle,
  category,
  setCategory,
  jobDescription,
  setJobDescription,
  skillInput,
  setSkillInput,
  skills,
  setSkills,
  onContinue,
  onBack,
}) => {
  const [categories, setCategories] = useState([]);
  const [allSkills, setAllSkills] = useState([]);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    jobsApi
      .getCate()
      .then((res) => setCategories(res.data))
      .catch(console.error);

    jobsApi
      .getSkills()
      .then((res) => setAllSkills(res.data)) // [{id, name}]
      .catch(console.error);
  }, []);

  console.log(categories);
  /* ================= FILTER SKILLS ================= */
  const filteredSkills = useMemo(() => {
    if (!skillInput.trim()) {
      return [];
    }

    const keyword = skillInput.toLowerCase();

    return allSkills
      .filter(
        (s) =>
          s.name.toLowerCase().includes(keyword) &&
          !skills.some((selected) => selected.id === s.id),
      )
      .slice(0, 5);
  }, [skillInput, allSkills, skills]);

  /* ================= HANDLERS ================= */
  const onSelectSkill = (skill) => {
    if (skills.length >= 5) return;
    setSkills([...skills, skill]);
    setSkillInput("");
  };

  const onRemoveSkill = (id) => {
    setSkills(skills.filter((s) => s.id !== id));
  };

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

          {/* SKILLS */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills Required
            </label>

            <div className="flex flex-wrap gap-2 px-4 py-2 border border-gray-300 rounded-lg min-h-[44px]">
              {skills.map((skill) => (
                <span
                  key={skill.id}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                >
                  {skill.name}
                  <button
                    onClick={() => onRemoveSkill(skill.id)}
                    className="hover:text-red-500"
                  >
                    ✕
                  </button>
                </span>
              ))}

              {skills.length < 5 && (
                <div className="relative flex-1 min-w-[200px]">
                  <input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Type to search skill..."
                    className="w-full border-0 focus:outline-none text-sm"
                  />

                  {filteredSkills.length > 0 && (
                    <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                      {filteredSkills.map((s) => (
                        <div
                          key={s.id}
                          onClick={() => onSelectSkill(s)}
                          className="px-4 py-2 text-sm hover:bg-blue-50 cursor-pointer"
                        >
                          {s.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <p className="text-xs text-gray-500 mt-2">
              Select up to 5 skills from our database.
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
