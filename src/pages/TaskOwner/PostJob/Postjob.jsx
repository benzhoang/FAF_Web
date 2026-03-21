import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../../../contexts/ToastContext';
import PostingProgress from './PostingProgress';
import Step1SelectType from './Step1';
import Step2JobDetails from './Step2';
import Step3BudgetMilestones from './Step3';
import Step4Contract from './Step4';
import Step5ReviewPublish from './Step5';
import { jobsApi } from "../../../api/jobs.api";
import { useTranslation } from 'react-i18next';

const Postjob = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();
  const isEditing = !!id;
  const toast = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [selectedType, setSelectedType] = useState('SHORT_TERM');
  const [contractHtml, setContractHtml] = useState('');
  
  // Step 2
  const [jobTitle, setJobTitle] = useState('');
  const [category, setCategory] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [skills, setSkills] = useState([]);

  // Step 3
  const [totalBudget, setTotalBudget] = useState('5000');
  const [checkpoints, setCheckpoints] = useState([
    {
      id: 1,
      name: t('postjob.default_cp_name'),
      title: t('postjob.default_cp_title'),
      points: '2000',
      description: t('postjob.default_cp_desc'),
    },
  ]);

  // Step 4
  const [contractAccepted, setContractAccepted] = useState(false);

  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      jobsApi.getJobDetail(id)
        .then(res => {
          const job = res.data;
          setJobTitle(job.title);
          setJobDescription(job.description);
          setStartDate(job.start_date || '');
          setEndDate(job.end_date || '');
          setSelectedType(job.job_type);
          setTotalBudget(String(job.budget));
          setCategory({ id: job.category_id, name: job.category_name });
          setSkills(job.skills || []);
        })
        .catch(err => {
          console.error("Error fetching job for edit:", err);
          toast.error(t('postjob.msg_err_load_job'));
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEditing]);

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

  const totalSteps = 5;
  const stepProgress = {
    1: { percent: 20, label: t('postjob.progress_1') },
    2: { percent: 40, label: t('postjob.progress_2') },
    3: { percent: 60, label: t('postjob.progress_3') },
    4: { percent: 80, label: t('postjob.progress_4') },
    5: { percent: 100, label: t('postjob.progress_5') },
  };

  const handleContinue = () => {
    // Validate Step 2 fields
    if (currentStep === 2) {
      if (!jobTitle.trim()) {
        toast.error(t('postjob.err_title_required', 'Vui lòng nhập tiêu đề công việc'));
        return;
      }
      if (jobTitle.trim().length < 10) {
        toast.error(t('postjob.err_title_min', 'Tiêu đề phải có ít nhất 10 ký tự'));
        return;
      }
      if (!jobDescription.trim()) {
        toast.error(t('postjob.err_desc_required', 'Vui lòng nhập mô tả công việc'));
        return;
      }
      if (jobDescription.trim().length < 20) {
        toast.error(t('postjob.err_desc_min', 'Mô tả phải có ít nhất 20 ký tự'));
        return;
      }
      if (!category) {
        toast.error(t('postjob.err_category_required', 'Vui lòng chọn danh mục công việc'));
        return;
      }
      if (!startDate) {
        toast.error('Vui lòng chọn ngày bắt đầu dự kiến');
        return;
      }
      if (!endDate) {
        toast.error('Vui lòng chọn ngày kết thúc dự kiến');
        return;
      }
      if (new Date(endDate) < new Date(startDate)) {
        toast.error('Ngày kết thúc không được trước ngày bắt đầu');
        return;
      }
      if (!skills || skills.length === 0) {
        toast.error('Vui lòng chọn ít nhất 1 kỹ năng yêu cầu (tối đa 5)');
        return;
      }
    }
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

  const handleAddCheckpoint = () => {
    const newId = checkpoints.length > 0 ? Math.max(...checkpoints.map(cp => cp.id)) + 1 : 1;
    setCheckpoints([...checkpoints, { id: newId, name: `${t('postjob.checkpoint')} ${checkpoints.length + 1}`, title: '', points: '', description: '' }]);
  };

  const handleRemoveCheckpoint = (id) => {
    setCheckpoints(checkpoints.filter((cp) => cp.id !== id));
  };

  const handleUpdateCheckpoint = (id, field, value) => {
    setCheckpoints(checkpoints.map((cp) => cp.id === id ? { ...cp, [field]: value } : cp));
  };

  const handlePublish = async () => {
    try {
      setLoading(true);
      const payload = {
        title: jobTitle,
        description: jobDescription,
        jobType: selectedType.replace(/-/g, '_').toUpperCase(),
        budget: totalBudgetNum,
        categoryId: Number(category?.id),
        skills: skills.filter(s => s && s.id).map(s => Number(s.id)),
        startDate: startDate ? new Date(startDate).toISOString().split("T")[0] : null,
        endDate: endDate ? new Date(endDate).toISOString().split("T")[0] : null,
        checkpoints: checkpoints.map(cp => ({
          title: cp.title || cp.name,
          description: cp.description || "",
          amount: parseFloat(cp.points),
          duration_days: parseInt(cp.duration_days) || 7
        })),
        contractContent: contractHtml || "Standard FAF Contract",
      };

      if (isEditing) {
        await jobsApi.updateJob(id, payload);
        toast.success(t('postjob.msg_job_updated'));
      } else {
        await jobsApi.postJobs(payload);
        toast.success(t('postjob.msg_job_posted'));
      }
      navigate('/task-owner/jobs');
    } catch (error) {
      console.error("Error publishing job:", error);
      toast.error(error.response?.data?.message || t('postjob.msg_job_failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = () => {
    toast.info(t('postjob.msg_draft_not_impl'));
  };

  if (loading && isEditing && !jobTitle) {
      return (
        <div className="min-h-screen bg-transparent flex items-center justify-center font-mono text-fuchsia-500">
            <div className="flex items-center gap-3 animate-pulse">
                <div className="w-6 h-6 border-2 border-fuchsia-500 border-t-transparent rounded flex animate-spin"></div>
                RETRIEVING_JOB_STRUCTURE...
            </div>
        </div>
      );
  }

  return (
    <div className="w-full min-h-screen bg-transparent text-slate-300 relative flex overflow-hidden">
      
      <div className="flex-1 flex flex-col relative z-10 w-full overflow-y-auto custom-scrollbar">
        <PostingProgress
          currentStep={currentStep}
          stepProgress={stepProgress}
        />

        <main className="flex-1 px-4 sm:px-10 py-10 max-w-5xl mx-auto w-full">
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

      <style jsx="true">{`
          .custom-scrollbar::-webkit-scrollbar {
              width: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
              background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(217, 70, 239, 0.2);
              border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(217, 70, 239, 0.4);
          }
      `}</style>
    </div>
  );
};

export default Postjob;
