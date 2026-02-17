import React, { useState, useEffect } from 'react';
import { GameState, Choice, Stats, StatType, GameEvent, Avatar } from './types';
import { INITIAL_STATS, GAME_EVENTS_POOL, TOTAL_EVENTS, LEVELS, ACHIEVEMENTS } from './constants';
import { Dashboard } from './components/Dashboard';
import { EventCard } from './components/EventCard';
import { ResultView } from './components/ResultView';
import { GuideModal } from './components/GuideModal';
import { AvatarSelection } from './components/AvatarSelection';
import { StatFeedback } from './components/ui/StatFeedback';
import { Confetti } from './components/ui/Confetti';
import { playSound } from './utils/sound'; // Sound integrated
import { motion, AnimatePresence } from 'framer-motion';
import { Info, RotateCcw, Award, Save, Trash2, Shuffle } from 'lucide-react';

const STORAGE_KEY = 'pilihaksi_save_v3';
const HIGHSCORE_KEY = 'pilihaksi_highscore_v1';

function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

interface ExtendedGameState extends GameState {
    gameEvents: GameEvent[];
}

const App: React.FC = () => {
  const [gameState, setGameState] = useState<ExtendedGameState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
             ...parsed,
             streak: parsed.streak || 0,
             maxStreak: parsed.maxStreak || 0,
             avatarId: parsed.avatarId || null,
        }
      } catch (e) {
        console.error("Failed to load save", e);
      }
    }
    const initialEvents = shuffleArray(GAME_EVENTS_POOL).slice(0, TOTAL_EVENTS);
    return {
      currentEventIndex: 0,
      stats: { ...INITIAL_STATS },
      history: [{ ...INITIAL_STATS }],
      status: 'intro',
      xp: 0,
      level: 1,
      streak: 0,
      maxStreak: 0,
      avatarId: null,
      unlockedAchievements: [],
      gameEvents: initialEvents
    };
  });

  const [highScore, setHighScore] = useState<number>(() => {
      return parseInt(localStorage.getItem(HIGHSCORE_KEY) || '0', 10);
  });

  const [showGuide, setShowGuide] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [latestNews, setLatestNews] = useState<string | null>(null);
  const [statChanges, setStatChanges] = useState<Partial<Record<StatType, number>>>({});
  const [showConfetti, setShowConfetti] = useState(false);
  const [newAchievement, setNewAchievement] = useState<{title: string, icon: string} | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  useEffect(() => {
    if (gameState.xp > highScore) {
        setHighScore(gameState.xp);
        localStorage.setItem(HIGHSCORE_KEY, gameState.xp.toString());
    }
  }, [gameState.xp, highScore]);

  useEffect(() => {
    if (gameState.status === 'intro' && gameState.currentEventIndex === 0) {
      const timer = setTimeout(() => setShowGuide(true), 800);
      return () => clearTimeout(timer);
    }
  }, [gameState.status, gameState.currentEventIndex]);

  const handleStartRequest = () => {
      playSound('click');
      if (gameState.avatarId) {
          setGameState(prev => ({ ...prev, status: 'playing' }));
          setShowGuide(false);
      } else {
          setGameState(prev => ({ ...prev, status: 'selecting_avatar' }));
          setShowGuide(false);
      }
  };

  const handleAvatarSelect = (avatar: Avatar) => {
    playSound('levelUp');
    const startingStats = { ...INITIAL_STATS };
    if (avatar.id === 'cool') startingStats.Kebahagiaan += 10;
    if (avatar.id === 'nerd') startingStats.Pengetahuan += 10;
    if (avatar.id === 'rich') startingStats.Ekonomi += 10;
    if (avatar.id === 'nature') startingStats.Lingkungan += 10;

    setGameState(prev => ({ 
        ...prev, 
        avatarId: avatar.id,
        stats: startingStats,
        history: [startingStats],
        status: 'playing' 
    }));
  };

  const handleRestart = () => {
    playSound('select');
    const newEvents = shuffleArray(GAME_EVENTS_POOL).slice(0, TOTAL_EVENTS);
    
    const newState: ExtendedGameState = {
      currentEventIndex: 0,
      stats: { ...INITIAL_STATS },
      history: [{ ...INITIAL_STATS }],
      status: 'selecting_avatar',
      xp: 0,
      level: 1,
      streak: 0,
      maxStreak: 0,
      avatarId: null,
      unlockedAchievements: [], 
      gameEvents: newEvents
    };
    setGameState(newState);
    setFeedback(null);
    setLatestNews(null);
    setStatChanges({});
  };

  const checkAchievements = (currentStats: Stats, currentUnlocked: string[], currentStreak: number) => {
    const newlyUnlocked: string[] = [];
    
    ACHIEVEMENTS.forEach(ach => {
      if (!currentUnlocked.includes(ach.id)) {
        if (ach.condition(currentStats, gameState.currentEventIndex, gameState.history, currentStreak)) {
            newlyUnlocked.push(ach.id);
            setNewAchievement({ title: ach.title, icon: ach.icon });
            setShowConfetti(true);
            playSound('levelUp'); // Achievement sound
            setTimeout(() => {
                setNewAchievement(null);
                setShowConfetti(false);
            }, 4000);
        }
      }
    });

    return newlyUnlocked;
  };

  const handleChoice = (choice: Choice) => {
    // 1. Calc Stats
    const newStats: Stats = { ...gameState.stats };
    const currentChanges: Partial<Record<StatType, number>> = {};
    let isStableTurn = true;

    (Object.keys(newStats) as Array<keyof Stats>).forEach((key) => {
      if (choice.impact[key]) {
        const change = choice.impact[key] || 0;
        newStats[key] = Math.max(0, Math.min(100, newStats[key] + change));
        currentChanges[key] = change;
      }
      if (newStats[key] < 30) isStableTurn = false;
    });

    // 2. Streak
    let newStreak = gameState.streak;
    if (isStableTurn) {
        newStreak += 1;
        playSound('success'); // Good move
    } else {
        newStreak = 0;
        playSound('error'); // Streak broken or bad situation
    }
    const streakBonusXP = newStreak * 10;

    setStatChanges(currentChanges);

    // 3. XP & Level
    const xpGain = (choice.xpReward || 100) + streakBonusXP;
    const newXp = gameState.xp + xpGain;
    const newLevelConfig = LEVELS.slice().reverse().find(l => newXp >= l.xpThreshold) || LEVELS[0];
    const newLevel = newLevelConfig.level;

    if (newLevel > gameState.level) {
        setTimeout(() => playSound('levelUp'), 500);
    }

    // 4. Achievements
    const unlockedNow = checkAchievements(newStats, gameState.unlockedAchievements, newStreak);

    // 5. Feedback
    if (choice.feedback) {
      setFeedback(choice.feedback);
      setLatestNews(choice.feedback);
    }

    // 6. Update
    setTimeout(() => {
        setFeedback(null);
        setStatChanges({}); 
        
        setGameState((prev) => {
          const nextIndex = prev.currentEventIndex + 1;
          const isFinished = nextIndex >= prev.gameEvents.length || nextIndex >= TOTAL_EVENTS;

          if (isFinished) playSound('levelUp');

          return {
            ...prev,
            stats: newStats,
            history: [...prev.history, newStats],
            currentEventIndex: nextIndex,
            status: isFinished ? 'finished' : 'playing',
            xp: newXp,
            level: newLevel,
            streak: newStreak,
            maxStreak: Math.max(prev.maxStreak, newStreak),
            unlockedAchievements: [...prev.unlockedAchievements, ...unlockedNow]
          };
        });
    }, 1500);
  };

  const currentLevelInfo = LEVELS.find(l => l.level === gameState.level) || LEVELS[0];
  const nextLevelInfo = LEVELS.find(l => l.level === gameState.level + 1);
  const isCritical = Object.values(gameState.stats).some((val) => (val as number) < 20);
  const currentEvent = gameState.gameEvents[gameState.currentEventIndex];

  return (
    <div className="min-h-screen text-slate-800 font-sans selection:bg-brand-200 selection:text-brand-900 pb-12 bg-slate-50 relative overflow-x-hidden">
      
      <StatFeedback changes={statChanges} />
      {showConfetti && <Confetti />}

      <div className={`fixed inset-0 pointer-events-none transition-opacity duration-1000 z-0 ${isCritical ? 'opacity-100' : 'opacity-0'}`}
           style={{ boxShadow: 'inset 0 0 100px rgba(255,0,0,0.2)', background: 'radial-gradient(circle, transparent 50%, rgba(200,0,0,0.1) 100%)' }}
      ></div>

      <AnimatePresence>
        {newAchievement && (
            <motion.div 
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                className="fixed top-24 right-4 z-50 bg-white p-4 rounded-xl shadow-2xl border-l-4 border-yellow-500 flex items-center gap-3"
            >
                <div className="p-2 bg-yellow-100 rounded-full text-yellow-600">
                    <Award className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Pencapaian Terbuka!</p>
                    <p className="font-bold text-slate-800">{newAchievement.title}</p>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-indigo-600 rounded-xl shadow-lg flex items-center justify-center text-white font-bold text-xl">P</div>
            <div>
                <h1 className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-brand-700 to-indigo-700 tracking-tight">
                PilihAksi
                </h1>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block -mt-1">Governor Simulator</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="hidden md:flex flex-col items-end mr-2">
                 <span className="text-[10px] uppercase font-bold text-slate-400">High Score</span>
                 <span className="text-sm font-bold text-brand-600">{highScore} XP</span>
             </div>
             {gameState.status !== 'intro' && gameState.status !== 'selecting_avatar' && (
                <button 
                  onClick={() => {
                      if(window.confirm("Hapus progress dan mulai dari awal? Skenario akan diacak ulang.")) handleRestart();
                  }}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Reset & Reshuffle"
                >
                  <Shuffle className="w-5 h-5" />
                </button>
             )}
            <button 
              onClick={() => { playSound('click'); setShowGuide(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold rounded-full transition-colors"
            >
              <Info className="w-4 h-4" />
              <span className="hidden sm:inline">Panduan</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-8 relative z-10">
        <AnimatePresence mode="wait">
          {gameState.status === 'intro' ? (
             <motion.div
                key="intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center min-h-[70vh] text-center relative"
             >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/city-fields.png')] opacity-5 pointer-events-none"></div>
                <div className="mb-6 p-4 bg-white/50 backdrop-blur rounded-2xl border border-slate-200 shadow-xl inline-block">
                    <span className="text-sm font-bold text-brand-600 tracking-widest uppercase">Edisi Lomba Nasional v3.0</span>
                </div>
                <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-6 tracking-tighter leading-none">
                  KOTA <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">MASA DEPAN</span>
                </h1>
                <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mb-12 leading-relaxed font-medium">
                  Uji moralitas Anda dalam 20 skenario acak. Sistem AI "The Oracle" akan menganalisis apakah Anda seorang tiran, santo, atau politisi korup.
                </p>
                
                {gameState.currentEventIndex > 0 ? (
                    <div className="flex flex-col gap-4">
                        <button
                        onMouseEnter={() => playSound('hover')}
                        onClick={handleStartRequest}
                        className="group relative px-12 py-6 bg-emerald-600 text-white text-xl font-bold rounded-2xl shadow-2xl hover:bg-emerald-700 hover:scale-105 transition-all duration-300 overflow-hidden"
                        >
                        <span className="relative z-10 flex items-center gap-2"><Save className="w-5 h-5"/> Lanjutkan (Hari ke-{gameState.currentEventIndex + 1})</span>
                        </button>
                        <button onClick={handleRestart} className="text-slate-500 hover:text-slate-800 text-sm font-semibold flex items-center justify-center gap-2">
                            <RotateCcw className="w-4 h-4" /> Mulai Simulasi Baru (Acak Ulang)
                        </button>
                    </div>
                ) : (
                    <button
                    onMouseEnter={() => playSound('hover')}
                    onClick={handleStartRequest}
                    className="group relative px-12 py-6 bg-slate-900 text-white text-xl font-bold rounded-2xl shadow-2xl hover:bg-brand-600 hover:scale-105 transition-all duration-300 overflow-hidden"
                    >
                    <span className="relative z-10">Mulai Menjabat</span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    </button>
                )}
             </motion.div>
          ) : gameState.status === 'selecting_avatar' ? (
             <AvatarSelection key="avatar" onSelect={handleAvatarSelect} />
          ) : gameState.status === 'finished' ? (
            <ResultView 
                key="result" 
                stats={gameState.stats} 
                xp={gameState.xp}
                history={gameState.history}
                unlockedAchievements={gameState.unlockedAchievements}
                onRestart={handleRestart} 
            />
          ) : (
            <div key="game" className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="w-full lg:w-1/3 lg:sticky lg:top-24 z-10">
                <Dashboard 
                    stats={gameState.stats} 
                    history={gameState.history} 
                    xp={gameState.xp}
                    levelInfo={currentLevelInfo}
                    nextLevel={nextLevelInfo}
                    latestNews={latestNews}
                    streak={gameState.streak}
                />
              </div>

              <div className="w-full lg:w-2/3 min-h-[600px] relative">
                 <AnimatePresence>
                    {feedback && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none p-6"
                        >
                            <div className="bg-slate-900/95 backdrop-blur-md text-white p-8 rounded-2xl shadow-2xl max-w-md text-center border border-slate-700">
                                <h3 className="text-xl font-bold mb-2 text-brand-400">Konsekuensi Keputusan</h3>
                                <p className="text-lg leading-relaxed">{feedback}</p>
                            </div>
                        </motion.div>
                    )}
                 </AnimatePresence>

                <AnimatePresence mode="wait">
                   {currentEvent && (
                       <EventCard 
                          event={currentEvent}
                          onChoice={handleChoice}
                          currentNumber={gameState.currentEventIndex + 1}
                          totalNumber={TOTAL_EVENTS}
                       />
                   )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </AnimatePresence>
      </main>

      <footer className="max-w-6xl mx-auto px-4 py-8 mt-12 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center text-slate-400 text-sm">
        <p className="font-semibold">© 2024 PilihAksi Simulator v3.0.</p>
        <p>Powered by Advanced Logic & Dynamic Scenarios.</p>
      </footer>

      <GuideModal isOpen={showGuide} onClose={() => {
          playSound('click');
          setShowGuide(false);
          if (gameState.status === 'intro' && gameState.currentEventIndex === 0) handleStartRequest();
      }} />
    </div>
  );
};

export default App;