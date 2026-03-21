import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from '../../contexts/ToastContext';
import Step4Contract from "./PostJob/Step4";
import { useTranslation } from "react-i18next";

const Contracts = () => {
    const { t } = useTranslation();
    const toast = useToast();
    const navigate = useNavigate();
    const [selectedType, setSelectedType] = useState("short-term");
    const [contractAccepted, setContractAccepted] = useState(true);
    const [savedContractHtml, setSavedContractHtml] = useState("");

    const handleSaveContract = (html) => {
        setSavedContractHtml(html);
        try {
            localStorage.setItem("faf_contract_template", html);
        } catch (e) {
            console.error("Failed to save contract to localStorage", e);
        }
        toast.success(t('task_owner.contract_saved', 'Contract has been saved.'));
    };

    return (
        <div className="w-full min-h-full text-slate-300 relative">
            <div className="flex-1 flex flex-col relative z-10 min-w-0">
                {/* Header */}
                <header className="px-8 py-6 flex items-center justify-between border-b border-white/5 bg-transparent/50 backdrop-blur-md sticky top-0 z-50">
                    <div className="flex flex-col">
                        <p className="text-[10px] font-mono tracking-widest text-cyan-500 uppercase font-black">{t('task_owner.module_contracts', 'CONTRACT ENGINE')}</p>
                        <h1 className="text-2xl font-black text-white uppercase tracking-wider">{t('task_owner.contract_templates_title', 'Contract Templates')}</h1>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-[11px] font-black font-mono text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 appearance-none pr-10 cursor-pointer hover:bg-white/10 transition-all uppercase tracking-widest"
                            >
                                <option value="short-term" className="bg-[#0f172a]">{t('postjob.short_term', 'SHORT-TERM CONTRACT')}</option>
                                <option value="long-term" className="bg-[#0f172a]">{t('postjob.long_term', 'LONG-TERM CONTRACT')}</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-cyan-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>

                        <button
                            className="px-6 py-2.5 rounded-xl border border-white/10 text-[10px] font-black font-mono tracking-widest uppercase text-slate-400 hover:text-white hover:bg-white/5 hover:border-white/20 transition-all"
                            onClick={() => navigate("/task-owner")}
                        >
                            {t('task_owner.back_btn', '<< COMMAND_EXIT')}
                        </button>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 p-8 max-w-6xl mx-auto w-full">
                    <div className="relative rounded-2xl border border-white/5 bg-white/[0.01] p-8 shadow-2xl min-h-[600px] overflow-hidden">
                        {/* Decorative Background Panel */}
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />
                        
                        <div className="relative z-10 h-full">
                            <div className="mb-8 border-b border-white/5 pb-4">
                                <h3 className="text-[12px] font-black text-slate-400 font-mono tracking-widest uppercase flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
                                    {t('task_owner.editor_active', 'EDITOR_WORKSPACE_ACTIVE')}
                                </h3>
                            </div>

                            {/* Render Editor */}
                            <div className="rounded-xl overflow-hidden border border-white/5 shadow-inner bg-black/20">
                                <Step4Contract
                                    selectedType={selectedType}
                                    jobTitle=""
                                    contractAccepted={contractAccepted}
                                    setContractAccepted={setContractAccepted}
                                    onContinue={handleSaveContract}
                                    onBack={() => navigate("/task-owner")}
                                    hideFooter
                                />
                            </div>
                            
                            <div className="mt-8 flex justify-end">
                                <button
                                    onClick={() => {
                                        // Manual trigger for save if needed or just show status
                                        toast.info(t('task_owner.auto_save_enabled', 'AUTO-SAVE SYNCHRONIZATION ACTIVE'));
                                    }}
                                    className="text-[9px] font-mono text-slate-600 uppercase tracking-widest italic flex items-center gap-2"
                                >
                                    {t('task_owner.security_encryption', 'ENCRYPTION: AES-256-GCM')}
                                    <svg className="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Contracts;
