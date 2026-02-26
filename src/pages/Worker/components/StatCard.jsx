import React from 'react';

const StatCard = ({ title, value, subtitle, icon, valueColor = 'text-gray-900', bgColor = 'bg-white', border = 'border-gray-100', progress }) => {
    return (
        <div className={`rounded-2xl p-5 shadow-sm border ${border} ${bgColor}`}>
            <div className="flex justify-between items-start mb-1">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">{title}</p>
                {icon && <span className="text-gray-400">{icon}</span>}
            </div>
            <h3 className={`text-2xl font-black ${valueColor}`}>
                {value}
            </h3>
            {subtitle && (
                <div className="mt-2 text-[10px] text-gray-500 font-semibold italic">
                    {subtitle}
                </div>
            )}
            {progress !== undefined && (
                <div className="mt-2 flex items-center gap-1">
                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                            className="bg-green-500 h-full rounded-full transition-all duration-500" 
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default StatCard;
