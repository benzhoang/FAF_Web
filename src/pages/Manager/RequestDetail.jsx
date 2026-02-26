import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import ManagerSidebar from "../../components/ManagerSidebar";

const RequestDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const handleAccept = () => {
        // TODO: Call approve API here
        alert(`Request #${id} has been approved.`);
        navigate("/manager/request");
    };

    const handleReject = () => {
        // TODO: Call reject API here
        alert(`Request #${id} has been rejected.`);
        navigate("/manager/request");
    };

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <ManagerSidebar />
            <main className="flex-1 p-8">
                <header className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Job request detail #{id}
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Review full information of this job request and decide to approve or reject it.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/manager/request")}
                        className="text-sm text-gray-600 hover:text-gray-900"
                    >
                        ← Back to list
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Job information */}
                    <section className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Job information
                        </h2>
                        <div className="space-y-4 text-sm text-gray-700">
                            <div>
                                <p className="font-medium text-gray-900">Job title</p>
                                <p>ReactJS Developer</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="font-medium text-gray-900">Company</p>
                                    <p>ABC Technology Company</p>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Requested date</p>
                                    <p>2024-03-20</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="font-medium text-gray-900">Location</p>
                                    <p>Ho Chi Minh City (Hybrid)</p>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Salary range</p>
                                    <p>$1,200 - $1,800 / month</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="font-medium text-gray-900">Job type</p>
                                    <p>Full-time, Long-term</p>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Experience level</p>
                                    <p>Mid-level (2+ years)</p>
                                </div>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Required skills</p>
                                <p className="mt-1 text-gray-700">
                                    ReactJS, JavaScript/TypeScript, RESTful APIs, Git, TailwindCSS.
                                </p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Job description</p>
                                <p className="mt-1 text-gray-700 leading-relaxed">
                                    The candidate will be responsible for building and maintaining web
                                    applications using ReactJS, collaborating closely with backend
                                    developers and designers. They must follow coding best practices,
                                    ensure performance and accessibility, and actively participate in
                                    code reviews.
                                </p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Additional notes from employer</p>
                                <p className="mt-1 text-gray-700 leading-relaxed">
                                    Priority for candidates who have experience working in product
                                    companies and are familiar with Agile/Scrum process.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Status & actions */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Request status
                            </h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Current status</span>
                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                        Pending review
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Request ID</span>
                                    <span className="font-medium text-gray-900">#{id}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Submitted by</span>
                                    <span className="font-medium text-gray-900">employer@example.com</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            <button
                                onClick={handleReject}
                                className="w-full inline-flex items-center justify-center rounded-lg border border-red-600 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition"
                            >
                                Reject
                            </button>
                            <button
                                onClick={handleAccept}
                                className="w-full inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition"
                            >
                                Accept
                            </button>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default RequestDetail;
