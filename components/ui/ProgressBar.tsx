import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  colorClass: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, colorClass }) => {
  // Clamp value between 0 and 100 for display
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden shadow-inner relative">
      <motion.div
        className={`h-full ${colorClass} shadow-md`}
        initial={{ width: 0 }}
        animate={{ width: `${clampedValue}%` }}
        transition={{ type: "spring", stiffness: 50, damping: 15 }}
      />
      {/* Glossy effect overlay */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-white opacity-20 pointer-events-none"></div>
    </div>
  );
};