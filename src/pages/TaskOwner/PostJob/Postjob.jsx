import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../../../contexts/ToastContext'; // Added this import
import PostingProgress from './PostingProgress';
import Step1SelectType from './Step1';
import Step2JobDetails from './Step2';
import Step3BudgetMilestones from './Step3';
import Step4Contract from './Step4';
import Step5ReviewPublish from './Step5';
import { jobsApi } from "../../../api/jobs.api";

const Postjob = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // If id exists, we are editing
  const isEditing = !!id;
  const toast = useToast(); // Added this hook call

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [selectedType, setSelectedType] = useState('SHORT_TERM'); // backend expects uppercase
  const [contractHtml, setContractHtml] = useState('');
  
  // Step 2
  const [jobTitle, setJobTitle] = useState('');
  const [category, setCategory] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [skills, setSkills] = useState([]); // [{id, name}]

  // Step 3
  const [totalBudget, setTotalBudget] = useState('5000');
  const [checkpoints, setCheckpoints] = useState([
    {
      id: 1,
      name: 'First Draft',
      title: 'Initial Concept',
      points: '2000',
      description: 'Delivery of initial draft.',
    },
  ]);

  // Step 4
  const [contractAccepted, setContractAccepted] = useState(false);

  /* ===================== FETCH DATA FOR EDITING ===================== */
  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      jobsApi.getJobDetail(id)
        .then(res => {
          const job = res.data;
          // Map backend data to state
          setJobTitle(job.title);
          setJobDescription(job.description);
          setStartDate(job.start_date || '');
          setEndDate(job.end_date || '');
          setSelectedType(job.job_type);
          setTotalBudget(String(job.budget));
          // Category needs special handling to match object structure if Step2 relies on it
          // Step2 expects object {id, name}. Job detail returns category_name and category_id
          setCategory({ id: job.category_id, name: job.category_name });
          
          // Skills
          setSkills(job.skills || []);
          
          // Checkpoints/Contract - Backend doesn't return full structure easily for editing contract/checkpoints yet
          // For now, we only support editing Title, Desc, Category, Skills as per backend limitation
          // So we might skip re-fetching checkpoints if we can't edit them fully
          // However, for UX, let's keep them as is or try to fetch.
          // Since backend updateJob only updates title/desc/cat/skills, we should probably warn user or locking Step 3/4?
          // For this iteration, we focus on Title/Desc/Skills update.
        })
        .catch(err => {
          console.error("Error fetching job for edit:", err);
          toast.error("Could not load job details");
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEditing]);

  /* ===================== ESCROW CALCULATION ===================== */
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

  /* ===================== CHECKPOINTS HANDLERS ===================== */
  const handleAddCheckpoint = () => {
    const newId = checkpoints.length > 0 ? Math.max(...checkpoints.map(cp => cp.id)) + 1 : 1;
    setCheckpoints([...checkpoints, { id: newId, name: `Checkpoint ${checkpoints.length + 1}`, title: '', points: '', description: '' }]);
  };

  const handleRemoveCheckpoint = (id) => {
    setCheckpoints(checkpoints.filter((cp) => cp.id !== id));
  };

  const handleUpdateCheckpoint = (id, field, value) => {
    setCheckpoints(checkpoints.map((cp) => cp.id === id ? { ...cp, [field]: value } : cp));
  };

  /* ===================== PUBLISH / UPDATE ===================== */
  const handlePublish = async () => {
    try {
      setLoading(true);
      const payload = {
        title: jobTitle,
        description: jobDescription,
        jobType: selectedType.replace(/-/g, '_').toUpperCase(), // SHORT_TERM or LONG_TERM
        budget: totalBudgetNum,
        categoryId: Number(category?.id), // Convert to number
        skills: skills.filter(s => s && s.id).map(s => Number(s.id)), // Convert to numbers
        startDate: startDate ? new Date(startDate).toISOString().split("T")[0] : null,
        endDate: endDate ? new Date(endDate).toISOString().split("T")[0] : null,
        checkpoints: checkpoints.map(cp => ({
          title: cp.title || cp.name,
          description: cp.description || "",
          amount: parseFloat(cp.points),
          due_date: cp.due_date ? new Date(cp.due_date).toISOString().split("T")[0] : null
        })),
        contractContent: contractHtml || "Standard FAF Contract", // Or generate derived content
      };

      console.log('🚀 Publishing job with payload:', JSON.stringify(payload, null, 2));

      if (isEditing) {
        await jobsApi.updateJob(id, payload);
        toast.success('Job updated successfully!');
      } else {
        await jobsApi.postJobs(payload);
        toast.success('Job posted successfully!');
      }
      navigate('/task-owner/jobs');
    } catch (error) {
      console.error("Error publishing job:", error);
      toast.error(error.response?.data?.message || 'Failed to publish job');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = () => {
    toast.info('Draft saving not implemented yet');
  };

  if (loading && isEditing && !jobTitle) {
      return <div className="p-10 text-center">Loading Job Details...</div>;
  }

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
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            skills={skills}
            setSkills={setSkills}
            // skillInput props removed as handled by SkillSelector
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
            totalBudgetNum={totalBudgetNum}
            checkpoints={checkpoints}
            startDate={startDate}
            endDate={endDate}
            onEditStep1={() => setCurrentStep(1)}
            onEditStep2={() => setCurrentStep(2)}
            onEditStep3={() => setCurrentStep(3)}
            onPublish={handlePublish}
            onSaveDraft={handleSaveDraft}
            onBack={handleBack}
            isEditing={isEditing}
          />
        )}
      </main>
    </div>
  );
};

export default Postjob;
