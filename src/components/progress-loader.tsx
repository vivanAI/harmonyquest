'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useStatsStore } from '@/lib/stats-store'

export function ProgressLoader() {
  const { data: session } = useSession()
  const { loadUserProgress } = useStatsStore()

  useEffect(() => {
    if (session?.backendToken && session?.backendUser?.id) {
      loadUserProgress(session.backendUser.id, session.backendToken)
    }
  }, [session, loadUserProgress])

  return null // This component doesn't render anything
}
