import React from 'react';
import { motion } from 'framer-motion';
import { Avatar } from '../types';
import { AVATARS } from '../constants';
import { playSound } from '../utils/sound';

interface AvatarSelectionProps {
  onSelect: (avatar: Avatar) => void;
}

export const AvatarSelection: React.FC<AvatarSelectionProps> = ({ onSelect }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h2 className="text-3xl font-black text-slate-800 mb-2">Pilih Karakter Anda</h2>
        <p className="text-slate-500">Gaya kepemimpinan Anda dimulai dari sini.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl w-full">
        {AVATARS.map((avatar, idx) => (
          <motion.button
            key={avatar.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            onMouseEnter={() => playSound('hover')}
            whileHover={{ scale: 1.05, y: -10 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(avatar)}
            className="bg-white rounded-3xl p-6 shadow-xl border-2 border-transparent hover:border-brand-500 transition-all text-center group relative overflow-hidden"
          >
            <div className={`w-24 h-24 mx-auto ${avatar.color} rounded-full flex items-center justify-center text-5xl mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
              {avatar.image}
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-1">{avatar.name}</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">{avatar.role}</p>
            
            <div className="bg-slate-50 rounded-xl p-3 text-sm text-slate-600 font-medium">
              ✨ {avatar.perk}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};