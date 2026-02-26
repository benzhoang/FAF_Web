import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const JobTable = ({ contracts }) => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('ALL');

    const filteredContracts = contracts.filter(c => {
        if (filter === 'ALL') return true;
        return c.status === filter;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case 'ACTIVE': return <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-blue-100 text-blue-700">Active</span>;
            case 'COMPLETED': return <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-green-100 text-green-700">Completed</span>;
            case 'CANCELLED': 
            case 'TERMINATED': return <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-red-100 text-red-700">Cancelled</span>;
            default: return <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-gray-100 text-gray-700">{status}</span>;
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-100 px-4 pt-2">
                {['ALL', 'ACTIVE', 'COMPLETED', 'CANCELLED'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                            filter === tab 
                            ? 'border-blue-600 text-blue-600' 
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {tab === 'ALL' ? 'All Jobs' : tab.charAt(0) + tab.slice(1).toLowerCase()}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 text-xs uppercase tracking-wider text-gray-500 border-b border-gray-100">
                            <th className="px-6 py-4 font-semibold">Job Title</th>
                            <th className="px-6 py-4 font-semibold">Employer</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold text-right">Amount</th>
                            <th className="px-6 py-4 font-semibold text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredContracts.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-gray-400 italic">
                                    No jobs found for this category.
                                </td>
                            </tr>
                        ) : (
                            filteredContracts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map(contract => (
                                <tr key={contract.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors cursor-pointer" onClick={() => navigate(`/contract/${contract.id}/view`)}>
                                            {contract.job_title}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5">Updated: {new Date(contract.updated_at || contract.created_at).toLocaleDateString()}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                        {contract.client_name || 'FAF User'}
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(contract.status)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <p className="font-bold text-gray-900">${Number(contract.total_amount || 0).toLocaleString()}</p>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button 
                                            onClick={() => navigate(`/contract/${contract.id}/view`)}
                                            className="px-4 py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                                        >
                                            Details
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default JobTable;
