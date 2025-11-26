import React from 'react';
import { LottoBall } from './LottoBall';

interface NumberSelectorProps {
  excludedNumbers: number[];
  toggleNumber: (num: number) => void;
}

export const NumberSelector: React.FC<NumberSelectorProps> = ({ excludedNumbers, toggleNumber }) => {
  const numbers = Array.from({ length: 45 }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-7 gap-2 sm:gap-4 p-4 bg-white rounded-2xl shadow-inner border border-slate-100 max-w-lg mx-auto">
      {numbers.map((num) => {
        const isExcluded = excludedNumbers.includes(num);
        return (
          <div key={num} className="flex justify-center">
            <LottoBall 
              number={num} 
              size="sm"
              status={isExcluded ? 'excluded' : 'default'}
              onClick={() => toggleNumber(num)}
            />
          </div>
        );
      })}
    </div>
  );
};