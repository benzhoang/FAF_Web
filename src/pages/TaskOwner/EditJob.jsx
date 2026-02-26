import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import TaskOwnerSidebar from '../../components/TaskOwnerSidebar';
import { jobsApi } from '../../api/jobs.api';
import SkillSelector from '../../components/SkillSelector';

const EditJob = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState([]);
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category_id: '',
        skills: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [jobRes, cateRes] = await Promise.all([
                    jobsApi.getJobDetail(id),
                    jobsApi.getCate()
                ]);
                
                const job = jobRes.data;
                setFormData({
                    title: job.title,
                    description: job.description || '',
                    category_id: job.category_id,
                    skills: job.skills || [] // expecting array of objects {id, name}
                });
                
                setCategories(cateRes.data || []);
            } catch (err) {
                console.error("Failed to load job for editing:", err);
                toast.error("Could not load job details.");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchData();
    }, [id]);

    const handleSave = async () => {
        if (!formData.title.trim()) return toast.warning("Title is required");
        
        try {
            setSaving(true);
            
            // Construct payload compatible with updateJob endpoint
            const payload = {
                title: formData.title,
                description: formData.description,
                categoryId: formData.category_id,
                skills: formData.skills.filter(s => s && s.id).map(s => s.id)
            };

            await jobsApi.updateJob(id, payload);
            toast.success("Job updated successfully!");
            navigate(`/task-owner/jobs/${id}`);
        } catch (err) {
            console.error("Failed to update job:", err);
            toast.error(err.response?.data?.message || "Error updating job");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <TaskOwnerSidebar />
            <div className="flex-1 p-8">
                <div className="max-w-3xl mx-auto bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <h1 className="text-xl font-bold text-gray-900">Edit Job Details</h1>
                        <button 
                            onClick={() => navigate(`/task-owner/jobs/${id}`)}
                            className="text-sm text-gray-500 hover:text-gray-900"
                        >
                            Cancel
                        </button>
                    </div>
                    
                    <div className="p-6 space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                            <select
                                value={formData.category_id}
                                onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                            >
                                <option value="">Select Category</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                            <textarea
                                rows={6}
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                            />
                        </div>

                        {/* Skills */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Skills</label>
                            <SkillSelector
                                selectedSkills={formData.skills}
                                onChange={(newSkills) => setFormData({...formData, skills: newSkills})}
                                placeholder="Add required skills..."
                            />
                        </div>

                        {/* Save Button */}
                        <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                            <button
                                onClick={() => navigate(`/task-owner/jobs/${id}`)}
                                className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditJob;
