import React, { useEffect, useState } from "react";
import { jobsApi } from "../../../api/jobs.api";
import SkillSelector from "../../../components/SkillSelector";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    jobsApi
      .getCate()
      .then((res) => setCategories(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-[#090e17]/80 backdrop-blur-md rounded-2xl border border-white/5 p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/5 blur-3xl rounded-full -mr-16 -mt-16" />
        
        {/* HEADER */}
        <div className="mb-10 relative z-10 border-b border-white/5 pb-6">
            <p className="text-[10px] font-mono font-black text-fuchsia-500 uppercase tracking-[0.3em] mb-2">{t('postjob.step2_subtitle', 'CORE_CONFIGURATION')}</p>
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider font-mono">
                {t('postjob.step2_title', 'JOB_DOSSIER_DETAILS')}
            </h1>
        </div>

        <div className="space-y-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* JOB TITLE */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">
                  {t('postjob.job_title_label', 'ID_DESIGNATION')}
                </label>
                <input
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder={t('postjob.job_title_pl', 'ENTER_JOB_TITLE...')}
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white font-mono text-sm placeholder-slate-700 outline-none focus:border-fuchsia-500/50 transition-all uppercase tracking-wide"
                />
              </div>

              {/* CATEGORY */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">
                  {t('postjob.category_label', 'SECTOR_CLASSIFICATION')}
                </label>
                <div className="relative group">
                    <select
                        value={category?.id || ""}
                        onChange={(e) => {
                            const selectedId = e.target.value;
                            const selectedCategory = categories.find((c) => String(c.id) === selectedId);
                            setCategory(selectedCategory);
                        }}
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white font-mono text-xs outline-none focus:border-fuchsia-500/50 transition-all appearance-none uppercase tracking-widest"
                    >
                        <option value="" className="bg-[#0f172a]">{t('postjob.category_select', 'SELECT_CATEGORY')}</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id} className="bg-[#0f172a]">
                                {c.name.toUpperCase()}
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 transition-colors group-hover:text-fuchsia-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                </div>
              </div>
          </div>

          {/* JOB DESCRIPTION */}
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">
              {t('postjob.job_desc_label', 'MISSION_PARAMETERS')}
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={5}
              placeholder={t('postjob.job_desc_pl', 'INITIALIZE_TASK_DESCRIPTION...')}
              className="w-full px-4 py-4 bg-black/40 border border-white/10 rounded-xl text-slate-300 font-mono text-sm placeholder-slate-800 outline-none focus:border-fuchsia-500/50 transition-all leading-relaxed resize-none"
            />
          </div>

          {/* JOB DURATION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">
                {t('postjob.start_date', 'EXECUTION_START')}
              </label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={startDate ? String(startDate).split('T')[0] : ''}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white font-mono text-xs outline-none focus:border-fuchsia-500/50 transition-all [color-scheme:dark]"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">
                {t('postjob.end_date', 'DEPLOYMENT_DEADLINE')}
              </label>
              <input
                type="date"
                min={startDate ? String(startDate).split('T')[0] : ''}
                value={endDate ? String(endDate).split('T')[0] : ''}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white font-mono text-xs outline-none focus:border-fuchsia-500/50 transition-all [color-scheme:dark]"
              />
            </div>
          </div>

          {/* SKILLS */}
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono flex items-center justify-between">
              <span>{t('postjob.skills_req', 'MODULE_PREREQUISITES')}</span>
              <span className="text-[9px] text-fuchsia-500/50 italic capitalize">{t('postjob.skills_hint', 'MAX: 05 MODULES')}</span>
            </label>
            <div className="p-1 bg-black/20 rounded-xl border border-white/5">
                <SkillSelector 
                  selectedSkills={skills} 
                  onChange={setSkills} 
                  limit={5}
                  variant="fuchsia"
                />
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-12 flex flex-col gap-4 relative z-10 pt-6 border-t border-white/5">
          <button
            onClick={onContinue}
            className="w-full py-4 bg-fuchsia-600 hover:bg-fuchsia-500 text-[#020617] font-black font-mono text-xs tracking-[0.2em] uppercase rounded-xl shadow-[0_0_20px_rgba(217,70,239,0.3)] transition-all active:scale-[0.98]"
          >
            {t('postjob.btn_continue', 'VERIFY_AND_CONTINUE')}
          </button>

          <button
            onClick={onBack}
            className="text-[10px] font-black font-mono tracking-widest uppercase text-slate-500 hover:text-white transition-colors"
          >
             {t('postjob.btn_back', '<< PREVIOUS_PHASE')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step2JobDetails;
