import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { getBackendBase } from '@/lib/utils'

interface StatsState {
  xp: number
  streak: number
  lastLessonDate: string | null
  lessonProgress: Record<string, number> // lessonSlug -> progress percentage (0-100)
  _forceUpdate: number // Force re-render trigger
  
  addXp: (amount: number) => void
  updateLessonProgress: (lessonSlug: string, progress: number) => void
  resetStats: () => void
  getLessonProgress: (lessonSlug: string) => number
  loadUserProgress: (userId: number, token: string) => Promise<void>
  completeLessonOnBackend: (lessonSlug: string, xpEarned: number, token: string) => Promise<any>
  refreshUserStats: (userId: number, token: string) => Promise<void>
  forceUpdate: () => void
}

export const useStatsStore = create<StatsState>()(
  persist(
    (set, get) => ({
      xp: 0,
      streak: 0,
      lastLessonDate: null,
      lessonProgress: {},
      _forceUpdate: 0,

      addXp: (amount) => {
        console.log('Adding XP:', amount, 'Current XP before:', get().xp);
        set((state) => ({ 
          xp: state.xp + amount,
          _forceUpdate: state._forceUpdate + 1
        }))
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
          console.log('Syncing lesson completion to backend:', { lessonSlug, xpEarned, baseUrl: BASE });
          console.log('Token being sent:', token ? token.substring(0, 50) + '...' : 'NO TOKEN');
          
          const response = await fetch(`${BASE}/users/me/lessons/${lessonSlug}/complete`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ xpEarned }),
          })
          
          console.log('Backend response status:', response.status);
          
          if (response.ok) {
            const result = await response.json();
            console.log('Lesson completion synced to backend successfully:', result);
            return result;
          } else {
            const errorText = await response.text();
            console.error('Failed to sync lesson completion to backend:', response.status, errorText);
            return null;
          }
        } catch (error) {
          console.error('Error syncing lesson completion:', error);
          return null;
        }
      },

      refreshUserStats: async (userId: number, token: string) => {
        try {
          const BASE = getBackendBase()
          const response = await fetch(`${BASE}/users/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          })

          if (response.ok) {
            const userData = await response.json()
            console.log('Refreshed user data from backend:', userData)
            
            // Update only XP and streak from backend
            set((state) => ({
              ...state,
              xp: userData.xp || 0,
              streak: userData.streak_count || 0
            }))
          }
        } catch (error) {
          console.error('Failed to refresh user stats:', error);
        }
      },

      forceUpdate: () => {
        set((state) => ({ _forceUpdate: state._forceUpdate + 1 }));
      },
    }),
    {
      name: 'harmony-quest-stats',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
