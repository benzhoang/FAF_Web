import React, { useRef, useState, useEffect } from 'react';

const TermsOfServiceModal = ({ isOpen, onClose, onReadComplete }) => {
    const scrollRef = useRef(null);
    const [hasReachedBottom, setHasReachedBottom] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setHasReachedBottom(false);
        }
    }, [isOpen]);

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
            // Use a small buffer (5px) to account for rounding errors
            if (scrollTop + clientHeight >= scrollHeight - 5) {
                setHasReachedBottom(true);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-2xl bg-slate-900/50 border border-purple-500/30 rounded-3xl p-1 shadow-[0_30px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl animate-in zoom-in-95 duration-300">
                <div className="bg-slate-950/80 rounded-[22px] p-6 sm:p-8 overflow-hidden relative">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
                    
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse shadow-[0_0_10px_#a855f7]"></div>
                            <h2 className="text-xs font-black font-mono tracking-[0.3em] text-white uppercase">
                                SYSTEM_PROTOCOL :: TERMS_AND_PRIVACY
                            </h2>
                        </div>
                        <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    {/* Content Area */}
                    <div 
                        ref={scrollRef}
                        onScroll={handleScroll}
                        className="max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar text-slate-300 font-mono text-xs leading-relaxed space-y-8"
                    >
                        <section>
                            <h3 className="text-purple-400 font-bold mb-4 flex items-center gap-2">
                                <span className="opacity-50">01_</span> ĐIỀU KHOẢN DỊCH VỤ
                            </h3>
                            <div className="space-y-4 opacity-80">
                                <p>Chào mừng bạn đến với FAF (Find and Fix). Bằng việc tạo tài khoản, bạn đồng ý với các điều khoản sau:</p>
                                <p>1. Dịch vụ của chúng tôi cung cấp nền tảng kết nối giữa người có nhu cầu thuê (Employer) và người thực hiện công việc (Worker).</p>
                                <p>2. Bạn chịu trách nhiệm hoàn toàn về tính chính xác của thông tin cung cấp và các hành động thực hiện trên tài khoản của mình.</p>
                                <p>3. Nghiêm cấm các hành vi gian lận, quấy rối hoặc vi phạm pháp luật trên nền tảng.</p>
                                <p>4. FAF có quyền tạm khóa hoặc xóa tài khoản nếu phát hiện vi phạm quy tắc cộng đồng.</p>
                            </div>
                        </section>

                        <section>
                            <h3 className="text-blue-400 font-bold mb-4 flex items-center gap-2">
                                <span className="opacity-50">02_</span> CHÍNH SÁCH BẢO MẬT
                            </h3>
                            <div className="space-y-4 opacity-80">
                                <p>Chúng tôi coi trọng quyền riêng tư của bạn:</p>
                                <p>1. Thông tin thu thập bao gồm: Tên, email, kỹ năng và lịch sử hoạt động để tối ưu hóa trải nghiệm người dùng.</p>
                                <p>2. Dữ liệu của bạn được mã hóa và bảo mật bằng công nghệ tiên tiến nhất.</p>
                                <p>3. Chúng tôi không chia sẻ thông tin cá nhân của bạn cho bên thứ ba ngoại trừ các trường hợp cần thiết để thực hiện thanh toán hoặc theo yêu cầu pháp lý.</p>
                                <p>4. Bạn có quyền yêu cầu trích xuất hoặc xóa dữ liệu cá nhân bất cứ lúc nào thông qua cài đặt tài khoản.</p>
                            </div>
                        </section>

                        <section>
                            <h3 className="text-emerald-400 font-bold mb-4 flex items-center gap-2">
                                <span className="opacity-50">03_</span> THỎA THUẬN NGƯỜI DÙNG
                            </h3>
                            <div className="space-y-4 opacity-80">
                                <p>Việc tiếp tục sử dụng dịch vụ đồng nghĩa với việc bạn xác nhận đã hiểu và cam kết tuân thủ mọi quy định được nêu trên.</p>
                                <p className="text-[10px] text-slate-500 italic mt-8 border-t border-white/5 pt-4">LAST_UPDATE :: 2026.03.23.1044</p>
                            </div>
                        </section>
                    </div>

                    {/* Footer / Action */}
                    <div className="mt-8 border-t border-white/10 pt-6 flex flex-col items-center gap-4">
                        {!hasReachedBottom ? (
                            <div className="flex items-center gap-2 text-[10px] text-purple-400 animate-pulse font-bold tracking-widest uppercase">
                                <svg className="w-3 h-3 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                                Vui lòng cuộn xuống hết để xác nhận
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-bold tracking-widest uppercase">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                Đã đọc xong
                            </div>
                        )}

                        <button
                            disabled={!hasReachedBottom}
                            onClick={() => {
                                onReadComplete();
                                onClose();
                            }}
                            className={`w-full py-4 rounded-xl font-mono font-bold uppercase tracking-[0.2em] transition-all relative overflow-hidden group/btn ${
                                hasReachedBottom 
                                ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:bg-purple-500' 
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5 opacity-50'
                            }`}
                        >
                            {hasReachedBottom && <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform"></div>}
                            <span className="relative z-10">Tôi đã hiểu và đồng ý</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsOfServiceModal;
