import React from 'react'
import Step1 from './Step1'

const Apply = () => {
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
                            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                                1
                            </div>
                            <span className="text-xs font-semibold text-slate-900">Profile Review</span>
                        </div>
                        {/* Step 2 */}
                        <div className="flex flex-col items-center gap-2 bg-slate-50 px-2">
                            <div className="w-9 h-9 rounded-full border border-slate-300 bg-white text-slate-500 flex items-center justify-center text-sm font-semibold">
                                2
                            </div>
                            <span className="text-xs font-medium text-slate-500">Milestones</span>
                        </div>
                        {/* Step 3 */}
                        <div className="flex flex-col items-center gap-2 bg-slate-50 px-2">
                            <div className="w-9 h-9 rounded-full border border-slate-300 bg-white text-slate-500 flex items-center justify-center text-sm font-semibold">
                                3
                            </div>
                            <span className="text-xs font-medium text-slate-500">Submit</span>
                        </div>
                    </div>
                </div>

                <Step1 />
            </main>
        </div>
    )
}

export default Apply

