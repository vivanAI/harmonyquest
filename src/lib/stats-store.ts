import { create } from 'zustand'

interface StatsState {
  xp: number
  streak: number
  lastLessonDate: string | null
  completedLessons: string[] // Array of completed lesson slugs
  addXp: (amount: number) => void
  completeLesson: (lessonSlug?: string) => void
  resetStats: () => void
  getLessonProgress: (lessonSlug: string) => number
  loadUserProgress: (userId: number, token: string) => Promise<void>
  syncProgressToBackend: (userId: number, token: string) => Promise<void>
  completeLessonOnBackend: (lessonSlug: string, xpEarned: number, token: string) => Promise<any>
}

export const useStatsStore = create<StatsState>()((set, get) => ({
      xp: 0,
      streak: 0,
      lastLessonDate: null,
      completedLessons: [],

      addXp: (amount) => {
        set((state) => ({ xp: state.xp + amount }))
      },

      completeLesson: (lessonSlug) => {
        const today = new Date().toISOString().split('T')[0]
        const { lastLessonDate, streak, completedLessons } = get()

        // Add lesson to completed list if provided and not already completed
        let newCompletedLessons = completedLessons;
        if (lessonSlug && !completedLessons.includes(lessonSlug)) {
          newCompletedLessons = [...completedLessons, lessonSlug];
        }

        let newStreak = streak;
        if (lastLessonDate !== today) {
            if (lastLessonDate === null) {
                // First lesson ever
                newStreak = 1;
            } else {
                const yesterday = new Date()
                yesterday.setDate(yesterday.getDate() - 1)
                const yesterdayStr = yesterday.toISOString().split('T')[0]
                
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
        
        set({ 
          streak: newStreak, 
          lastLessonDate: today,
          completedLessons: newCompletedLessons
        })
      },

      resetStats: () => {
        set({ xp: 0, streak: 0, lastLessonDate: null, completedLessons: [] })
      },

      getLessonProgress: (lessonSlug) => {
        const { completedLessons } = get()
        return completedLessons.includes(lessonSlug) ? 100 : 0
      },

      loadUserProgress: async (userId: number, token: string) => {
        try {
          // First reset stats to clear any previous user's data
          set({
            xp: 0,
            streak: 0,
            completedLessons: [],
            lastLessonDate: null,
          })

          console.log('Loading user progress for user ID:', userId)
          
          // Load user data from backend
          const userResponse = await fetch(`http://localhost:8000/users/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          })

          if (userResponse.ok) {
            const userData = await userResponse.json()
            console.log('Backend user data:', userData)
            
            // Load completed lessons from backend
            const lessonsResponse = await fetch(`http://localhost:8000/users/me/lessons`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            })

            let completedLessons: string[] = []
            if (lessonsResponse.ok) {
              const lessonsData = await lessonsResponse.json()
              console.log('Backend lessons data:', lessonsData)
              completedLessons = lessonsData
                .filter((lesson: any) => lesson.completed)
                .map((lesson: any) => lesson.slug)
            }

            // Update store with backend data
            const newState = {
              xp: userData.xp || 0,
              streak: userData.streak_count || 0,
              completedLessons,
              lastLessonDate: null, // We'll need to track this in backend later
            }
            console.log('Setting new stats state:', newState)
            set(newState)
          } else {
            console.error('Failed to fetch user data:', await userResponse.text())
          }
        } catch (error) {
          console.error('Failed to load user progress:', error)
        }
      },

      syncProgressToBackend: async (userId: number, token: string) => {
        try {
          const { xp, streak } = get()
          
          // Update user XP and streak on backend
          const response = await fetch(`http://localhost:8000/users/me`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              xp,
              streak_count: streak,
            }),
          })

          if (response.ok) {
            console.log('Successfully synced progress to backend')
          } else {
            console.error('Failed to sync progress to backend:', await response.text())
          }
        } catch (error) {
          console.error('Failed to sync progress to backend:', error)
        }
      },

      completeLessonOnBackend: async (lessonSlug: string, xpEarned: number, token: string) => {
        try {
          const response = await fetch(`http://localhost:8000/users/me/lessons/complete`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              lesson_slug: lessonSlug,
              xp_earned: xpEarned,
            }),
          })

          if (response.ok) {
            const result = await response.json()
            console.log('Successfully completed lesson on backend:', result)
            return result
          } else {
            console.error('Failed to complete lesson on backend:', await response.text())
            return null
          }
        } catch (error) {
          console.error('Failed to complete lesson on backend:', error)
          return null
        }
      },
}))
