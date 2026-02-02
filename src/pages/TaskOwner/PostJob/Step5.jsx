import React from "react";
import { jobsApi } from "../../../api/jobs.api";


const formatDate = (dateStr) => {
  if (!dateStr) return "No due date";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const Step5ReviewPublish = ({
  selectedType,
  category,
  jobTitle,
  jobDescription,
  skills,
  totalBudgetNum,
  checkpoints,
  onEditStep1,
  onEditStep2,
  onEditStep3,
  onPublish,
  onSaveDraft,
  onBack,
  contractHtml,
}) => {
  const data = {
    selectedType,
    category,
    jobTitle,
    jobDescription,
    skills,
    totalBudgetNum,
    checkpoints,
    contractHtml,
  };
  console.log(data);

  const buildPayloadForBE = () => {
    return {
      title: jobTitle,
      description: jobDescription,
      jobType: selectedType === "short-term" ? "SHORT_TERM" : "LONG_TERM",
      budget: Number(totalBudgetNum),

      categoryId: Number(category?.id),

      skills: skills.map((s) => Number(s.id)),

      contractContent: contractHtml,

      checkpoints: checkpoints.map((cp) => ({
        title: cp.title || cp.name,
        amount: Number(cp.points),
        description: cp.description || "",
        due_date: cp.dueDate
          ? new Date(cp.dueDate).toISOString().split("T")[0]
          : null,
      })),
    };
  };

  const handlePublish = async () => {
    const payload = buildPayloadForBE();
    
    console.log("SEND TO BE:", payload);

    try {
      await jobsApi.postJobs(payload);
      onPublish();
    } catch (err) {
      console.error("Publish job failed", err);
    }
  };


  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Review and Publish
        </h1>
        <p className="text-sm text-gray-600 max-w-xl mx-auto">
          Please review your job details before posting. You can edit any
          section if needed.
        </p>
      </div>

      {/* Job Basics */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <span className="text-blue-600 text-lg">📄</span>
            </div>
            <h2 className="text-sm font-semibold text-gray-900">Job Basics</h2>
          </div>
          <button
            type="button"
            onClick={onEditStep1}
            className="text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            Edit
          </button>
        </div>
        <div className="px-6 py-4 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
          <div>
            <div className="text-gray-500 mb-1">JOB TYPE</div>
            <div className="font-medium text-gray-900 flex items-center gap-1">
              {selectedType === "short-term"
                ? "Short-term Protected"
                : "Long-term Connection"}
              {selectedType === "short-term" && (
                <span className="text-blue-500 text-sm">🛡️</span>
              )}
            </div>
          </div>
          <div>
            <div className="text-gray-500 mb-1">CATEGORY</div>
            <div className="font-medium text-gray-900">
              {category?.name || "Not specified"}
            </div>
          </div>
          <div>
            <div className="text-gray-500 mb-1">EXPERIENCE LEVEL</div>
            <div className="font-medium text-gray-900">Expert</div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <span className="text-blue-600 text-lg">✏️</span>
            </div>
            <h2 className="text-sm font-semibold text-gray-900">Description</h2>
          </div>
          <button
            type="button"
            onClick={onEditStep2}
            className="text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            Edit
          </button>
        </div>
        <div className="px-6 py-5 space-y-2">
          <h3 className="text-sm font-semibold text-gray-900">
            {jobTitle || "Untitled job"}
          </h3>
          <p className="text-xs text-gray-600 whitespace-pre-line">
            {jobDescription || "No description provided yet."}
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            {skills.map((skill) => (
              <span
                key={skill.id}
                className="px-3 py-1 rounded-full bg-gray-100 text-[11px] font-medium text-gray-700"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Budget & Milestones */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <span className="text-blue-600 text-lg">💰</span>
            </div>
            <h2 className="text-sm font-semibold text-gray-900">
              Budget & Milestones
            </h2>
          </div>
          <button
            type="button"
            onClick={onEditStep3}
            className="text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            Edit
          </button>
        </div>
        <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div>
            <div className="text-gray-500 mb-1">TOTAL BUDGET</div>
            <div className="text-xl font-bold text-gray-900">
              ${totalBudgetNum.toLocaleString()}
              <span className="ml-1 text-xs font-normal text-gray-500">
                Fixed Price
              </span>
            </div>
          </div>
          <div>
            <div className="text-gray-500 mb-1">ESTIMATED TIMELINE</div>
            <div className="font-medium text-gray-900">Less than 1 month</div>
          </div>
        </div>

        <div className="px-6 pb-6">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
              Milestone Schedule
            </div>
            <div className="divide-y divide-gray-200 text-xs">
              {checkpoints.map((cp, index) => (
                <div
                  key={cp.id}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <div className="flex-1">
                    <div className="text-gray-700">
                      {index + 1}. {cp.title || cp.name || "Untitled milestone"}
                    </div>
                    {cp.description && (
                      <div className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
                        {cp.description}
                      </div>
                    )}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1">
                      Due date:{" "}
                      <span className="font-medium text-gray-700">
                        {formatDate(cp.due_date)}
                      </span>
                    </div>
                  <div className="ml-4 font-semibold text-gray-900 whitespace-nowrap">
                    ${(parseFloat(cp.points) || 0).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
            Contract
          </div>
          <div className="bg-white p-6">
            <h2 className="text-xl font-bold mb-4">Confirm contract</h2>

            <div
              className="tiptap-content text-[13px] leading-6"
              dangerouslySetInnerHTML={{ __html: contractHtml }}
            />
          </div>
        </div>
      </div>

      {/* Escrow protection */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-6 py-4 mb-8 flex gap-3">
        <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-lg">🛡️</span>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            Secure Escrow Protection Active
          </h3>
          <p className="text-xs text-blue-900">
            Because you chose{" "}
            <span className="font-semibold">Short-term Protected</span>, payment
            will be held securely in escrow. Funds are only released to the
            worker after you review and approve each milestone submission.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center gap-3 mb-4">
        <button
          onClick={handlePublish}
          className="w-full md:w-auto px-10 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md transition-colors"
        >
          Publish Job Now
        </button>
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500">
          <button
            type="button"
            onClick={onSaveDraft}
            className="hover:text-gray-800 font-medium"
          >
            Save as Draft
          </button>
          <button
            type="button"
            onClick={onBack}
            className="hover:text-gray-800 font-medium"
          >
            Back to Previous Step
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step5ReviewPublish;
