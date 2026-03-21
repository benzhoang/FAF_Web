import React from 'react';

const Loading = () => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4 bg-white px-8 py-6 rounded-2xl shadow-2xl">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-medium text-gray-700">
                    Đang đăng nhập, vui lòng chờ...
                </p>
            </div>
        </div>
    );
};

export default Loading;

