import React from "react";
import { jobsApi } from "../../../api/jobs.api";
import { useTranslation } from "react-i18next";

const formatDate = (dateStr, t) => {
  if (!dateStr) return "N/A";
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
  startDate,
  endDate,
}) => {
  const { t } = useTranslation();

  return (
    <div className="max-w-5xl mx-auto pb-24">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-fuchsia-500"></span>
            </span>
            <span className="text-[10px] font-black font-mono text-fuchsia-500 uppercase tracking-widest">{t('postjob.step5_subtitle', 'FINAL_VALIDATION')}</span>
        </div>
        <h1 className="text-4xl font-black text-white mb-4 tracking-wider uppercase font-mono shadow-[0_0_15px_rgba(255,255,255,0.1)]">
          {t('postjob.step5_title', 'DEPLOYMENT_REVIEW')}
        </h1>
        <p className="text-xs font-mono text-slate-500 uppercase tracking-[0.2em] max-w-2xl mx-auto leading-relaxed">
          {t('postjob.step5_desc', 'VERIFY_ALL_PARAMETERS_BEFORE_COMMITTING_TO_THE_BLOCKCHAIN_ESCROW_GOVERNANCE.')}
        </p>
      </div>

      <div className="space-y-10">
        {/* Core Configuration Summary */}
        <section className="bg-[#090e17]/80 backdrop-blur-md border border-white/5 rounded-3xl p-8 relative overflow-hidden group hover:border-fuchsia-500/20 transition-all">
          <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-fuchsia-500/10 flex items-center justify-center text-fuchsia-500 border border-fuchsia-500/20">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h2 className="text-xs font-black text-white uppercase tracking-[0.2em] font-mono">{t('postjob.job_basics', 'CORE_PARAMETERS')}</h2>
            </div>
            <button onClick={onEditStep1} className="text-[10px] font-black text-fuchsia-500 hover:text-fuchsia-400 font-mono tracking-widest uppercase transition-colors">
              [ RE-CONFIGURE ]
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-1">
              <p className="text-[8px] font-mono text-slate-600 uppercase tracking-widest leading-none">{t('postjob.job_type_label', 'HAZARD_SPEC')}</p>
              <p className="text-[10px] font-black text-slate-300 font-mono uppercase tracking-tighter">
                {selectedType === "short-term" ? t('postjob.short_term') : t('postjob.long_term')}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[8px] font-mono text-slate-600 uppercase tracking-widest leading-none">{t('postjob.category_label_upper', 'SECTOR')}</p>
              <p className="text-[10px] font-black text-slate-300 font-mono uppercase tracking-tighter">{category?.name || "N/A"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[8px] font-mono text-slate-600 uppercase tracking-widest leading-none">{t('postjob.budget', 'TOTAL_FUNDING')}</p>
              <p className="text-[10px] font-black text-fuchsia-500 font-mono uppercase tracking-tighter">{totalBudgetNum.toLocaleString()} PTS</p>
            </div>
            <div className="space-y-1">
              <p className="text-[8px] font-mono text-slate-600 uppercase tracking-widest leading-none">{t('postjob.timeline', 'WINDOW')}</p>
              <p className="text-[10px] font-black text-slate-300 font-mono uppercase tracking-tighter">
                {formatDate(startDate, t)} {'>>'} {formatDate(endDate, t)}
              </p>
            </div>
          </div>
        </section>

        {/* Mission Dossier Summary */}
        <section className="bg-[#090e17]/80 backdrop-blur-md border border-white/5 rounded-3xl p-8 relative overflow-hidden group hover:border-fuchsia-500/20 transition-all">
          <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-fuchsia-500/10 flex items-center justify-center text-fuchsia-500 border border-fuchsia-500/20">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <h2 className="text-xs font-black text-white uppercase tracking-[0.2em] font-mono">{t('postjob.job_desc_label', 'MISSION_DOSSIER')}</h2>
            </div>
            <button onClick={onEditStep2} className="text-[10px] font-black text-fuchsia-500 hover:text-fuchsia-400 font-mono tracking-widest uppercase transition-colors">
              [ RE-WRITE ]
            </button>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-black text-white font-mono uppercase tracking-wider">{jobTitle || "UNTITLED_MISSION"}</h3>
            <p className="text-[11px] font-mono text-slate-400 leading-relaxed uppercase italic opacity-80 whitespace-pre-line border-l-2 border-fuchsia-500/20 pl-6">
              {jobDescription || "NO_DESCRIPTION_UPLOADED"}
            </p>
            <div className="flex flex-wrap gap-3">
                {skills.map((skill) => (
                  <span key={skill.id} className="px-3 py-1 rounded-lg bg-black/40 border border-white/5 text-[9px] font-black font-mono text-fuchsia-400 uppercase tracking-widest">
                    {skill.name}
                  </span>
                ))}
            </div>
          </div>
        </section>

        {/* Protocol Schedule */}
        <section className="bg-[#090e17]/80 backdrop-blur-md border border-white/5 rounded-3xl p-8 relative overflow-hidden group hover:border-fuchsia-500/20 transition-all">
          <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-fuchsia-500/10 flex items-center justify-center text-fuchsia-500 border border-fuchsia-500/20">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 00-2 2z" /></svg>
              </div>
              <h2 className="text-xs font-black text-white uppercase tracking-[0.2em] font-mono">{t('postjob.milestone_schedule', 'EXECUTION_TIMELINE')}</h2>
            </div>
            <button onClick={onEditStep3} className="text-[10px] font-black text-fuchsia-500 hover:text-fuchsia-400 font-mono tracking-widest uppercase transition-colors">
              [ RE-ALLOCATE ]
            </button>
          </div>

          <div className="space-y-4">
            {checkpoints.map((cp, index) => (
              <div key={cp.id} className="flex items-center gap-6 p-4 bg-black/40 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-black font-mono text-fuchsia-500 border border-white/10 shrink-0">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-black text-white font-mono uppercase tracking-wider truncate">{cp.title || cp.name}</p>
                      <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest italic truncate">{cp.description || "NO_SUB_PROTOCOLS"}</p>
                  </div>
                  <div className="text-right shrink-0">
                      <p className="text-[10px] font-black text-fuchsia-500 font-mono">{parseFloat(cp.points).toLocaleString()} PTS</p>
                      <p className="text-[8px] font-mono text-slate-600 uppercase tracking-widest">{formatDate(cp.due_date, t)}</p>
                  </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contract Preview */}
        <section className="bg-[#090e17]/80 backdrop-blur-md border border-white/5 rounded-3xl p-8 relative overflow-hidden group hover:border-fuchsia-500/20 transition-all">
             <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-fuchsia-500/10 flex items-center justify-center text-fuchsia-500 border border-fuchsia-500/20">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-4.44-2.03c2.42-3.32 4.154-7.44 4.414-11.972l.012-.613M12 3V2M15 11c0 2.707-1.846 5.17-4.286 5.682" /></svg>
                  </div>
                  <h2 className="text-xs font-black text-white uppercase tracking-[0.2em] font-mono">{t('postjob.contract_label', 'LEGAL_SIG_PROTOCOL')}</h2>
                </div>
            </div>
            <div className="max-h-[300px] overflow-y-auto bg-black/60 rounded-2xl p-8 border border-white/5 shadow-inner custom-review-scrollbar">
                <style dangerouslySetInnerHTML={{ __html: `
                    .custom-review-scrollbar::-webkit-scrollbar { width: 4px; }
                    .custom-review-scrollbar::-webkit-scrollbar-track { background: transparent; }
                    .custom-review-scrollbar::-webkit-scrollbar-thumb { background: rgba(217, 70, 239, 0.1); border-radius: 10px; }
                    
                    .review-content h2 { color: white; font-size: 1rem; font-weight: 900; margin-bottom: 1.5rem; text-transform: uppercase; font-family: monospace; }
                    .review-content h3 { color: #d946ef; font-size: 0.8rem; font-weight: 900; margin-top: 1.5rem; margin-bottom: 0.5rem; text-transform: uppercase; font-family: monospace; }
                    .review-content p { color: #64748b; font-size: 0.75rem; margin-bottom: 0.75rem; font-family: monospace; }
                    .review-content strong { color: white; }
                `}} />
                <div className="review-content" dangerouslySetInnerHTML={{ __html: contractHtml }} />
            </div>
        </section>
      </div>

      {/* Launch Footer */}
      <div className="fixed bottom-0 left-0 right-0 sm:left-64 p-8 bg-gradient-to-t from-[#020617] to-transparent z-50 pointer-events-none">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 pointer-events-auto">
              <button onClick={onBack} className="text-[10px] font-black font-mono tracking-[0.3em] uppercase text-slate-600 hover:text-white transition-colors order-2 sm:order-1">
                 [ CANCEL_LAUNCH ]
              </button>
              
              <div className="flex items-center gap-4 order-1 sm:order-2">
                 <button onClick={onSaveDraft} className="px-8 py-4 rounded-2xl border border-white/10 bg-white/5 text-[10px] font-black text-slate-300 font-mono tracking-widest uppercase hover:text-white hover:border-white/20 transition-all">
                    {t('postjob.save_draft', 'SAVE_TO_OFFLINE_STORAGE')}
                 </button>
                 <button onClick={onPublish} className="group relative overflow-hidden px-12 py-5 bg-fuchsia-600 rounded-2xl text-[#020617] text-xs font-black font-mono tracking-[0.3em] uppercase transition-all hover:scale-105 active:scale-95 shadow-[0_0_35px_rgba(217,70,239,0.4)]">
                    <span className="relative z-10">{t('postjob.publish_now', 'LAUNCH_MISSION_BROADCAST')}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                 </button>
              </div>
          </div>
      </div>
    </div>
  );
};

export default Step5ReviewPublish;
