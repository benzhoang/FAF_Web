import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { walletApi } from '../../api/wallet.api'
import { useToast } from '../../contexts/ToastContext'

const Depositpoint = () => {
    const { success, error } = useToast()
    const navigate = useNavigate()
    const location = useLocation()
    const initialPoints = location.state?.points || 100

    const [points, setPoints] = useState(initialPoints)
    const [vndAmount, setVndAmount] = useState(initialPoints * 1000)
    const [paymentMethod, setPaymentMethod] = useState('zalopay')
    const [processingFee, setProcessingFee] = useState(0)
    const [loading, setLoading] = useState(false)

    const exchangeRate = 1000 // 1 Point = 1,000 VND

    useEffect(() => {
        setVndAmount(points * exchangeRate)
    }, [points])

    const handlePointsChange = (e) => {
        const value = parseInt(e.target.value) || 0
        setPoints(value)
    }

    const handleVndChange = (e) => {
        const value = parseInt(e.target.value) || 0
        setVndAmount(value)
        setPoints(Math.floor(value / exchangeRate))
    }

    const subtotal = points * exchangeRate
    const totalDue = subtotal + processingFee

    const handlePayment = async () => {
        if (points < 1) {
            toast.error("Vui lòng nạp tối thiểu 1 CRED")
            return
        }

        setLoading(true)
        try {
            let res;
            if (paymentMethod === 'zalopay') {
                res = await walletApi.depositZaloPay(points);
                if (res.order_url) {
                    window.location.href = res.order_url;
                } else {
                    error("Không nhận được link thanh toán ZaloPay");
                }
            } else if (paymentMethod === 'momo') {
                res = await walletApi.depositMoMo(points);
                if (res.payUrl) {
                    success('Redirecting to payment gateway...')
                    window.location.href = res.payUrl
                } else {
                    error('Could not create payment order')
                }
            } else {
                error("Phương thức thanh toán này chưa được hỗ trợ");
            }
        } catch (err) {
            console.error("Payment error:", err);
            error(err.response?.data?.message || "Lỗi khi khởi tạo thanh toán");
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full min-h-screen bg-transparent text-slate-300 relative flex flex-col font-sans">

            <div className="mx-auto max-w-4xl px-4 py-12 relative z-10">
                {/* Header */}
                <div className="mb-8 pl-2">
                    <button
                        onClick={() => navigate('/wallet')}
                        className="inline-flex items-center gap-2 text-[10px] font-black font-mono text-cyan-500 hover:text-cyan-400 uppercase tracking-widest mb-6 transition-colors group"
                    >
                        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        HỦY BỎ VÀ QUAY LẠI VÍ
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-900/50 to-blue-900/50 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                            <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-white uppercase tracking-wider">NẠP TIỀN VÀO TÀI KHOẢN</h1>
                            <p className="text-[11px] font-mono text-cyan-500/70 uppercase tracking-widest mt-1">Quy đổi tiền tệ an toàn sang FAF_CREDITS</p>
                        </div>
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="rounded-2xl border p-8 bg-[#090e17]/80 backdrop-blur-md relative overflow-hidden shadow-2xl" style={{ borderColor: 'rgba(6,182,212,0.2)' }}>
                    {/* Cyber accents */}
                    <div className="absolute top-0 right-10 w-32 h-px bg-cyan-400/50" />
                    <div className="absolute top-0 right-10 w-px h-8 bg-cyan-400/50" />
                    <div className="absolute bottom-0 left-10 w-32 h-px bg-cyan-400/50" />
                    <div className="absolute bottom-0 left-10 w-px h-8 bg-cyan-400/50" />

                    <div className="space-y-8">
                        {/* Amount Section */}
                        <div className="bg-[#02040a] rounded-xl border border-slate-800 p-6 relative">
                            <div className="absolute -left-px top-6 bottom-6 w-0.5 bg-cyan-500" />
                            <label className="block text-[10px] font-black text-cyan-500 uppercase tracking-widest font-mono mb-4">SỐ LƯỢNG QUY ĐỔI</label>
                            <div className="flex flex-col md:flex-row items-center gap-4">
                                <div className="flex-1 w-full relative group">
                                    <input
                                        type="number"
                                        value={points}
                                        onChange={handlePointsChange}
                                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 pl-16 text-lg font-black font-mono text-cyan-300 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 transition-all text-right"
                                    />
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-cyan-500 font-mono tracking-widest bg-cyan-900/30 px-2 py-1 rounded">CRED</span>
                                </div>
                                
                                <div className="text-cyan-500/50 shrink-0 rotate-90 md:rotate-0">
                                    <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                    </svg>
                                </div>
                                
                                <div className="flex-1 w-full relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-emerald-500 font-mono tracking-widest bg-emerald-900/30 px-2 py-1 rounded">VND</span>
                                    <input
                                        type="number"
                                        value={vndAmount}
                                        onChange={handleVndChange}
                                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 pl-[4.5rem] text-lg font-black font-mono text-emerald-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all text-right"
                                    />
                                </div>
                            </div>
                            <p className="mt-3 text-[10px] font-mono font-black text-slate-500 tracking-widest uppercase">
                                TỈ LỆ: 1 CRED = {exchangeRate.toLocaleString()} VND
                            </p>
                        </div>

                        {/* Payment Method Section */}
                        <div>
                            <label className="block text-[10px] font-black text-cyan-500 uppercase tracking-widest font-mono mb-4">PHƯƠNG THỨC THANH TOÁN</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* ZaloPay Option */}
                                <button
                                    onClick={() => setPaymentMethod('zalopay')}
                                    className={`relative rounded-xl border p-4 text-left transition-all ${paymentMethod === 'zalopay'
                                        ? 'border-cyan-500 bg-cyan-900/10 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                                        : 'border-slate-800 bg-[#02040a] hover:border-slate-700'
                                        }`}
                                >
                                    {paymentMethod === 'zalopay' && (
                                        <div className="absolute top-3 right-3">
                                            <div className="h-4 w-4 rounded-full bg-cyan-500 flex items-center justify-center">
                                                <svg className="w-2.5 h-2.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-4">
                                        <div className={`h-10 w-10 rounded border flex items-center justify-center transition-colors ${paymentMethod === 'zalopay' ? 'bg-cyan-500/10 border-cyan-500/50' : 'bg-slate-900 border-slate-700'}`}>
                                            <img src="https://images.careerbuilder.vn/employer_folders/lot1/231161/410x410/121016zalopay-logo-ngan.png" alt="ZaloPay" className="w-8 h-8 rounded" />
                                        </div>
                                        <div>
                                            <div className="text-[11px] font-black tracking-widest uppercase font-mono text-slate-200">
                                                ZALOPAY
                                            </div>
                                            <div className="text-[9px] font-mono text-slate-500 mt-1 uppercase tracking-widest">THANH TOÁN QR / VÍ</div>
                                        </div>
                                    </div>
                                </button>

                                {/* MoMo Option */}
                                <button
                                    onClick={() => setPaymentMethod('momo')}
                                    className={`relative rounded-xl border p-4 text-left transition-all ${paymentMethod === 'momo'
                                        ? 'border-cyan-500 bg-cyan-900/10 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                                        : 'border-slate-800 bg-[#02040a] hover:border-slate-700'
                                        }`}
                                >
                                    {paymentMethod === 'momo' && (
                                        <div className="absolute top-3 right-3">
                                            <div className="h-4 w-4 rounded-full bg-cyan-500 flex items-center justify-center">
                                                <svg className="w-2.5 h-2.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-4">
                                        <div className={`h-10 w-10 rounded border flex items-center justify-center transition-colors ${paymentMethod === 'momo' ? 'bg-pink-600/20 border-pink-500/50' : 'bg-slate-900 border-slate-700'}`}>
                                            <img src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" alt="MoMo" className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <div className="text-[11px] font-black tracking-widest uppercase font-mono text-slate-200">
                                                VÍ MOMO
                                            </div>
                                            <div className="text-[9px] font-mono text-slate-500 mt-1 uppercase tracking-widest">QUÉT MÃ MOMO</div>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Order Summary Section */}
                        <div className="bg-[#02040a] rounded-xl border border-slate-800 p-6 space-y-4 font-mono">
                            <div className="flex items-center justify-between text-slate-400 text-[11px] uppercase tracking-widest">
                                <span>TẠM TÍNH ({points} CRED)</span>
                                <span className="text-white">{subtotal.toLocaleString()} VND</span>
                            </div>
                            <div className="flex items-center justify-between text-slate-400 text-[11px] uppercase tracking-widest">
                                <span>PHÍ GIAO DỊCH</span>
                                <span className="text-white">{processingFee.toLocaleString()} VND</span>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                                <div>
                                    <div className="text-[12px] font-black text-cyan-400 tracking-widest uppercase">TỔNG CỘNG</div>
                                </div>
                                <span className="text-2xl font-black text-white">{totalDue.toLocaleString()} VND</span>
                            </div>
                        </div>

                        {/* Pay Button */}
                        <button
                            onClick={handlePayment}
                            disabled={loading}
                            className={`w-full rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 py-4 text-[12px] font-black tracking-widest font-mono text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] border border-cyan-400/50 transition-all hover:scale-[1.02] flex items-center justify-center gap-3 uppercase ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            )}
                            {loading ? 'ĐANG KHỞI TẠO...' : `XÁC NHẬN THANH TOÁN [ ${totalDue.toLocaleString()} VND ]`}
                        </button>

                        {/* Security Message */}
                        <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <span>GIAO DỊCH BẢO MẬT QUA ZALOPAY / MOMO</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Depositpoint
