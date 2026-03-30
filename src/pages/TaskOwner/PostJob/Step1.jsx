import React from "react";
import { useTranslation } from "react-i18next";

const Step1SelectType = ({
  selectedType,
  setSelectedType,
  onContinue,
  onCancel,
}) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center">
      <div className="max-w-4xl w-full text-center mb-12">
        <h1 className="text-4xl font-black text-white mb-4 tracking-wider uppercase font-mono shadow-[0_0_15px_rgba(217,70,239,0.2)]">
          {t("postjob.step1_title", "SELECT_DEPLOYMENT_SPEC")}
        </h1>
        <p className="text-sm font-mono text-slate-500 uppercase tracking-[0.2em]">
          {t(
            "postjob.step1_desc",
            "IDENTIFY_WORK_STRUCTURE_FOR_OPTIMAL_EXECUTION",
          )}
        </p>
      </div>

      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
        {/* Short-term Card */}
        <button
          type="button"
          onClick={() => setSelectedType("short-term")}
          className={`group relative text-left rounded-2xl border-2 p-8 transition-all overflow-hidden ${
            selectedType === "short-term"
              ? "border-fuchsia-500 bg-fuchsia-500/5 shadow-[0_0_30px_rgba(217,70,239,0.2)]"
              : "border-white/5 bg-white/[0.02] hover:border-white/20"
          }`}
        >
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                  selectedType === "short-term"
                    ? "bg-fuchsia-600 text-[#020617]"
                    : "bg-white/5 text-slate-500"
                }`}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  selectedType === "short-term"
                    ? "border-fuchsia-500 bg-fuchsia-500"
                    : "border-white/10"
                }`}
              >
                {selectedType === "short-term" && (
                  <svg
                    className="w-4 h-4 text-[#020617]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </div>
            <h2 className="text-xl font-black text-white mb-3 uppercase tracking-widest font-mono">
              {t("postjob.short_term")}
            </h2>
            <p className="text-xs font-mono text-slate-500 mb-6 leading-relaxed uppercase tracking-tight">
              {t("postjob.short_term_desc")}
            </p>
            <ul className="space-y-3">
              {[1, 2, 3].map((i) => (
                <li key={i} className="flex items-center gap-3 group/item">
                  <span className="text-fuchsia-500 font-black font-mono text-[10px] opacity-40 group-hover/item:opacity-100 transition-opacity">
                    {">>"}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                    {t(`postjob.st_feature${i}`)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </button>

        {/* Long-term Card */}
        <button
          type="button"
          onClick={() => setSelectedType("long-term")}
          className={`group relative text-left rounded-2xl border-2 p-8 transition-all overflow-hidden ${
            selectedType === "long-term"
              ? "border-violet-500 bg-violet-500/5 shadow-[0_0_30px_rgba(139,92,246,0.2)]"
              : "border-white/5 bg-white/[0.02] hover:border-white/20"
          }`}
        >
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                  selectedType === "long-term"
                    ? "bg-violet-600 text-[#020617]"
                    : "bg-white/5 text-slate-500"
                }`}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  selectedType === "long-term"
                    ? "border-violet-500 bg-violet-500"
                    : "border-white/10"
                }`}
              >
                {selectedType === "long-term" && (
                  <svg
                    className="w-4 h-4 text-[#020617]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </div>
            <h2 className="text-xl font-black text-white mb-3 uppercase tracking-widest font-mono">
              {t("postjob.long_term")}
            </h2>
            <p className="text-xs font-mono text-slate-500 mb-6 leading-relaxed uppercase tracking-tight">
              {t("postjob.long_term_desc")}
            </p>
            <ul className="space-y-3">
              {[1, 2, 3].map((i) => (
                <li key={i} className="flex items-center gap-3 group/item">
                  <span className="text-violet-500 font-black font-mono text-[10px] opacity-40 group-hover/item:opacity-100 transition-opacity">
                    {">>"}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                    {t(`postjob.lt_feature${i}`)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </button>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center gap-6">
        <button
          onClick={onContinue}
          className="relative group px-12 py-4 bg-fuchsia-600 hover:bg-fuchsia-500 text-[#020617] font-black font-mono text-xs tracking-[0.2em] uppercase rounded-full shadow-[0_0_25px_rgba(217,70,239,0.3)] transition-all hover:scale-105 active:scale-95 overflow-hidden"
        >
          <span className="relative z-10">
            {t("postjob.btn_continue_details")}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </button>
        <button
          onClick={onCancel}
          className="text-[10px] font-black font-mono tracking-widest uppercase text-slate-600 hover:text-white transition-colors"
        >
          {t("postjob.btn_cancel", "TERMINATE_PROCESS")}
        </button>
      </div>
    </div>
  );
};

export default Step1SelectType;
