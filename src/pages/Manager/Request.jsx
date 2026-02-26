import React from "react";
import { useNavigate } from "react-router-dom";
import ManagerSidebar from "../../components/ManagerSidebar";

const Request = () => {
    const navigate = useNavigate();

    // Giả lập danh sách yêu cầu đăng job
    const requests = [
        {
            id: 1,
            title: "Cần tuyển lập trình viên ReactJS",
            company: "Công ty Công nghệ ABC",
            status: "Chờ duyệt",
            date: "2024-03-20",
        },
        {
            id: 2,
            title: "Thiết kế UI/UX cho ứng dụng di động",
            company: "Studio Thiết kế XYZ",
            status: "Chờ duyệt",
            date: "2024-03-21",
        },
    ];

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <ManagerSidebar />
            <main className="flex-1 p-8">
                <header className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Yêu cầu đăng job</h1>
                    <p className="text-gray-500">Xem và phê duyệt các yêu cầu đăng tin tuyển dụng.</p>
                </header>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Tiêu đề Job</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Công ty</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Ngày gửi</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Trạng thái</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {requests.map((req) => (
                                <tr key={req.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{req.title}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{req.company}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{req.date}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                                            onClick={() => navigate(`/manager/request/${req.id}`)}
                                        >
                                            Xem chi tiết
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {requests.length === 0 && (
                        <div className="p-12 text-center text-gray-500">
                            Không có yêu cầu nào đang chờ duyệt.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Request;
