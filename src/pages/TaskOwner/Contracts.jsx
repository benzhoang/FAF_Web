import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TaskOwnerSidebar from "../../components/TaskOwnerSidebar";
import Step4Contract from "./PostJob/Step4";

const Contracts = () => {
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
        alert("Contract has been saved.");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <TaskOwnerSidebar />

            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Contracts</h1>
                            <p className="text-sm text-gray-600">
                                View and edit your standard work contracts.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-500 bg-white"
                            >
                                <option value="short-term">Short-term contract</option>
                                <option value="long-term">Long-term contract</option>
                            </select>
                            <button
                                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                                onClick={() => navigate("/task-owner")}
                            >
                                Back to dashboard
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main content: reuse Step4Contract editor */}
                <main className="flex-1 p-6 overflow-y-auto">
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

