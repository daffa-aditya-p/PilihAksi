import React from 'react';
import { Stats, STAT_CONFIG, StatType, LevelConfig } from '../types';
import { ProgressBar } from './ui/ProgressBar';
import { Leaf, DollarSign, Heart, BookOpen, Trophy, Radio, AlertOctagon, Flame } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardProps {
  stats: Stats;
  history: Stats[];
  xp: number;
  levelInfo: LevelConfig;
  nextLevel?: LevelConfig;
  latestNews?: string | null;
  streak: number;
}

const iconMap: Record<string, React.ReactNode> = {
  Leaf: <Leaf className="w-5 h-5 text-white" />,
  DollarSign: <DollarSign className="w-5 h-5 text-white" />,
  Heart: <Heart className="w-5 h-5 text-white" />,
  BookOpen: <BookOpen className="w-5 h-5 text-white" />,
};

export const Dashboard: React.FC<DashboardProps> = ({ stats, history, xp, levelInfo, nextLevel, latestNews, streak }) => {
  const statKeys = Object.keys(STAT_CONFIG) as StatType[];

  // Prepare data for Recharts
  const chartData = history.map((h, i) => ({
    name: `Thn ${i}`,
    ...h
  }));

  // Calculate XP Progress
  const currentLevelXp = levelInfo.xpThreshold;
  const nextLevelXp = nextLevel ? nextLevel.xpThreshold : currentLevelXp * 1.5;
  const xpProgress = Math.min(100, Math.max(0, ((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100));

  // Check for critical stats (< 20)
  const criticalStats = statKeys.filter(key => stats[key] < 20);
  const isCritical = criticalStats.length > 0;

  return (
    <div className="space-y-6 relative">
      {/* Critical Warning Overlay */}
      {isCritical && (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
            className="absolute -inset-4 border-4 border-red-500/50 rounded-2xl z-0 pointer-events-none"
        />
      )}

      {/* News Ticker */}
      <div className={`rounded-lg overflow-hidden py-2 px-3 flex items-center gap-3 shadow-md border transition-colors duration-500 ${isCritical ? 'bg-red-900 border-red-700' : 'bg-slate-900 border-slate-700'}`}>
        <div className={`flex items-center gap-1.5 font-bold text-xs uppercase shrink-0 animate-pulse ${isCritical ? 'text-white' : 'text-red-500'}`}>
            {isCritical ? <AlertOctagon className="w-3 h-3" /> : <Radio className="w-3 h-3" />}
            {isCritical ? 'DARURAT' : 'LIVE'}
        </div>
        <div className="w-[1px] h-4 bg-slate-700"></div>
        <div className="flex-1 overflow-hidden relative h-5">
             <motion.div 
                key={latestNews || "start"}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="absolute w-full text-xs font-medium text-slate-300 truncate"
             >
                {latestNews ? latestNews : "Menunggu keputusan pertama Walikota..."}
             </motion.div>
        </div>
      </div>

      {/* Level & XP Card */}
      <motion.div 
        layout
        className="glass-panel p-5 rounded-xl shadow-lg border-l-4 border-l-brand-500 relative overflow-hidden"
      >
        <div className="flex justify-between items-end mb-2 relative z-10">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Peringkat Saat Ini</span>
            <h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              {levelInfo.title}
            </h2>
          </div>
          <div className="text-right">
             <span className="text-sm font-bold text-brand-600">{xp} XP</span>
             {nextLevel && <span className="text-xs text-slate-400 block">Next: {nextLevel.title}</span>}
          </div>
        </div>
        
        {/* XP Bar */}
        <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden relative z-10">
           <motion.div 
             className="h-full bg-gradient-to-r from-brand-400 to-indigo-500"
             initial={{ width: 0 }}
             animate={{ width: `${xpProgress}%` }}
             transition={{ duration: 1 }}
           />
        </div>
        
        {/* Decorative background number */}
        <div className="absolute -right-4 -top-6 text-9xl font-black text-slate-100 select-none z-0 opacity-50">
          {levelInfo.level}
        </div>
      </motion.div>

       {/* Streak Counter - NEW! */}
       <AnimatePresence>
          {streak > 1 && (
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              className="absolute -top-4 -right-2 z-20 bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-full font-black shadow-lg border-2 border-white flex items-center gap-2 transform rotate-3"
            >
              <Flame className="w-5 h-5 animate-bounce" />
              <span>{streak}x STREAK!</span>
            </motion.div>
          )}
        </AnimatePresence>


      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {statKeys.map((key) => {
          const config = STAT_CONFIG[key];
          const isLow = stats[key] < 20;
          return (
            <motion.div
              key={key}
              layout
              animate={isLow ? { scale: [1, 1.05, 1], borderColor: ['rgba(255,255,255,0.5)', 'rgba(239,68,68,1)', 'rgba(255,255,255,0.5)'] } : {}}
              transition={isLow ? { duration: 1, repeat: Infinity } : {}}
              className={`glass-panel p-3 rounded-xl shadow-md border ${isLow ? 'bg-red-50' : 'border-white/50'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-1.5 rounded-lg ${config.color} shadow-md`}>
                  {iconMap[config.icon]}
                </div>
                <span className={`text-xl font-bold ${isLow ? 'text-red-600' : 'text-slate-700'}`}>
                  {stats[key]}
                </span>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{config.label}</p>
              <ProgressBar value={stats[key]} colorClass={isLow ? 'bg-red-500' : config.color} />
            </motion.div>
          );
        })}
      </div>

      {/* Analytics Chart */}
      <motion.div
        className="glass-panel p-5 rounded-xl shadow-lg border border-white/50 hidden md:block"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-sm font-bold text-slate-600 mb-4 flex items-center gap-2 uppercase tracking-wide">
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
          Elektabilitas & Kinerja
        </h3>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
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
                itemStyle={{ fontSize: '12px', fontWeight: 600, padding: 0 }}
                labelStyle={{ fontSize: '12px', color: '#94a3b8', marginBottom: '5px' }}
              />
              <Area type="monotone" dataKey="Lingkungan" stroke="#10b981" fillOpacity={1} fill="url(#colorEnv)" strokeWidth={2} />
              <Area type="monotone" dataKey="Ekonomi" stroke="#f59e0b" fillOpacity={1} fill="url(#colorEco)" strokeWidth={2} />
              <Area type="monotone" dataKey="Kebahagiaan" stroke="#f43f5e" fillOpacity={1} fill="url(#colorHap)" strokeWidth={2} />
              <Area type="monotone" dataKey="Pengetahuan" stroke="#6366f1" fill="none" strokeWidth={2} strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};