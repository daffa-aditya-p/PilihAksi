import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { StatType, STAT_CONFIG } from '../../types';

interface StatChange {
  id: string; // Unique ID for key
  key: string;
  value: number;
}

interface StatFeedbackProps {
  changes: Partial<Record<StatType, number>>;
}

export const StatFeedback: React.FC<StatFeedbackProps> = ({ changes }) => {
  const [items, setItems] = useState<StatChange[]>([]);

  useEffect(() => {
    const newItems: StatChange[] = [];
    Object.entries(changes).forEach(([key, value]) => {
      if (value !== 0) {
        newItems.push({
          id: Math.random().toString(36).substr(2, 9),
          key,
          value: value as number,
        });
      }
    });

    if (newItems.length > 0) {
      setItems((prev) => [...prev, ...newItems]);
    }
  }, [changes]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
      <AnimatePresence>
        {items.map((item) => (
          <FeedbackItem 
            key={item.id} 
            item={item} 
            onComplete={() => setItems(prev => prev.filter(i => i.id !== item.id))} 
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

const FeedbackItem: React.FC<{ item: StatChange; onComplete: () => void }> = ({ item, onComplete }) => {
  const config = STAT_CONFIG[item.key as StatType];
  const isPositive = item.value > 0;
  
  // Randomize start position slightly
  const randomX = Math.random() * 200 - 100;
  const randomY = Math.random() * 100 - 50;

  return (
    <motion.div
      initial={{ opacity: 0, y: randomY, x: randomX, scale: 0.5 }}
      animate={{ opacity: 1, y: randomY - 150, scale: 1.2 }}
      exit={{ opacity: 0, y: randomY - 200, scale: 0.8 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      onAnimationComplete={onComplete}
      className={`absolute font-black text-2xl md:text-4xl drop-shadow-md flex items-center gap-2 ${
        isPositive ? 'text-white' : 'text-white'
      }`}
      style={{
        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
        WebkitTextStroke: '1px rgba(0,0,0,0.1)'
      }}
    >
      <div className={`px-4 py-2 rounded-full border-2 border-white/50 backdrop-blur-sm shadow-xl flex items-center gap-2 ${config.color}`}>
         <span>{isPositive ? '+' : ''}{item.value}</span>
         <span className="text-sm uppercase tracking-wider">{config.label}</span>
      </div>
    </motion.div>
  );
};