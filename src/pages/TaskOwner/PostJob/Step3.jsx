import React, { useEffect, useState } from "react";
import { userApi } from "../../../api/user.api";
import { useTranslation } from "react-i18next";

const Step3BudgetMilestones = ({
  totalBudget,
  setTotalBudget,
  checkpoints,
  onAddCheckpoint,
  onRemoveCheckpoint,
  onUpdateCheckpoint,
  totalBudgetNum,
  usedPoints,
  usedPercent,
  isOverBudget,
  isBudgetAllocated,
  onContinue,
  onBack,
}) => {
  const { t } = useTranslation();
  const [wallet, setWallet] = useState(0);
  const [validationErrors, setValidationErrors] = useState([]);

  useEffect(() => {
    userApi
      .getMe()
      .then((res) => {
        setWallet(res.balance_points);
      })
      .catch((err) => {
        console.error('Failed to fetch wallet balance:', err);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-10">
          <div className="border-b border-white/5 pb-6">
            <p className="text-[10px] font-mono font-black text-fuchsia-500 uppercase tracking-[0.3em] mb-2">{t('postjob.step3_subtitle', 'ESCROW_ALLOCATION')}</p>
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider font-mono">
              {t('postjob.step3_title', 'BUDGET_&_MILESTONES')}
            </h1>
          </div>

          {/* Total Job Budget Input */}
          <div className="bg-[#090e17]/80 backdrop-blur-md rounded-2xl border border-white/5 p-8 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/5 blur-3xl rounded-full -mr-16 -mt-16" />
             
             <div className="relative z-10">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono mb-3">
                  {t('postjob.total_budget', 'TOTAL_MISSION_FUNDING')}
                </label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-fuchsia-500 font-mono font-black text-lg group-focus-within:animate-pulse">
                    $
                  </span>
                  <input
                    type="number"
                    value={totalBudget}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (!isNaN(value) && value >= 0 && value <= wallet) {
                        setTotalBudget(value);
                      }
                    }}
                    className="w-full pl-10 pr-20 py-4 bg-black/40 border border-white/10 rounded-xl text-white font-mono text-xl outline-none focus:border-fuchsia-500/50 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none shadow-inner"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black font-mono text-slate-600 uppercase tracking-widest">
                    PTS_CREDITS
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
                    <p className="text-[9px] font-mono text-slate-600 uppercase tracking-[0.2em] italic">
                        {t('postjob.total_budget_desc', 'FUNDS_WILL_BE_LOCKED_IN_ESCROW_UPON_PUBLICATION')}
                    </p>
                </div>
             </div>
          </div>

          {/* Project Checkpoints / Milestones */}
          <div className="space-y-6">
            <div className="flex items-end justify-between px-2">
              <div className="flex flex-col gap-1">
                <h2 className="text-[12px] font-black text-white uppercase tracking-[0.2em] font-mono">
                    {t('postjob.project_checkpoints', 'MILESTONE_SYNCHRONIZATION')}
                </h2>
                <span className="text-[9px] font-mono text-fuchsia-500/50 uppercase tracking-widest">
                    {checkpoints.length} {t('postjob.checkpoint_count', 'PROTOCOLS_DEFINED')}
                </span>
              </div>
            </div>

            <div className="space-y-6">
              {checkpoints.map((checkpoint, index) => (
                <div
                  key={checkpoint.id}
                  className="group relative bg-white/[0.02] border border-white/5 rounded-2xl p-8 hover:border-fuchsia-500/30 transition-all hover:bg-white/[0.03] shadow-lg"
                >
                  {/* Step Number Tag */}
                  <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-[#090e17] border border-white/10 flex items-center justify-center font-black font-mono text-fuchsia-500 shadow-xl group-hover:border-fuchsia-500/50 transition-colors">
                      {String(index + 1).padStart(2, '0')}
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => onRemoveCheckpoint(checkpoint.id)}
                    className="absolute top-4 right-4 p-2 text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                    {/* Milestone Name */}
                    <div className="space-y-2">
                      <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest font-mono">
                        {t('postjob.checkpoint_name', 'MILESTONE_ID')}
                      </label>
                      <input
                        type="text"
                        value={checkpoint.name}
                        onChange={(e) => onUpdateCheckpoint(checkpoint.id, "name", e.target.value)}
                        className="w-full px-4 py-2.5 bg-black/40 border border-white/5 rounded-lg text-white font-mono text-sm outline-none focus:border-fuchsia-500/40 transition-all uppercase"
                      />
                    </div>

                    {/* Milestone Allocation */}
                    <div className="space-y-2">
                      <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest font-mono">
                        {t('postjob.checkpoint_points', 'ALLOCATION_PTS')}
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={checkpoint.points}
                          onChange={(e) => {
                            const value = Number(e.target.value) || 0;
                            const otherPoints = checkpoints.reduce((sum, cp) => cp.id === checkpoint.id ? sum : sum + (Number(cp.points) || 0), 0);
                            if (otherPoints + value > totalBudgetNum) return;
                            onUpdateCheckpoint(checkpoint.id, "points", value);
                          }}
                          className="w-full px-4 py-2.5 pr-12 bg-black/40 border border-white/5 rounded-lg text-fuchsia-400 font-mono text-sm outline-none focus:border-fuchsia-500/40 transition-all"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black font-mono text-slate-600">PTS</span>
                      </div>
                    </div>

                    {/* Milestone Title (Detailed) */}
                    <div className="space-y-2">
                      <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest font-mono">
                        {t('postjob.checkpoint_title', 'PROTOCOL_LABEL')}
                      </label>
                      <input
                        type="text"
                        value={checkpoint.title}
                        onChange={(e) => onUpdateCheckpoint(checkpoint.id, "title", e.target.value)}
                        placeholder="e.g. ALPHA_V01_DELIVERY"
                        className="w-full px-4 py-2.5 bg-black/40 border border-white/5 rounded-lg text-white font-mono text-sm outline-none focus:border-fuchsia-500/40 transition-all"
                      />
                    </div>

                    {/* Duration in Days */}
                    <div className="space-y-2">
                      <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest font-mono">
                        {t('postjob.checkpoint_duration', 'DAYS TO COMPLETE')}
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={checkpoint.duration_days || ""}
                        onChange={(e) => onUpdateCheckpoint(checkpoint.id, "duration_days", e.target.value)}
                        className="w-full px-4 py-2.5 bg-black/40 border border-white/5 rounded-lg text-white font-mono text-xs outline-none focus:border-fuchsia-500/40 transition-all [color-scheme:dark]"
                        placeholder="e.g. 7"
                      />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2 space-y-2">
                        <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest font-mono">
                          {t('postjob.checkpoint_desc', 'EXECUTION_CONSTRIANTS')}
                        </label>
                        <textarea
                          value={checkpoint.description}
                          onChange={(e) => onUpdateCheckpoint(checkpoint.id, "description", e.target.value)}
                          placeholder={t('postjob.checkpoint_desc_pl', 'DEFINE_MILESTONE_SUCCESS_CRITERIA...')}
                          rows={3}
                          className="w-full px-4 py-3 bg-black/40 border border-white/5 rounded-lg text-slate-400 font-mono text-xs outline-none focus:border-fuchsia-500/40 transition-all resize-none italic"
                        />
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Checkpoint Button */}
              <button
                type="button"
                onClick={onAddCheckpoint}
                className="w-full border-2 border-dashed border-white/5 rounded-2xl p-8 hover:border-fuchsia-500/30 hover:bg-white/[0.01] transition-all group"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-fuchsia-500 group-hover:scale-110 transition-all border border-white/10 group-hover:border-fuchsia-500/30">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                  </div>
                  <span className="text-[10px] font-black font-mono text-slate-500 uppercase tracking-[0.3em] group-hover:text-slate-300">
                    {t('postjob.add_checkpoint', 'INITIALIZE_NEW_PROTOCOL')}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR: Escrow Monitor */}
        <div className="lg:col-span-1">
          <div className="sticky top-10 space-y-6">
            <div className="bg-[#090e17] rounded-3xl border-l-4 border-fuchsia-500 p-8 shadow-2xl relative overflow-hidden">
                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCI+CjxwYXRoIGQ9Ik0gMzAgMCBMIDAgMCBMIDAgMzAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyMTcsNzAsMjM5LDAuMDIpIiBzdHJva2Utd2lkdGg9IjEiLz4KPC9zdmc+')] pointer-events-none" />
                
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 flex items-center justify-center text-fuchsia-500 border border-fuchsia-500/20 shadow-[0_0_15px_rgba(217,70,239,0.2)]">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04" /></svg>
                      </div>
                      <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] font-mono">
                        {t('postjob.escrow_summary', 'ESCROW_MONITOR')}
                      </h3>
                    </div>

                    <div className="space-y-6 mb-8">
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{t('postjob.allocated', 'ALLOCATED')}</span>
                        <div className="text-right">
                            <span className={`text-xl font-black font-mono transition-colors ${isOverBudget ? "text-rose-500" : "text-white"}`}>
                              {usedPoints.toLocaleString()}
                            </span>
                            <span className="text-[10px] font-mono text-slate-600 ml-2">/ {totalBudgetNum.toLocaleString()} PTS</span>
                        </div>
                      </div>

                      {/* Power Bar */}
                      <div className="relative h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[2px]">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(217,70,239,0.4)] ${
                            isOverBudget ? "bg-rose-600" : "bg-gradient-to-r from-fuchsia-600 to-violet-500"
                          }`}
                          style={{ width: `${Math.min(usedPercent, 100)}%` }}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                              <p className="text-[8px] font-mono text-slate-600 uppercase tracking-widest mb-1">{t('postjob.efficiency', 'EFFICIENCY')}</p>
                              <p className="text-xs font-black font-mono text-fuchsia-500">{usedPercent}%</p>
                          </div>
                          <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                              <p className="text-[8px] font-mono text-slate-600 uppercase tracking-widest mb-1">{t('postjob.available', 'RESERVE')}</p>
                              <p className="text-xs font-black font-mono text-emerald-400 italic">{(wallet || 0).toLocaleString()}</p>
                          </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-fuchsia-500/10 bg-fuchsia-500/5 mb-8">
                        <p className="text-[9px] font-mono text-fuchsia-400/70 leading-relaxed uppercase italic">
                          {t('postjob.escrow_notice', 'LOCKED_FUNDS_CANNOT_BE_WITHDRAWN_UNTIL_MISSION_RESOLUTION_OR_AUTHORIZED_TERMINATION.')}
                        </p>
                    </div>

                    {isBudgetAllocated && (
                      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mb-8 animate-pulse">
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                          <p className="text-[10px] font-black font-mono text-emerald-400 uppercase tracking-widest">
                            {t('postjob.budget_allocated_notice', 'ALLOCATION_NOMINAL')}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Navigation Actions */}
                    <div className="space-y-4 pt-6 border-t border-white/5">
                      {validationErrors.length > 0 && (
                        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 mb-4">
                          <div className="flex items-start gap-2">
                            <svg className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <div className="flex-1">
                              <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">{t('postjob.fix_errors', 'SYNC_ERRORS')}</p>
                              <ul className="text-[8px] text-rose-300 space-y-1 font-mono uppercase italic">
                                {validationErrors.map((error, idx) => (
                                  <li key={idx}>• {error}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}

                      <button
                        onClick={() => {
                          const errors = [];
                          checkpoints.forEach((cp, idx) => { if (!cp.duration_days || cp.duration_days < 1) errors.push(`Milestone ${idx+1} requires valid duration mapping in days`); });
                          if (!isBudgetAllocated) errors.push(t('postjob.err_budget_mismatch', { used: usedPoints, total: totalBudgetNum }));
                          if (errors.length > 0) { setValidationErrors(errors); return; }
                          setValidationErrors([]);
                          onContinue();
                        }}
                        className="group relative w-full py-4 bg-fuchsia-600 hover:bg-fuchsia-500 text-[#020617] font-black font-mono text-[11px] tracking-[0.2em] uppercase rounded-xl shadow-[0_0_25px_rgba(217,70,239,0.3)] transition-all active:scale-[0.98] overflow-hidden"
                      >
                        <span className="relative z-10">{t('postjob.btn_continue', 'VERIFY_ESCROW')}</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      </button>

                      <button
                        onClick={onBack}
                        className="w-full py-2 text-[10px] font-black font-mono tracking-[0.2em] uppercase text-slate-600 hover:text-white transition-colors"
                      >
                        {t('postjob.btn_back_details', '<< STAGE_02')}
                      </button>
                    </div>
                </div>
            </div>

            {/* Hardware Status Decoder */}
            <div className="px-6 py-4 rounded-2xl border border-white/5 bg-white/[0.01] flex items-center justify-between opacity-50">
                <div className="flex flex-col">
                  <span className="text-[8px] font-mono text-slate-600 uppercase tracking-widest leading-none mb-1">AUTH_SIG</span>
                  <span className="text-[10px] font-mono text-fuchsia-500 font-bold uppercase tracking-tighter">0xFAF_X82..A1</span>
                </div>
                <div className="w-10 h-0.5 bg-fuchsia-500/20 rounded-full" />
                <div className="flex flex-col text-right">
                  <span className="text-[8px] font-mono text-slate-600 uppercase tracking-widest leading-none mb-1">LATENCY</span>
                  <span className="text-[10px] font-mono text-emerald-500 font-bold uppercase tracking-tighter">14.0 MS</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3BudgetMilestones;
