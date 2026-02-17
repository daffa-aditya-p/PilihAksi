import React, { useState, useEffect } from 'react';
import { Stats, STAT_CONFIG, Achievement } from '../types';
import { ACHIEVEMENTS, LEVELS, getPsychologicalProfile } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw, Award, Star, Share2, Check, Cpu, Brain, AlertTriangle } from 'lucide-react';
import { ProgressBar } from './ui/ProgressBar';

interface ResultViewProps {
  stats: Stats;
  history: Stats[];
  xp: number;
  unlockedAchievements: string[];
  onRestart: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ stats, xp, unlockedAchievements, onRestart }) => {
  const [copied, setCopied] = useState(false);
  const [isScanning, setIsScanning] = useState(true);
  
  // 1. Get AI Profile
  const profile = getPsychologicalProfile(stats);

  // 2. Determine Final Level
  const finalLevel = LEVELS.slice().reverse().find(l => xp >= l.xpThreshold) || LEVELS[0];

  // 3. Get Unlocked Achievement Objects
  const myAchievements = ACHIEVEMENTS.filter(a => unlockedAchievements.includes(a.id));

  // Scanning effect timer
  useEffect(() => {
    const timer = setTimeout(() => setIsScanning(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  const handleShare = async () => {
      const text = `🧠 Laporan Psikologis AI PilihAksi\n\n👤 Tipe: ${profile.title}\n"${profile.subtitle}"\n\n🏆 Rank: ${finalLevel.title} (${xp} XP)\nCek kepribadian pemimpinmu di sini!`;
      try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
      } catch (err) {
          console.error("Failed to copy", err);
      }
  };

  if (isScanning) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 border-4 border-slate-200 border-t-brand-600 rounded-full mb-8"
            />
            <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                className="text-2xl font-mono font-bold text-slate-700 mb-2"
            >
                MENGANALISIS POLA NEURAL...
            </motion.h2>
            <div className="text-slate-400 font-mono text-sm max-w-md space-y-1">
                <p>Memproses {stats.Ekonomi * 124} titik data ekonomi...</p>
                <p>Mengevaluasi {stats.Kebahagiaan * 89} respon emosional warga...</p>
                <p>Menghitung koefisien moralitas...</p>
            </div>
        </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto w-full pb-10"
    >
      {/* HEADER: AI Profile Card - The "Oracle" Result */}
      <div className="glass-panel rounded-3xl p-1 overflow-hidden shadow-2xl mb-8 transform hover:scale-[1.01] transition-transform duration-500">
        <div className={`p-8 md:p-12 relative overflow-hidden rounded-[20px] bg-gradient-to-br ${profile.color} text-white`}>
            
            {/* Tech Pattern Overlay */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')]"></div>
            
            {/* AI Label */}
            <div className="flex justify-between items-start relative z-10 mb-6">
                <div className="flex items-center gap-2 bg-black/30 backdrop-blur px-3 py-1 rounded-full border border-white/20">
                    <Brain className="w-4 h-4 text-cyan-300" />
                    <span className="text-xs font-mono tracking-widest text-cyan-100">AI PSYCH-EVAL v4.0</span>
                </div>
                <div className="text-right">
                    <p className="text-xs font-mono opacity-70">MATCH ACCURACY</p>
                    <p className="text-xl font-bold font-mono text-cyan-300">99.8%</p>
                </div>
            </div>

            <div className="text-center relative z-10">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-block mb-4"
                >
                    <span className="text-sm md:text-base font-bold tracking-[0.3em] uppercase opacity-80 border-b border-white/30 pb-1">
                        Archetype Detected
                    </span>
                </motion.div>
                
                <h1 className="text-4xl md:text-6xl font-black mb-2 tracking-tight drop-shadow-lg">
                    {profile.title}
                </h1>
                <p className="text-xl md:text-2xl font-light italic opacity-90 mb-8 font-serif">
                    "{profile.subtitle}"
                </p>

                {/* Analysis Box */}
                <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 md:p-8 text-left border-l-4 border-cyan-400 shadow-inner">
                    <div className="flex items-start gap-4">
                        <Cpu className="w-8 h-8 text-cyan-300 shrink-0 mt-1" />
                        <div>
                            <p className="text-lg leading-relaxed mb-4 font-medium text-white/95">
                                {profile.analysis}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10">
                                <div>
                                    <span className="text-xs font-bold uppercase text-white/50 block mb-1">Kelemahan Fatal</span>
                                    <p className="text-red-200 font-bold flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4" /> {profile.weakness}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-xs font-bold uppercase text-white/50 block mb-1">Profil MBTI Serupa</span>
                                    <p className="text-cyan-200 font-mono font-bold tracking-wide">
                                        {profile.mbtiMatch || "UNKNOWN"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
          {/* LEFT: Stats Breakdown */}
          <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <ActivityIcon /> Data Kuantitatif
              </h3>
              <div className="glass-panel p-6 rounded-2xl shadow-lg border border-slate-200">
                <div className="space-y-6">
                    {(Object.keys(STAT_CONFIG) as Array<keyof Stats>).map((key) => (
                        <div key={key}>
                        <div className="flex justify-between mb-1">
                            <span className="font-bold text-slate-700">{STAT_CONFIG[key].label}</span>
                            <span className="font-bold text-slate-900">{stats[key]}%</span>
                        </div>
                        <ProgressBar value={stats[key]} colorClass={STAT_CONFIG[key].color} />
                        </div>
                    ))}
                </div>
              </div>
          </div>

          {/* RIGHT: Achievements - NOW A GRID */}
          <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <Award className="w-6 h-6 text-brand-600" /> Tembok Penghargaan ({myAchievements.length}/{ACHIEVEMENTS.length})
              </h3>
              <div className="glass-panel p-6 rounded-2xl shadow-lg min-h-[300px] border border-slate-200">
                {myAchievements.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {myAchievements.map(ach => (
                            <motion.div 
                                key={ach.id}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className={`flex flex-col items-center justify-center text-center p-3 rounded-xl border shadow-sm ${
                                  ach.rarity === 'legendary' ? 'bg-amber-50 border-amber-200' :
                                  ach.rarity === 'rare' ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-100'
                                }`}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 text-xl ${
                                   ach.rarity === 'legendary' ? 'bg-amber-100 text-amber-600' :
                                   ach.rarity === 'rare' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'
                                }`}>
                                   {ach.icon === 'DollarSign' ? '💰' : 
                                    ach.icon === 'Heart' ? '❤️' :
                                    ach.icon === 'Leaf' ? '🌿' : 
                                    ach.icon === 'BookOpen' ? '📚' : '🏆'}
                                </div>
                                <h4 className="font-bold text-slate-800 text-xs leading-tight mb-1">{ach.title}</h4>
                                <p className="text-[10px] text-slate-500 leading-tight">{ach.description}</p>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-slate-400 flex flex-col items-center">
                        <Award className="w-12 h-12 mb-2 opacity-20" />
                        <p>Tidak ada penghargaan khusus.</p>
                        <p className="text-xs">Gaya kepemimpinan Anda terlalu datar.</p>
                    </div>
                )}
              </div>
          </div>
      </div>

      <div className="mt-12 text-center flex flex-col md:flex-row justify-center gap-4">
        <button
          onClick={onRestart}
          className="flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-slate-800 transition-all hover:-translate-y-1"
        >
          <RefreshCcw className="w-5 h-5" />
          Simulasi Ulang
        </button>
        <button 
            onClick={handleShare}
            className="flex items-center justify-center gap-2 bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:bg-slate-50 transition-all hover:-translate-y-1 min-w-[200px]"
        >
            {copied ? <Check className="w-5 h-5 text-green-600" /> : <Share2 className="w-5 h-5" />}
            {copied ? "Tersalin!" : "Bagikan Profil"}
        </button>
      </div>
    </motion.div>
  );
};

const ActivityIcon = () => (
    <svg className="w-6 h-6 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);