import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { allBadges, Badge, BadgeName } from './badges'

// Initialize badges from allBadges, setting unlocked to false
const initialBadges = allBadges.reduce((acc, badge) => {
  acc[badge.title] = { ...badge, unlocked: false }
  return acc
}, {} as Record<BadgeName, Badge>)

// Set initial unlocks based on the provided gamification design
initialBadges['Streak Starter'].unlocked = true
initialBadges['First Flame'].unlocked = true

interface StatsState {
  xp: number
  streak: number
  lastLessonDate: string | null
  badges: Record<BadgeName, Badge>
  addXp: (amount: number) => void
  completeLesson: () => void
  unlockBadge: (name: BadgeName) => void
}

export const useStatsStore = create<StatsState>()(
  persist(
    (set, get) => ({
      xp: 145,
      streak: 4,
      lastLessonDate: null,
      badges: initialBadges,

      addXp: (amount) => {
        set((state) => ({ xp: state.xp + amount }))
        const { xp, badges } = get()
        if (xp >= 100 && !badges['First Flame'].unlocked) {
          get().unlockBadge('First Flame')
        }
      },

      completeLesson: () => {
        const today = new Date().toISOString().split('T')[0]
        const { lastLessonDate, streak } = get()

        let newStreak = streak;
        if (lastLessonDate !== today) {
            const yesterday = new Date()
            yesterday.setDate(yesterday.getDate() - 1)
            const yesterdayStr = yesterday.toISOString().split('T')[0]
            
            if (lastLessonDate === yesterdayStr) {
                newStreak = streak + 1;
            } else {
                newStreak = 1;
            }
        }
        
        set({ streak: newStreak, lastLessonDate: today })

        const { badges } = get()
        if (newStreak >= 3 && !badges['Streak Starter'].unlocked) {
            get().unlockBadge('Streak Starter')
        }
         if (newStreak >= 30 && !badges['Streak Legend'].unlocked) {
            get().unlockBadge('Streak Legend')
        }
      },

      unlockBadge: (name) => {
        set((state) => ({
          badges: {
            ...state.badges,
            [name]: { ...state.badges[name], unlocked: true },
          },
        }))
      },
    }),
    {
      name: 'harmony-quest-stats', 
      storage: createJSONStorage(() => localStorage),
    }
  )
)
