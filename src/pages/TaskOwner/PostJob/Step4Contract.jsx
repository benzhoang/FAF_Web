import React from 'react';

const Step4Contract = ({
    selectedType,
    jobTitle,
    contractAccepted,
    setContractAccepted,
    onContinue,
    onBack
}) => {
    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Hợp đồng công việc
                </h1>
                <p className="text-sm text-gray-600">
                    Vui lòng đọc kỹ hợp đồng dưới đây và xác nhận đồng ý để tiếp tục.
                </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="text-sm font-semibold text-gray-900">
                        HỢP ĐỒNG CÔNG VIỆC NGẮN HẠN (SHORT-TERM JOB CONTRACT)
                    </div>
                    <div className="text-xs text-gray-500">
                        {selectedType === 'short-term' ? 'Short-term Protected' : 'Long-term Connection'}
                    </div>
                </div>

                {/* Contract paper */}
                <div className="bg-gray-50 p-6">
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                        <div className="max-h-[70vh] overflow-auto p-8 text-[13px] leading-6 text-gray-900">
                            <div className="text-center font-semibold mb-6">
                                HỢP ĐỒNG CÔNG VIỆC NGẮN HẠN (SHORT-TERM JOB CONTRACT)
                            </div>

                            <div className="mb-4 font-semibold">HỢP ĐỒNG CÔNG VIỆC NGẮN HẠN</div>
                            <div className="mb-4">Hợp đồng này được ký kết giữa:</div>

                            <div className="mb-4">
                                <div className="font-semibold">Bên A - Người giao việc (Client):</div>
                                <div>- Họ và tên: ..........................................................</div>
                                <div>- Email đăng ký trên hệ thống FAF: ....................................</div>
                                <div>- ID người dùng FAF: ..................................................</div>
                            </div>

                            <div className="mb-4">
                                <div className="font-semibold">Bên B - Người nhận việc (Worker):</div>
                                <div>- Họ và tên: ..........................................................</div>
                                <div>- Email đăng ký trên hệ thống FAF: ....................................</div>
                                <div>- ID người dùng FAF: ..................................................</div>
                            </div>

                            <div className="mb-4">
                                <div className="font-semibold">Hệ thống trung gian:</div>
                                <div>- Tên hệ thống: FAF Platform</div>
                                <div>- Vai trò: Trung gian quản lý công việc, điểm thưởng, đánh giá và xử lý tranh chấp.</div>
                            </div>

                            <div className="mb-4">
                                <div className="font-semibold">Điều 1. Nội dung công việc</div>
                                <div>
                                    Bên B đồng ý thực hiện công việc do Bên A đăng tải trên hệ thống FAF theo mô tả,
                                    thời hạn và số điểm thưởng đã được xác nhận.
                                </div>
                                <div className="mt-2">
                                    <span className="font-medium">Thông tin tham chiếu:</span> {jobTitle ? ` "${jobTitle}"` : ' (chưa nhập Job Title)'}
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="font-semibold">Điều 2. Thời hạn và điểm thưởng</div>
                                <div>- Thời hạn hoàn thành: Theo thông tin công việc trên hệ thống FAF.</div>
                                <div>- Điểm thưởng: Theo công việc đã được hệ thống xác nhận và khóa điểm.</div>
                            </div>

                            <div className="mb-4">
                                <div className="font-semibold">Điều 3. Quyền và nghĩa vụ các bên</div>
                                <div>- Bên A có quyền đánh giá kết quả công việc và xác nhận hoàn thành hoặc không hoàn thành.</div>
                                <div>- Bên B có nghĩa vụ hoàn thành công việc đúng hạn và đúng yêu cầu.</div>
                                <div>- FAF giữ vai trò trung gian giữ điểm, giải ngân, khóa điểm và xử lý tranh chấp.</div>
                            </div>

                            <div className="mb-4">
                                <div className="font-semibold">Điều 4. Vi phạm và xử lý</div>
                                <div>
                                    Vi phạm hợp đồng sẽ được xử lý theo quy định của hệ thống FAF, bao gồm trừ điểm uy tín,
                                    khóa tài khoản tạm thời hoặc hoàn tiền.
                                </div>
                            </div>

                            <div className="mb-8">
                                <div className="font-semibold">Điều 5. Hiệu lực hợp đồng</div>
                                <div>
                                    Hợp đồng có hiệu lực kể từ thời điểm cả hai bên xác nhận (ký) và công việc được gắn trên hệ thống FAF.
                                </div>
                            </div>

                            <div className="text-center font-semibold mb-4">ĐẠI DIỆN CÁC BÊN KÝ TÊN</div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
                                <div>
                                    <div className="font-semibold">Bên A - Người giao việc</div>
                                    <div className="text-gray-700">(Ký và ghi rõ họ tên)</div>
                                    <div className="mt-10 border-b border-gray-300"></div>
                                </div>
                                <div>
                                    <div className="font-semibold">Bên B - Người nhận việc</div>
                                    <div className="text-gray-700">(Ký và ghi rõ họ tên)</div>
                                    <div className="mt-10 border-b border-gray-300"></div>
                                </div>
                            </div>
                            <div className="text-right text-gray-700">
                                Ngày ...... tháng ...... năm ......
                            </div>
                        </div>
                    </div>
                </div>

                {/* Acceptance + actions */}
                <div className="px-6 py-5 border-t border-gray-100">
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={contractAccepted}
                            onChange={(e) => setContractAccepted(e.target.checked)}
                            className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">
                            Tôi đã đọc và đồng ý với các điều khoản trong hợp đồng này.
                        </span>
                    </label>

                    <div className="flex flex-col sm:flex-row gap-3 mt-5">
                        <button
                            onClick={onContinue}
                            disabled={!contractAccepted}
                            className={`sm:order-2 w-full sm:w-auto px-6 py-3 rounded-lg text-sm font-semibold shadow-md transition-colors ${contractAccepted
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            Continue
                        </button>
                        <button
                            onClick={onBack}
                            className="sm:order-1 w-full sm:w-auto px-6 py-3 rounded-lg text-sm font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            ← Quay lại Step 3
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step4Contract;
