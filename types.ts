export type StatType = 'Lingkungan' | 'Ekonomi' | 'Kebahagiaan' | 'Pengetahuan';

export interface Stats {
  Lingkungan: number;
  Ekonomi: number;
  Kebahagiaan: number;
  Pengetahuan: number;
}

export interface Choice {
  label: string;
  impact: Partial<Stats>;
  xpReward?: number; // XP gained from this choice
  feedback?: string;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  category: 'Infrastruktur' | 'Sosial' | 'Ekonomi' | 'Lingkungan' | 'Politik';
  imagePlaceholder?: string;
  choices: Choice[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // Icon name
  rarity: 'common' | 'rare' | 'legendary';
  condition: (stats: Stats, eventIndex: number, history: Stats[], streak: number) => boolean;
}

export interface LevelConfig {
  level: number;
  title: string;
  xpThreshold: number;
}

export interface Avatar {
  id: string;
  name: string;
  role: string;
  image: string; // Emoji or URL
  color: string;
  perk: string; // Description of bonus
}

export interface PsychologicalProfile {
  title: string;
  subtitle: string;
  analysis: string;
  mbtiMatch?: string; // Just for fun flavor
  weakness: string;
  color: string;
}

export interface GameState {
  currentEventIndex: number;
  stats: Stats;
  history: Stats[];
  status: 'intro' | 'selecting_avatar' | 'playing' | 'finished';
  xp: number;
  level: number;
  streak: number; // Current stability streak
  maxStreak: number;
  avatarId: string | null;
  unlockedAchievements: string[];
}

export const STAT_CONFIG: Record<StatType, { color: string; icon: string; label: string }> = {
  Lingkungan: { color: 'bg-emerald-500', icon: 'Leaf', label: 'Lingkungan' },
  Ekonomi: { color: 'bg-amber-500', icon: 'DollarSign', label: 'Ekonomi' },
  Kebahagiaan: { color: 'bg-rose-500', icon: 'Heart', label: 'Kebahagiaan' },
  Pengetahuan: { color: 'bg-indigo-500', icon: 'BookOpen', label: 'Pengetahuan' },
};