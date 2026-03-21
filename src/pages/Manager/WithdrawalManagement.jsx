import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { useToast } from '../../contexts/ToastContext';
import CyberModal from '../../components/CyberModal';

const WithdrawalManagement = () => {
    const { success: toastSuccess, error: toastError } = useToast();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState({ id: null, status: null, inputValue: '' });

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const res = await axiosClient.get('/wallets/withdraw/list');
            setRequests(res.data || []);
        } catch (error) {
            console.error("Failed to fetch withdrawal requests", error);
            toastError("Không thể tải danh sách yêu cầu rút tiền");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleProcessClick = (id, status) => {
        setModalData({ id, status, inputValue: '' });
        setIsModalOpen(true);
    };

    const confirmProcess = async () => {
        const { id, status, inputValue } = modalData;
        setIsModalOpen(false);
        setProcessingId(id);
        
        try {
            await axiosClient.patch(`/wallets/withdraw/${id}/process`, {
                status,
                admin_note: inputValue
            });
            toastSuccess(`Đã ${status === 'APPROVED' ? 'chấp nhận' : 'từ chối'} yêu cầu`);
            fetchRequests();
        } catch (error) {
            console.error("Processing failed", error);
            toastError(error?.response?.data?.message || "Có lỗi xảy ra khi xử lý yêu cầu");
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="w-full min-h-screen bg-transparent text-slate-300 relative font-sans p-6 sm:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center gap-4">
                    <div className="h-12 w-12 flex items-center justify-center bg-rose-900/40 border border-rose-500/30 rounded-xl shadow-[0_0_15px_rgba(225,29,72,0.2)]">
                        <svg className="w-6 h-6 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-white uppercase tracking-widest font-mono text-shadow-glow-rose">QUẢN LÝ RÚT TIỀN</h1>
                        <p className="mt-1 text-[10px] text-rose-500/70 font-mono tracking-widest uppercase">Phê duyệt hoặc từ chối các yêu cầu rút CRED</p>
                    </div>
                </div>

                {/* Main Table Container */}
                <div className="rounded-2xl border border-slate-800 bg-[#090e17]/80 backdrop-blur-md shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rose-500/50 to-transparent" />
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left font-mono">
                            <thead>
                                <tr className="bg-[#02040a]/80 border-b border-slate-800">
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">NGƯỜI YÊU CẦU</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">SỐ TIỀN</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">THÔNG TIN TÀI KHOẢN</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">TRẠNG THÁI</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">HÀNH ĐỘNG</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-slate-500 animate-pulse uppercase tracking-widest text-xs">Đang tải dữ liệu...</td>
                                    </tr>
                                ) : requests.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-slate-600 uppercase tracking-widest text-xs">Không có yêu cầu rút tiền nào</td>
                                    </tr>
                                ) : (
                                    requests.map((req) => (
                                        <tr key={req.id} className="hover:bg-slate-800/20 transition-colors group">
                                            <td className="px-6 py-5">
                                                <div className="text-sm font-bold text-white uppercase">{req.user_email}</div>
                                                <div className="text-[10px] text-slate-500 mt-1">{new Date(req.created_at).toLocaleString()}</div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="text-lg font-black text-rose-400 tracking-tighter">{req.amount.toLocaleString()} CRED</div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="bg-[#02040a] rounded border border-slate-800 p-3 space-y-1">
                                                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                                                        <span className="text-rose-500/70 mr-1">BANK:</span> {req.bank_info?.bank_name}
                                                    </div>
                                                    <div className="text-[10px] text-white font-black">
                                                        <span className="text-rose-500/70 mr-1 font-normal">ACC:</span> {req.bank_info?.account_number}
                                                    </div>
                                                    <div className="text-[10px] text-slate-300 uppercase">
                                                        <span className="text-rose-500/70 mr-1">NAME:</span> {req.bank_info?.account_name}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`inline-flex px-2 py-1 rounded text-[9px] font-black tracking-widest uppercase border ${
                                                    req.status === 'PENDING' ? 'bg-amber-900/20 text-amber-400 border-amber-500/30' :
                                                    req.status === 'APPROVED' ? 'bg-emerald-900/20 text-emerald-400 border-emerald-500/30' :
                                                    'bg-rose-900/20 text-rose-400 border-rose-500/30'
                                                }`}>
                                                    [{req.status}]
                                                </span>
                                                {req.admin_note && (
                                                    <div className="text-[9px] text-slate-500 mt-2 italic max-w-[200px] truncate" title={req.admin_note}>
                                                        Note: {req.admin_note}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-5">
                                                {req.status === 'PENDING' ? (
                                                    <div className="flex gap-2">
                                                        <button
                                                            disabled={processingId === req.id}
                                                            onClick={() => handleProcessClick(req.id, 'APPROVED')}
                                                            className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/50 text-emerald-400 text-[9px] font-black uppercase tracking-widest rounded transition-all active:scale-95 disabled:opacity-50"
                                                        >
                                                            CHẤP NHẬN
                                                        </button>
                                                        <button
                                                            disabled={processingId === req.id}
                                                            onClick={() => handleProcessClick(req.id, 'REJECTED')}
                                                            className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/50 text-rose-400 text-[9px] font-black uppercase tracking-widest rounded transition-all active:scale-95 disabled:opacity-50"
                                                        >
                                                            TỪ CHỐI
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-[9px] text-slate-600 uppercase italic">ĐÃ XỬ LÝ</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="mt-8 p-4 bg-rose-900/10 border border-rose-500/20 rounded-xl flex items-start gap-4">
                    <svg className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-[10px] text-slate-400 font-mono tracking-widest uppercase leading-relaxed">
                        <span className="text-rose-400 font-black">LƯU Ý:</span> QUẢN TRỊ VIÊN CẦN THỰC HIỆN CHUYỂN KHOẢN THỰC TẾ CHO NGƯỜI DÙNG QUA HỆ THỐNG NGÂN HÀNG HOẶC VÍ ĐIỆN TỬ TRƯỚC KHI NHẤN "CHẤP NHẬN". KHI NHẤN "TỪ CHỐI", HỆ THỐNG SẼ TỰ ĐỘNG HOÀN LẠI SỐ CRED VÀO VÍ CỦA NGƯỜI DÙNG.
                    </div>
                </div>
            </div>

            {/* CyberModal for confirmations */}
            <CyberModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmProcess}
                title={modalData.status === 'APPROVED' ? 'XÁC NHẬN CHUYỂN TIỀN' : 'XÁC NHẬN TỪ CHỐI'}
                message={modalData.status === 'APPROVED' ? 'Vui lòng xác nhận bạn đã chuyển khoản thành công trước khi duyệt. Nhập mã giao dịch hoặc ghi chú (nếu có):' : 'Vui lòng nhập lý do từ chối (điểm sẽ được hoàn lại cho user):'}
                type={modalData.status === 'APPROVED' ? 'success' : 'danger'}
                confirmText={modalData.status === 'APPROVED' ? 'CHẤP NHẬN YÊU CẦU' : 'TỪ CHỐI YÊU CẦU'}
                requiresInput={true}
                inputValue={modalData.inputValue}
                onInputChange={(val) => setModalData(prev => ({ ...prev, inputValue: val }))}
                inputPlaceholder="Nhập ghi chú..."
                processing={processingId !== null}
            />
        </div>
    );
};

export default WithdrawalManagement;
