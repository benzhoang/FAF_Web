import React from 'react';
import { useTranslation } from 'react-i18next';

const PostingProgress = ({ currentStep, stepProgress }) => {
    const { t } = useTranslation();
    const progress = stepProgress[currentStep].percent;
    const label = stepProgress[currentStep].label;

    return (
        <section className="px-10 pt-10 pb-2 relative z-10 border-b border-white/5 bg-transparent/40 backdrop-blur-sm">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-end justify-between mb-4">
                    <div className="flex flex-col gap-1">
                        <p className="text-[10px] font-mono font-black text-fuchsia-500 uppercase tracking-[0.3em] animate-pulse">
                            {t('postjob.process_label', 'DEPLOYMENT_PHASE')}
                        </p>
                        <h2 className="text-xl font-black text-white uppercase tracking-wider font-mono">
                            {label}
                        </h2>
                    </div>
                    <div className="text-right flex flex-col items-end">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1 italic">
                            {t('postjob.complete', 'SYNCHRONIZED')}
                        </span>
                        <span className="text-2xl font-black text-white font-mono leading-none">
                            {progress}<span className="text-fuchsia-500 text-sm">%</span>
                        </span>
                    </div>
                </div>

                {/* Progress Bar Container */}
                <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 shadow-inner">
                    {/* Active Progress */}
                    <div
                        className="absolute h-full bg-gradient-to-r from-fuchsia-600 to-violet-500 rounded-full transition-all duration-700 ease-out shadow-[0_0_15px_rgba(217,70,239,0.5)]"
                        style={{ width: `${progress}%` }}
                    />
                    
                    {/* Glitch/Scanline effect on progress */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgo8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWRhc2hhcnJheT0iMSAzIi8+Cjwvc3ZnPg==')] opacity-30"></div>
                </div>

                {/* Step Indicators */}
                <div className="mt-4 flex justify-between">
                    {[1, 2, 3, 4, 5].map((step) => (
                        <div key={step} className="flex flex-col items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                                step <= currentStep 
                                    ? 'bg-fuchsia-500 shadow-[0_0_8px_rgba(217,70,239,0.8)]' 
                                    : 'bg-white/10'
                            }`} />
                            <span className={`text-[8px] font-mono tracking-tighter uppercase ${
                                step === currentStep ? 'text-fuchsia-400 font-black' : 'text-slate-600'
                            }`}>
                                STAGE_{step.toString().padStart(2, '0')}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PostingProgress;
