'use client'

import { useStatsStore } from '@/lib/stats-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestStatsPage() {
  const { xp, streak, completedLessons, addXp, completeLesson, resetStats } = useStatsStore()

  const handleAddXp = () => {
    addXp(50)
  }

  const handleCompleteLesson = () => {
    completeLesson('test-lesson')
  }

  const handleReset = () => {
    resetStats()
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Stats Store Test</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Current Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>XP:</strong> {xp}</p>
            <p><strong>Streak:</strong> {streak}</p>
            <p><strong>Completed Lessons:</strong> {completedLessons.join(', ') || 'None'}</p>
          </div>
        </CardContent>
      </Card>

      <div className="space-x-4">
        <Button onClick={handleAddXp}>Add 50 XP</Button>
        <Button onClick={handleCompleteLesson}>Complete Test Lesson</Button>
        <Button onClick={handleReset} variant="destructive">Reset Stats</Button>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border rounded">
        <h3 className="font-semibold mb-2">Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1">
          <li>Click "Add 50 XP" to test XP addition</li>
          <li>Click "Complete Test Lesson" to test lesson completion</li>
          <li>Check if the stats update immediately</li>
          <li>Refresh the page to see if stats persist</li>
          <li>Check browser console for debug logs</li>
        </ol>
      </div>
    </div>
  )
}
