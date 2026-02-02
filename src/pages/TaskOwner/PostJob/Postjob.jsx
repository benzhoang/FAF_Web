import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostingProgress from './PostingProgress';
import Step1SelectType from './Step1';
import Step2JobDetails from './Step2';
import Step3BudgetMilestones from './Step3';
import Step4Contract from './Step4';
import Step5ReviewPublish from './Step5';

const Postjob = () => {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedType, setSelectedType] = useState('short-term');
  const [contractHtml, setContractHtml] = useState('');

  /* ===================== STEP 2 ===================== */
  const [jobTitle, setJobTitle] = useState('');
  const [category, setCategory] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');

  /* ===================== STEP 3 ===================== */
  const [totalBudget, setTotalBudget] = useState('5000');
  const [checkpoints, setCheckpoints] = useState([
    {
      id: 1,
      name: 'First Draft',
      title: 'Initial Concept & Wireframes',
      points: '2000',
      description:
        'Delivery of initial wireframes for the homepage and product listing screens in Figma.',
    },
    {
      id: 2,
      name: 'Final Delivery',
      title: 'High Fidelity Prototypes',
      points: '3000',
      description:
        'Interactive prototypes with all assets exported and developer handover notes.',
    },
  ]);

  /* ===================== ESCROW CALCULATION (FIX TDZ) ===================== */
  const totalBudgetNum = parseFloat(totalBudget) || 0;

  const usedPoints = useMemo(() => {
    return checkpoints.reduce(
      (sum, cp) => sum + (Number(cp.points) || 0),
      0
    );
  }, [checkpoints]);

  const usedPercent =
    totalBudgetNum > 0
      ? Math.round((usedPoints / totalBudgetNum) * 100)
      : 0;

  const isOverBudget = usedPoints > totalBudgetNum;

  const platformFee = Math.round(totalBudgetNum * 0.03);
  const totalEscrow = totalBudgetNum + platformFee;

  const isBudgetAllocated =
    Math.abs(usedPoints - totalBudgetNum) < 0.01 &&
    totalBudgetNum > 0;

  /* ===================== STEP 4 ===================== */
  const [contractAccepted, setContractAccepted] = useState(false);

  /* ===================== PROGRESS ===================== */
  const totalSteps = 5;
  const stepProgress = {
    1: { percent: 20, label: 'Step 1 of 5: Select Job Type' },
    2: { percent: 40, label: 'Step 2 of 5: Job Details' },
    3: { percent: 60, label: 'Step 3 of 5: Budget & Milestones' },
    4: { percent: 80, label: 'Step 4 of 5: Contract Agreement' },
    5: { percent: 100, label: 'Step 5 of 5: Review & Publish' },
  };

  /* ===================== NAVIGATION ===================== */
  const handleContinue = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
    }
  };

  const handleCancel = () => {
    navigate('/task-owner');
  };

  /* ===================== SKILLS ===================== */
  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim() && skills.length < 5) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
        setSkillInput('');
      }
    }
  };

  const handleRemoveSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  /* ===================== CHECKPOINTS ===================== */
  const handleAddCheckpoint = () => {
    const newId =
      checkpoints.length > 0
        ? Math.max(...checkpoints.map((cp) => cp.id)) + 1
        : 1;

    setCheckpoints([
      ...checkpoints,
      {
        id: newId,
        name: `Checkpoint ${checkpoints.length + 1}`,
        title: '',
        points: '',
        description: '',
      },
    ]);
  };

  const handleRemoveCheckpoint = (id) => {
    setCheckpoints(checkpoints.filter((cp) => cp.id !== id));
  };

  const handleUpdateCheckpoint = (id, field, value) => {
    setCheckpoints(
      checkpoints.map((cp) =>
        cp.id === id ? { ...cp, [field]: value } : cp
      )
    );
  };

  /* ===================== PUBLISH ===================== */
  const handlePublish = () => {
    alert('Job đã được publish thành công! (demo)');
    navigate('/task-owner');
  };

  const handleSaveDraft = () => {
    alert('Job đã được lưu nháp! (demo)');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PostingProgress
        currentStep={currentStep}
        stepProgress={stepProgress}
      />

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
            setSkills={setSkills}
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
            usedPoints={usedPoints}
            usedPercent={usedPercent}
            isOverBudget={isOverBudget}
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
            onContinue={(html) => {
              setContractHtml(html);
              handleContinue();
            }}
            onBack={handleBack}
          />
        )}

        {currentStep === 5 && (
          <Step5ReviewPublish
            contractHtml={contractHtml}
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
    </div>
  );
};

export default Postjob;
