import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { getBackendBase } from '@/lib/utils'

interface StatsState {
  xp: number
  streak: number
  lastLessonDate: string | null
  lessonProgress: Record<string, number> // lessonSlug -> progress percentage (0-100)
  
  addXp: (amount: number) => void
  updateLessonProgress: (lessonSlug: string, progress: number) => void
  resetStats: () => void
  getLessonProgress: (lessonSlug: string) => number
  loadUserProgress: (userId: number, token: string) => Promise<void>
  completeLessonOnBackend: (lessonSlug: string, xpEarned: number, token: string) => Promise<any>
}

export const useStatsStore = create<StatsState>()(
  persist(
    (set, get) => ({
      xp: 0,
      streak: 0,
      lastLessonDate: null,
      lessonProgress: {},

      addXp: (amount) => {
        console.log('Adding XP:', amount, 'Current XP before:', get().xp);
        set((state) => ({ xp: state.xp + amount }))
        console.log('XP after adding:', get().xp);
      },

      updateLessonProgress: (lessonSlug, progress) => {
        console.log('Updating lesson progress:', lessonSlug, 'to', progress);
        
        const today = new Date().toISOString().split('T')[0];
        const { lastLessonDate, streak } = get();
        
        // Handle streak logic
        let newStreak = streak;
        if (lastLessonDate !== today) {
          if (lastLessonDate === null) {
            // First lesson ever
            newStreak = 1;
          } else {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];
            
            if (lastLessonDate === yesterdayStr) {
              // Consecutive day
              newStreak = streak + 1;
            } else {
              // Streak broken, restart
              newStreak = 1;
            }
          }
        }
        // If lastLessonDate === today, don't change streak (already completed today)
        
        set((state) => ({
          lessonProgress: {
            ...state.lessonProgress,
            [lessonSlug]: Math.max(progress, state.lessonProgress[lessonSlug] || 0)
          },
          streak: newStreak,
          lastLessonDate: today
        }));
        
        console.log('New lesson progress:', get().lessonProgress);
        console.log('Streak updated:', newStreak, 'Last lesson date:', today);
      },

      resetStats: () => {
        set({ xp: 0, streak: 0, lastLessonDate: null, lessonProgress: {} })
      },

      getLessonProgress: (lessonSlug) => {
        return get().lessonProgress[lessonSlug] || 0
      },

      loadUserProgress: async (userId: number, token: string) => {
        try {
          // Reset stats to clear any previous user's data
          set({
            xp: 0,
            streak: 0,
            lessonProgress: {},
            lastLessonDate: null,
          })

          console.log('Loading user progress for user ID:', userId)

          const BASE = getBackendBase()
          // Load user data from backend
          const userResponse = await fetch(`${BASE}/users/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          })

          if (userResponse.ok) {
            const userData = await userResponse.json()
            console.log('Backend user data:', userData)
            
            // Load completed lessons from backend
            const lessonsResponse = await fetch(`${BASE}/users/me/lessons`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            })

            let lessonProgress: Record<string, number> = {}
            if (lessonsResponse.ok) {
              const lessonsData = await lessonsResponse.json()
              console.log('Backend lessons data:', lessonsData)
              
              // Convert backend data to progress format
              lessonsData.forEach((lesson: any) => {
                if (lesson.completed) {
                  lessonProgress[lesson.slug] = 100; // Fully completed
                } else if (lesson.progress) {
                  lessonProgress[lesson.slug] = lesson.progress; // Partial progress
                }
              });
            }

            // Update store with backend data
            const newState = {
              xp: userData.xp || 0,
              streak: userData.streak || 0,
              lastLessonDate: userData.lastLessonDate || null,
              lessonProgress: lessonProgress
            };
            
            console.log('Setting state from backend:', newState);
            set(newState);
          }
        } catch (error) {
          console.error('Failed to load user progress:', error);
        }
      },

      completeLessonOnBackend: async (lessonSlug: string, xpEarned: number, token: string) => {
        try {
          const BASE = getBackendBase()
          const response = await fetch(`${BASE}/users/me/lessons/${lessonSlug}/complete`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ xpEarned }),
          })
          
          if (response.ok) {
            console.log('Lesson completion synced to backend');
            return await response.json();
          } else {
            console.error('Failed to sync lesson completion to backend');
            return null;
          }
        } catch (error) {
          console.error('Error syncing lesson completion:', error);
          return null;
        }
      },
    }),
    {
      name: 'harmony-quest-stats',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
