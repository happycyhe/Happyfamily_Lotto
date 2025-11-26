import React from 'react';

interface LottoBallProps {
  number: number;
  size?: 'sm' | 'md' | 'lg';
  status?: 'default' | 'excluded' | 'dimmed';
  onClick?: () => void;
}

export const LottoBall: React.FC<LottoBallProps> = ({ 
  number, 
  size = 'md', 
  status = 'default',
  onClick 
}) => {
  const getColors = (num: number) => {
    if (status === 'excluded') return 'bg-gray-200 text-gray-400 border-gray-300 opacity-50 cursor-not-allowed';
    if (status === 'dimmed') return 'bg-slate-100 text-slate-300 border-slate-200';

    if (num <= 10) return 'bg-yellow-400 text-white border-yellow-500 shadow-yellow-200';
    if (num <= 20) return 'bg-blue-500 text-white border-blue-600 shadow-blue-200';
    if (num <= 30) return 'bg-red-500 text-white border-red-600 shadow-red-200';
    if (num <= 40) return 'bg-slate-500 text-white border-slate-600 shadow-slate-200';
    return 'bg-green-500 text-white border-green-600 shadow-green-200';
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs border-b-2',
    md: 'w-10 h-10 text-sm border-b-4',
    lg: 'w-14 h-14 text-lg font-bold border-b-4',
  };

  return (
    <div
      onClick={onClick}
      className={`
        ${sizeClasses[size]} 
        ${getColors(number)}
        rounded-full flex items-center justify-center font-bold
        transition-all duration-200 transform
        ${onClick ? 'cursor-pointer hover:scale-110 active:scale-95' : ''}
        ${status === 'excluded' ? 'scale-90 grayscale' : 'shadow-lg'}
      `}
    >
      {status === 'excluded' ? 'X' : number}
    </div>
  );
};