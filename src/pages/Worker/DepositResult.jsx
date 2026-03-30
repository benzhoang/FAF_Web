import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { walletApi } from '../../api/wallet.api';

const DepositResult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [status, setStatus] = useState('processing');
    const [message, setMessage] = useState('');
    const [credited, setCredited] = useState(false);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        
        // ZaloPay params
        const appTransId = queryParams.get('apptransid');
        
        // MoMo params
        const orderId = queryParams.get('orderId');
        const resultCode = queryParams.get('resultCode');

        console.log('Payment Redirect Params:', Object.fromEntries(queryParams.entries()));
        
        const verifyPayment = async (id, method) => {
            try {
                const res = await walletApi.checkStatus(id, method);
                if (res.status === 'done' || res.data?.status === 'done') {
                    setStatus('success');
                    setMessage('Giao dịch nạp điểm thành công! Số dư của bạn đã được cập nhật.');
                } else {
                    setStatus('error');
                    setMessage('Giao dịch chưa được ghi nhận thành công trên hệ thống.');
                }
            } catch (err) {
                console.error('Verify payment error:', err);
                setStatus('error');
                setMessage('Không thể xác thực giao dịch. Vui lòng liên hệ hỗ trợ.');
            }
        };

        if (appTransId) {
            verifyPayment(appTransId, 'zalopay');
        } else if (orderId) {
            if (resultCode === '0') {
                verifyPayment(orderId, 'momo');
            } else {
                setStatus('error');
                setMessage('Giao dịch MoMo bị từ chối hoặc đã hủy.');
            }
        } else {
            setStatus('error');
            setMessage('Thông tin thanh toán không hợp lệ.');
        }
    }, [location]);

    return (
        <div className="w-full min-h-[80vh] bg-transparent text-slate-300 relative font-sans flex items-center justify-center p-4">
            <div className="rounded-2xl border p-8 bg-[#090e17]/80 backdrop-blur-md relative overflow-hidden max-w-md w-full text-center" style={{ borderColor: status === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(225,29,72,0.3)' }}>
                {status === 'success' ? (
                     <div className="mb-6 mx-auto h-20 w-20 flex items-center justify-center bg-emerald-900/40 border border-emerald-500/50 rounded-full shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                         <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                         </svg>
                     </div>
                ) : (
                     <div className="mb-6 mx-auto h-20 w-20 flex items-center justify-center bg-rose-900/40 border border-rose-500/50 rounded-full shadow-[0_0_30px_rgba(225,29,72,0.2)]">
                         <svg className="w-10 h-10 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                         </svg>
                     </div>
                )}
                
                <h1 className={`text-2xl font-black uppercase tracking-widest font-mono mb-2 ${status === 'success' ? 'text-emerald-400 text-shadow-glow-emerald' : 'text-rose-400 text-shadow-glow-rose'}`}>
                    {status === 'success' ? 'NẠP TIỀN THÀNH CÔNG' : 'GIAO DỊCH THẤT BẠI'}
                </h1>
                
                <p className="text-sm text-slate-400 font-mono tracking-wide mb-8">
                    {message}
                </p>
                
                <button
                     onClick={() => navigate('/wallet')}
                     className="w-full px-6 py-4 bg-[#02040a] hover:bg-slate-800 border border-slate-700 text-white text-[11px] font-black font-mono tracking-widest uppercase rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                     QUAY LẠI VÍ
                </button>
            </div>
        </div>
    );
};

export default DepositResult;
