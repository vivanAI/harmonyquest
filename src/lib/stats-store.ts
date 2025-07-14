import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface StatsState {
  xp: number
  streak: number
  lastLessonDate: string | null
  addXp: (amount: number) => void
  completeLesson: () => void
}

export const useStatsStore = create<StatsState>()(
  persist(
    (set, get) => ({
      xp: 145,
      streak: 4,
      lastLessonDate: null,

      addXp: (amount) => {
        set((state) => ({ xp: state.xp + amount }))
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
      },
    }),
    {
      name: 'harmony-quest-stats', 
      storage: createJSONStorage(() => localStorage),
    }
  )
)
