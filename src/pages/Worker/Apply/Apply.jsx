import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { jobsApi } from '../../../api/jobs.api';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';

const Apply = () => {
    const { id } = useParams();
    const [currentStep, setCurrentStep] = useState(1);
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [proposalData, setProposalData] = useState({
        coverLetter: '',
        proposedPrice: ''
    });

    useEffect(() => {
        if (id) {
            fetchJob();
        }
    }, [id]);

    const fetchJob = async () => {
        try {
            setLoading(true);
            const res = await jobsApi.getJobDetail(id);
            setJob(res.data);
            // Initialize proposed price with job budget
            setProposalData(prev => ({
                ...prev,
                proposedPrice: res.data.budget || ''
            }));
        } catch (err) {
            console.error('Failed to fetch job:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-semibold">Loading...</p>
                </div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Job not found</h2>
                    <button onClick={() => window.history.back()} className="text-blue-600 hover:underline">Go back</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-0 py-10">
                {/* Steps */}
                <div className="relative flex items-center justify-center mb-10">
                    {/* Line running through steps */}
                    <div className="absolute inset-x-10 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 pointer-events-none" />

                    <div className="relative flex items-center justify-center gap-14">
                        {/* Step 1 */}
                        <div className="flex flex-col items-center gap-2 bg-slate-50 px-2">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold ${currentStep >= 1
                                ? 'bg-blue-600 text-white'
                                : 'border border-slate-300 bg-white text-slate-500'
                                }`}>
                                {currentStep > 1 ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    '1'
                                )}
                            </div>
                            <span className={`text-xs font-semibold ${currentStep >= 1 ? 'text-slate-900' : 'text-slate-500'
                                }`}>
                                Profile
                            </span>
                        </div>
                        {/* Step 2 */}
                        <div className="flex flex-col items-center gap-2 bg-slate-50 px-2">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold ${currentStep >= 2
                                ? 'bg-blue-600 text-white'
                                : 'border border-slate-300 bg-white text-slate-500'
                                }`}>
                                {currentStep > 2 ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    '2'
                                )}
                            </div>
                            <span className={`text-xs font-semibold ${currentStep >= 2 ? 'text-slate-900' : 'text-slate-500'
                                }`}>
                                Proposal
                            </span>
                        </div>
                        {/* Step 3 */}
                        <div className="flex flex-col items-center gap-2 bg-slate-50 px-2">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold ${currentStep >= 3
                                ? 'bg-blue-600 text-white'
                                : 'border border-slate-300 bg-white text-slate-500'
                                }`}>
                                3
                            </div>
                            <span className={`text-xs font-semibold ${currentStep >= 3 ? 'text-slate-900' : 'text-slate-500'
                                }`}>
                                Review
                            </span>
                        </div>
                    </div>
                </div>

                {currentStep === 1 && <Step1 onNext={() => setCurrentStep(2)} job={job} />}
                {currentStep === 2 && (
                    <Step2 
                        onBack={() => setCurrentStep(1)} 
                        onNext={() => setCurrentStep(3)} 
                        job={job}
                        proposalData={proposalData}
                        setProposalData={setProposalData}
                    />
                )}
                {currentStep === 3 && (
                    <Step3 
                        onBack={() => setCurrentStep(2)} 
                        job={job}
                        proposalData={proposalData}
                    />
                )}
            </main>
        </div>
    )
}

export default Apply

