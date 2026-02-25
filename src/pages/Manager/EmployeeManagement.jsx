import React, { useMemo, useState } from "react";
import ManagerSidebar from "../../components/ManagerSidebar";

const EmployeeManagement = () => {
    // Demo data (thay bằng API sau)
    const employees = useMemo(
        () => [
            {
                id: "EMP001",
                fullName: "Nguyễn Văn An",
                email: "an.nguyen@faf.com",
                phone: "0901 234 567",
                department: "Kỹ thuật",
                status: "Đang làm",
                createdAt: "2024-03-12",
            },
            {
                id: "EMP002",
                fullName: "Trần Thị Bích",
                email: "bich.tran@faf.com",
                phone: "0902 345 678",
                department: "Nhân sự",
                status: "Đang làm",
                createdAt: "2024-04-01",
            },
            {
                id: "EMP003",
                fullName: "Lê Minh Khang",
                email: "khang.le@faf.com",
                phone: "0903 456 789",
                department: "Kế toán",
                status: "Tạm nghỉ",
                createdAt: "2024-02-20",
            },
        ],
        []
    );

    const [query, setQuery] = useState("");

    const filteredEmployees = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return employees;

        return employees.filter((e) => {
            const haystack = `${e.id} ${e.fullName} ${e.email} ${e.phone} ${e.department} ${e.status}`.toLowerCase();
            return haystack.includes(q);
        });
    }, [employees, query]);

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <ManagerSidebar />

            <main className="flex-1 p-8">
                <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Quản lý nhân viên</h1>
                        <p className="text-gray-500">Xem danh sách nhân viên và tra cứu nhanh.</p>
                    </div>

                    <div className="w-full sm:w-[420px]">
                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                            Tìm kiếm
                        </label>
                        <div className="relative">
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Tìm theo mã, tên, email, SĐT, phòng ban..."
                                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 pr-10 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                            />
                            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18.5a7.5 7.5 0 006.15-3.85z"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                        <div>
                            <h2 className="text-sm font-semibold text-gray-900">Danh sách nhân viên</h2>
                            <p className="text-xs text-gray-500">Tổng: {filteredEmployees.length}</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Mã NV</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Họ tên</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">SĐT</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Phòng ban</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Trạng thái</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Ngày tạo</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredEmployees.map((emp) => (
                                    <tr key={emp.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">{emp.id}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{emp.fullName}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{emp.email}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{emp.phone}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{emp.department}</td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${emp.status === "Đang làm"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-gray-100 text-gray-800"
                                                    }`}
                                            >
                                                {emp.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{emp.createdAt}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredEmployees.length === 0 && (
                            <div className="p-12 text-center text-gray-500">
                                Không tìm thấy nhân viên phù hợp.
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EmployeeManagement;
