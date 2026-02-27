import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from '../../contexts/ToastContext';
import TaskOwnerSidebar from "../../components/TaskOwnerSidebar";
import Step4Contract from "./PostJob/Step4";

const Contracts = () => {
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
        toast.success("Contract has been saved.");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <TaskOwnerSidebar />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm px-6 py-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Contract Templates</h1>
                            <p className="text-sm font-medium text-gray-500 mt-1">
                                View and edit your standard work contracts for future hires.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 bg-white shadow-sm cursor-pointer hover:border-blue-300 transition-colors"
                            >
                                <option value="short-term">Short-term Contract</option>
                                <option value="long-term">Long-term Contract</option>
                            </select>
                            <button
                                className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm transition-all shadow-sm"
                                onClick={() => navigate("/task-owner")}
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main content: reuse Step4Contract editor */}
                <main className="flex-1 p-6 overflow-y-auto bg-gray-50/50">
                    <Step4Contract
                        selectedType={selectedType}
                        jobTitle=""
                        contractAccepted={contractAccepted}
                        setContractAccepted={setContractAccepted}
                        onContinue={handleSaveContract}
                        onBack={() => navigate("/task-owner")}
                        hideFooter
                    />
                </main>
            </div>
        </div>
    );
};

export default Contracts;

