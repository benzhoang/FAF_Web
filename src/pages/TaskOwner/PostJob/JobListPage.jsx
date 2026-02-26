import React, { useEffect, useState } from "react";
import { jobsApi } from "../../../api/jobs.api";

// 👉 Page hiển thị danh sách jobs
export default function JobListPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await jobsApi.getAllJobs();
        setJobs(response.data);
        setError(null);
      } catch (err) {
        setError("Không thể tải danh sách job");
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, []);

  if (loading) return <div className="p-4">Đang tải jobs...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Danh sách công việc</h1>

      <div className="grid gap-4">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="border rounded-xl p-4 shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold">{job.title}</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {job.description || "Không có mô tả"}
                </p>
              </div>

              <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                {job.status}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
              <div>
                <p className="text-gray-500">Loại job</p>
                <p className="font-medium">{job.job_type}</p>
              </div>

              <div>
                <p className="text-gray-500">Ngân sách</p>
                <p className="font-medium">{Number(job.budget).toLocaleString()} điểm</p>
              </div>

              <div>
                <p className="text-gray-500">Danh mục</p>
                <p className="font-medium">{job.category_name}</p>
              </div>

              <div>
                <p className="text-gray-500">Ngày tạo</p>
                <p className="font-medium">
                  {new Date(job.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Skills */}
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-1">Skills</p>
              {job.skills && job.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span
                      key={skill.id}
                      className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm italic text-gray-400">Chưa gán skill</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
