import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostingProgress from './PostingProgress';
import Step1SelectType from './Step1SelectType';
import Step2JobDetails from './Step2JobDetails';
import Step3BudgetMilestones from './Step3BudgetMilestones';
import Step4Contract from './Step4Contract';
import Step5ReviewPublish from './Step5ReviewPublish';

const Postjob = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedType, setSelectedType] = useState('short-term');

    // Step 2 states
    const [jobTitle, setJobTitle] = useState('');
    const [category, setCategory] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [skills, setSkills] = useState(['UI/UX Design', 'Figma']);
    const [skillInput, setSkillInput] = useState('');

    // Step 3 states
    const [totalBudget, setTotalBudget] = useState('5000');
    const [checkpoints, setCheckpoints] = useState([
        {
            id: 1,
            name: 'First Draft',
            title: 'Initial Concept & Wireframes',
            points: '2000',
            description: 'Delivery of initial wireframes for the homepage and product listing screens in Figma.'
        },
        {
            id: 2,
            name: 'Final Delivery',
            title: 'High Fidelity Prototypes',
            points: '3000',
            description: 'Interactive prototypes with all assets exported and developer handover notes.'
        }
    ]);

    // Step 4 states
    const [contractAccepted, setContractAccepted] = useState(false);

    const totalSteps = 5;
    const stepProgress = {
        1: { percent: 20, label: 'Step 1 of 5: Select Job Type' },
        2: { percent: 40, label: 'Step 2 of 5: Job Details' },
        3: { percent: 60, label: 'Step 3 of 5: Budget & Milestones' },
        4: { percent: 80, label: 'Step 4 of 5: Contract Agreement' },
        5: { percent: 100, label: 'Step 5 of 5: Review & Publish' }
    };

    const handlePublish = () => {
        // TODO: call API tạo job thật sự ở đây
        alert('Job đã được publish thành công! (demo)');
        navigate('/task-owner');
    };

    const handleSaveDraft = () => {
        // TODO: lưu nháp lên backend nếu cần
        alert('Job đã được lưu nháp! (demo)');
    };

    const handleContinue = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleAddSkill = (e) => {
        if (e.key === 'Enter' && skillInput.trim() && skills.length < 5) {
            e.preventDefault();
            if (!skills.includes(skillInput.trim())) {
                setSkills([...skills, skillInput.trim()]);
                setSkillInput('');
            }
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setSkills(skills.filter(skill => skill !== skillToRemove));
    };

    const handleCancel = () => {
        navigate('/task-owner');
    };

    // Step 3 handlers
    const handleAddCheckpoint = () => {
        const newId = checkpoints.length > 0 ? Math.max(...checkpoints.map(cp => cp.id)) + 1 : 1;
        setCheckpoints([
            ...checkpoints,
            {
                id: newId,
                name: `Checkpoint ${checkpoints.length + 1}`,
                title: '',
                points: '',
                description: ''
            }
        ]);
    };

    const handleRemoveCheckpoint = (id) => {
        setCheckpoints(checkpoints.filter(cp => cp.id !== id));
    };

    const handleUpdateCheckpoint = (id, field, value) => {
        setCheckpoints(checkpoints.map(cp =>
            cp.id === id ? { ...cp, [field]: value } : cp
        ));
    };

    // Calculate escrow summary
    const totalBudgetNum = parseFloat(totalBudget) || 0;
    const platformFee = Math.round(totalBudgetNum * 0.03);
    const totalEscrow = totalBudgetNum + platformFee;
    const allocatedPoints = checkpoints.reduce((sum, cp) => sum + (parseFloat(cp.points) || 0), 0);
    const isBudgetAllocated = Math.abs(allocatedPoints - totalBudgetNum) < 0.01 && totalBudgetNum > 0;

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Progress */}
            <PostingProgress currentStep={currentStep} stepProgress={stepProgress} />

            {/* Main content */}
            <main className="flex-1 px-10 py-10">
                {currentStep === 1 && (
                    <Step1SelectType
                        selectedType={selectedType}
                        setSelectedType={setSelectedType}
                        onContinue={handleContinue}
                        onCancel={handleCancel}
                    />
                )}

                {currentStep === 2 && (
                    <Step2JobDetails
                        jobTitle={jobTitle}
                        setJobTitle={setJobTitle}
                        category={category}
                        setCategory={setCategory}
                        jobDescription={jobDescription}
                        setJobDescription={setJobDescription}
                        skills={skills}
                        skillInput={skillInput}
                        setSkillInput={setSkillInput}
                        onAddSkillKeyDown={handleAddSkill}
                        onRemoveSkill={handleRemoveSkill}
                        onContinue={handleContinue}
                        onBack={handleBack}
                    />
                )}

                {currentStep === 3 && (
                    <Step3BudgetMilestones
                        totalBudget={totalBudget}
                        setTotalBudget={setTotalBudget}
                        checkpoints={checkpoints}
                        onAddCheckpoint={handleAddCheckpoint}
                        onRemoveCheckpoint={handleRemoveCheckpoint}
                        onUpdateCheckpoint={handleUpdateCheckpoint}
                        totalBudgetNum={totalBudgetNum}
                        platformFee={platformFee}
                        totalEscrow={totalEscrow}
                        isBudgetAllocated={isBudgetAllocated}
                        onContinue={handleContinue}
                        onBack={handleBack}
                    />
                )}

                {currentStep === 4 && (
                    <Step4Contract
                        selectedType={selectedType}
                        jobTitle={jobTitle}
                        contractAccepted={contractAccepted}
                        setContractAccepted={setContractAccepted}
                        onContinue={handleContinue}
                        onBack={handleBack}
                    />
                )}

                {currentStep === 5 && (
                    <Step5ReviewPublish
                        selectedType={selectedType}
                        category={category}
                        jobTitle={jobTitle}
                        jobDescription={jobDescription}
                        skills={skills}
                        totalBudgetNum={totalBudgetNum}
                        checkpoints={checkpoints}
                        onEditStep1={() => setCurrentStep(1)}
                        onEditStep2={() => setCurrentStep(2)}
                        onEditStep3={() => setCurrentStep(3)}
                        onPublish={handlePublish}
                        onSaveDraft={handleSaveDraft}
                        onBack={handleBack}
                    />
                )}
            </main>

            {/* Footer */}
            <footer className="w-full border-t border-gray-100 px-10 py-4 text-xs text-gray-500 flex items-center justify-between">
                <span>© 2024 FAF Marketplace Inc. All rights reserved.</span>
                <div className="flex items-center gap-6">
                    <button className="hover:text-gray-800">Help Center</button>
                    <button className="hover:text-gray-800">Terms of Service</button>
                    <button className="hover:text-gray-800">Privacy Policy</button>
                </div>
            </footer>
        </div>
    );
};

export default Postjob;
