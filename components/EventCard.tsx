import React from 'react';
import { GameEvent, Choice } from '../types';
import { motion } from 'framer-motion';
import { ArrowRight, Activity, Zap } from 'lucide-react';
import { playSound } from '../utils/sound';

interface EventCardProps {
  event: GameEvent;
  onChoice: (choice: Choice) => void;
  currentNumber: number;
  totalNumber: number;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onChoice, currentNumber, totalNumber }) => {
  return (
    <motion.div
      key={event.id}
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -50, scale: 0.95 }}
      transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
      className="glass-panel w-full max-w-2xl mx-auto rounded-2xl shadow-2xl overflow-hidden flex flex-col h-full md:min-h-[600px] border-t-4 border-t-slate-800"
    >
      {/* Header Image Area */}
      <div className="relative h-56 md:h-72 overflow-hidden bg-slate-900 group">
        <img
          src={`https://picsum.photos/seed/${event.imagePlaceholder}/800/500`}
          alt="Event Illustration"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent flex flex-col justify-end p-8">
          <div className="flex items-center gap-3 mb-3">
             <span className="inline-block px-3 py-1 bg-slate-800/80 backdrop-blur text-white text-[10px] font-bold rounded-full uppercase tracking-wider border border-slate-600">
              Agenda {currentNumber} / {totalNumber}
            </span>
             <span className={`inline-block px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider border ${
                 event.category === 'Ekonomi' ? 'bg-amber-500/20 text-amber-300 border-amber-500/50' :
                 event.category === 'Lingkungan' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' :
                 event.category === 'Sosial' ? 'bg-rose-500/20 text-rose-300 border-rose-500/50' :
                 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50'
             }`}>
              {event.category}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight shadow-black drop-shadow-lg">
            {event.title}
          </h2>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 md:p-8 flex-1 flex flex-col bg-white">
        <div className="flex-1">
            <div className="flex gap-4 items-start">
                <div className="w-1 bg-slate-200 h-full min-h-[4rem] rounded-full"></div>
                <p className="text-slate-600 text-lg md:text-xl leading-relaxed font-medium">
                "{event.description}"
                </p>
            </div>
        </div>

        {/* Choices */}
        <div className="space-y-4 mt-8">
          {event.choices.map((choice, idx) => (
            <motion.button
              key={idx}
              onMouseEnter={() => playSound('hover')}
              whileHover={{ scale: 1.01, y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onChoice(choice)}
              className="group w-full text-left p-5 rounded-xl border-2 border-slate-100 bg-slate-50 hover:border-brand-500 hover:bg-white transition-all duration-200 relative overflow-hidden"
            >
              <div className="flex items-center justify-between relative z-10">
                <div className='flex-1 pr-4'>
                    <span className="block font-bold text-slate-800 group-hover:text-brand-700 text-lg mb-1">
                    {choice.label}
                    </span>
                    {/* XP Preview */}
                    <div className="flex items-center gap-1 text-xs font-bold text-brand-600 opacity-60 group-hover:opacity-100 transition-opacity">
                        <Zap className="w-3 h-3 fill-brand-600" />
                        +{choice.xpReward || 100} XP
                    </div>
                </div>
                <div className="h-10 w-10 rounded-full bg-slate-200 group-hover:bg-brand-500 flex items-center justify-center transition-colors">
                     <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                </div>
              </div>
              
              {/* Impact Hints */}
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 pt-3 border-t border-slate-200 group-hover:border-slate-100 transition-colors opacity-70">
                {Object.entries(choice.impact).map(([key, val]) => (
                    <span key={key} className={`text-xs font-bold flex items-center gap-1 ${(val as number) > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                        <Activity className="w-3 h-3" />
                        {key.substring(0,3).toUpperCase()} {(val as number) > 0 ? '+' : ''}{val}
                    </span>
                ))}
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};