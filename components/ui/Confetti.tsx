import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const Confetti: React.FC = () => {
  const [pieces, setPieces] = useState<number[]>([]);

  useEffect(() => {
    // Generate 50 confetti pieces
    setPieces(Array.from({ length: 50 }, (_, i) => i));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((i) => (
        <ConfettiPiece key={i} />
      ))}
    </div>
  );
};

const ConfettiPiece: React.FC = () => {
  // Random starting properties
  const randomX = Math.random() * 100; // vw
  const randomDelay = Math.random() * 0.5;
  const randomDuration = 2 + Math.random() * 2;
  const randomColor = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'][Math.floor(Math.random() * 5)];
  
  return (
    <motion.div
      initial={{ y: -20, x: `${randomX}vw`, rotate: 0, opacity: 1 }}
      animate={{ 
        y: '100vh', 
        rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
        x: `${randomX + (Math.random() * 10 - 5)}vw` 
      }}
      transition={{ 
        duration: randomDuration, 
        delay: randomDelay, 
        ease: "linear",
        repeat: 0 
      }}
      style={{
        position: 'absolute',
        width: '10px',
        height: '10px',
        backgroundColor: randomColor,
        borderRadius: Math.random() > 0.5 ? '50%' : '0%',
      }}
    />
  );
};