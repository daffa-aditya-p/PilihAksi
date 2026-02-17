import React, { useState, useEffect } from 'react';
import { Stats, STAT_CONFIG, Achievement } from '../types';
import { ACHIEVEMENTS, LEVELS, getPsychologicalProfile } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw, Award, Star, Share2, Check, Cpu, Brain, AlertTriangle } from 'lucide-react';
import { ProgressBar } from './ui/ProgressBar';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Area, AreaChart, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface ResultViewProps {
  stats: Stats;
  history: Stats[];
  xp: number;
  unlockedAchievements: string[];
  onRestart: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ stats, history, xp, unlockedAchievements, onRestart }) => {
  const [copied, setCopied] = useState(false);
  const [isScanning, setIsScanning] = useState(true);
  
  // 1. Get AI Profile
  const profile = getPsychologicalProfile(stats);

  // 2. Determine Final Level
  const finalLevel = LEVELS.slice().reverse().find(l => xp >= l.xpThreshold) || LEVELS[0];

  // 3. Get Unlocked Achievement Objects
  const myAchievements = ACHIEVEMENTS.filter(a => unlockedAchievements.includes(a.id));

  // 4. Data for Radar Chart
  const radarData = [
    { subject: 'Lingkungan', A: stats.Lingkungan, fullMark: 100 },
    { subject: 'Ekonomi', A: stats.Ekonomi, fullMark: 100 },
    { subject: 'Pengetahuan', A: stats.Pengetahuan, fullMark: 100 },
    { subject: 'Kebahagiaan', A: stats.Kebahagiaan, fullMark: 100 },
  ];

  // 5. Data for Line Chart (History)
  const historyData = history.map((h, i) => ({
    name: `Thn ${i}`,
    ...h
  }));

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
                <p>Mengkalibrasi 16 Arketipe Psikologis...</p>
            </div>
        </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto w-full pb-10"
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
                    <span className="text-xs font-mono tracking-widest text-cyan-100">AI NEURAL-NET v5.0</span>
                </div>
                <div className="text-right">
                    <p className="text-xs font-mono opacity-70">CONFIDENCE</p>
                    <p className="text-xl font-bold font-mono text-cyan-300">99.9%</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
                <div className="flex-1 text-center md:text-left">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-block mb-4"
                    >
                        <span className="text-sm md:text-base font-bold tracking-[0.3em] uppercase opacity-80 border-b border-white/30 pb-1">
                            Archetype ID
                        </span>
                    </motion.div>
                    
                    <h1 className="text-4xl md:text-6xl font-black mb-2 tracking-tight drop-shadow-lg leading-tight">
                        {profile.title}
                    </h1>
                    <p className="text-xl md:text-2xl font-light italic opacity-90 mb-6 font-serif">
                        "{profile.subtitle}"
                    </p>

                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        <div className="px-3 py-1 bg-white/20 rounded-lg text-sm font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-red-300" />
                            Weakness: {profile.weakness}
                        </div>
                        <div className="px-3 py-1 bg-white/20 rounded-lg text-sm font-bold flex items-center gap-1">
                             MBTI: {profile.mbtiMatch}
                        </div>
                    </div>
                </div>

                {/* RADAR CHART VISUALIZATION */}
                <div className="w-full md:w-1/3 h-64 bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                        <PolarGrid stroke="rgba(255,255,255,0.3)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: 'white', fontSize: 10, fontWeight: 'bold' }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar
                            name="Stats"
                            dataKey="A"
                            stroke="#22d3ee"
                            strokeWidth={3}
                            fill="#22d3ee"
                            fillOpacity={0.5}
                        />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Analysis Box */}
            <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 mt-8 text-left border-l-4 border-cyan-400 shadow-inner relative z-10">
                <div className="flex items-start gap-4">
                    <Cpu className="w-8 h-8 text-cyan-300 shrink-0 mt-1" />
                    <p className="text-lg leading-relaxed font-medium text-white/95">
                        {profile.analysis}
                    </p>
                </div>
            </div>
        </div>
      </div>

      {/* NEW: History Chart (Diagram Garis) */}
      <div className="mb-8 space-y-4">
         <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <ActivityIcon /> Riwayat Kepemimpinan
         </h3>
         <div className="glass-panel p-6 rounded-2xl shadow-lg border border-slate-200 h-80">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                    <linearGradient id="colorEnv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorEco" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorHap" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{fontSize: 10}} interval={2} stroke="#94a3b8" />
                    <YAxis domain={[0, 100]} tick={{fontSize: 10, fill: '#64748b'}} tickLine={false} axisLine={false} />
                    <Tooltip
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontFamily: 'sans-serif' }}
                    />
                    <Area type="monotone" dataKey="Lingkungan" stroke="#10b981" fillOpacity={1} fill="url(#colorEnv)" strokeWidth={2} />
                    <Area type="monotone" dataKey="Ekonomi" stroke="#f59e0b" fillOpacity={1} fill="url(#colorEco)" strokeWidth={2} />
                    <Area type="monotone" dataKey="Kebahagiaan" stroke="#f43f5e" fillOpacity={1} fill="url(#colorHap)" strokeWidth={2} />
                    <Area type="monotone" dataKey="Pengetahuan" stroke="#6366f1" fill="none" strokeWidth={2} strokeDasharray="5 5" />
                </AreaChart>
            </ResponsiveContainer>
         </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
          {/* LEFT: Stats Breakdown */}
          <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <Star className="w-6 h-6 text-brand-600" /> Skor Akhir
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

          {/* RIGHT: Achievements */}
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