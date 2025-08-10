import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface User {
  id: number
  name: string
  email: string
  avatar?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  lastError: string | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  setUser: (user: User, token: string) => void
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      lastError: null,

      login: async (email: string, password: string) => {
        try {
          const response = await fetch('http://localhost:8000/users/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              email, 
              password,
              name: '', // Required by backend but not used for login
              avatar: null,
              light_dark_mode: 'light',
              privacy_settings: {}
            }),
          })

          if (response.ok) {
            const data = await response.json()
            set({
              user: data.user,
              token: data.access_token,
              isAuthenticated: true,
              lastError: null,
            })
            return true
          } else {
            const errorText = await response.text()
            console.error('Login failed:', response.status, errorText)
            
            // Parse and handle specific login errors
            try {
              const errorJson = JSON.parse(errorText)
              if (errorJson.detail === 'Invalid credentials') {
                set({ lastError: 'Invalid email or password. Please check your credentials and try again.' })
              } else {
                set({ lastError: errorJson.detail || 'Login failed. Please try again.' })
              }
            } catch (e) {
              // Handle non-JSON error responses
              if (response.status === 401) {
                set({ lastError: 'Invalid email or password. Please check your credentials and try again.' })
              } else if (response.status === 400) {
                set({ lastError: 'Invalid request. Please check your email format and try again.' })
              } else {
                set({ lastError: 'Login failed. Please try again.' })
              }
            }
            
            return false
          }
        } catch (error) {
          console.error('Login network error:', error)
          set({ lastError: 'Network error. Please check your connection and try again.' })
          return false
        }
      },

      register: async (name: string, email: string, password: string) => {
        try {
          const requestBody = { 
            name, 
            email, 
            password,
            avatar: null,
            light_dark_mode: 'light',
            privacy_settings: {}
          }
          
          console.log('Registration request:', requestBody)
          
          const response = await fetch('http://localhost:8000/users/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          })

          console.log('Registration response status:', response.status)
          
          if (response.ok) {
            const user = await response.json()
            console.log('Registration successful:', user)
            // After successful registration, automatically log in
            return await get().login(email, password)
          } else {
            const errorText = await response.text()
            console.error('Registration failed - Status:', response.status)
            console.error('Registration failed - Error:', errorText)
            
            // Try to parse error as JSON for more details
            try {
              const errorJson = JSON.parse(errorText)
              console.error('Registration failed - Parsed error:', errorJson)
              
              // Check for specific error messages
              if (errorJson.detail && errorJson.detail.includes('Email already registered')) {
                set({ lastError: 'This email is already registered. Please try logging in instead or use a different email.' })
                return false
              }
            } catch (e) {
              console.error('Registration failed - Raw error:', errorText)
              if (errorText.includes('Email already registered')) {
                set({ lastError: 'This email is already registered. Please try logging in instead or use a different email.' })
                return false
              }
            }
            
            set({ lastError: 'Registration failed. Please try again.' })
            return false
          }
        } catch (error) {
          console.error('Registration network error:', error)
          set({ lastError: 'Network error. Please check your connection and try again.' })
          return false
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })
      },

      setUser: (user: User, token: string) => {
        set({
          user,
          token,
          isAuthenticated: true,
          lastError: null,
        })
      },

      clearError: () => {
        set({ lastError: null })
      },
    }),
    {
      name: 'harmony-quest-auth',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
