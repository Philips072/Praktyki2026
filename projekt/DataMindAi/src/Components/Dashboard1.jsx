import { useState, useEffect } from 'react'
import './Dashboard1.css'
import LESSONS from '../data/lessonsData'
import { useAuth } from '../AuthContext'

function getStats(userId) {
  const data = JSON.parse(localStorage.getItem(`lesson_progress_${userId}`) || '{}')

  let completedLessons = 0
  let totalSolved = 0

  LESSONS.forEach(lesson => {
    const done = (data[lesson.id] || []).length
    totalSolved += done
    if (lesson.exercises.length > 0 && done === lesson.exercises.length) {
      completedLessons++
    }
  })

  // Licz dni od pierwszego ukończonego zadania
  const firstTaskKey = `first_task_${userId}`
  const storedDate = localStorage.getItem(firstTaskKey)
  const now = new Date()

  if (totalSolved > 0 && !storedDate) {
    localStorage.setItem(firstTaskKey, now.toISOString())
  }

  const start = storedDate ? new Date(storedDate) : now
  const days = totalSolved > 0 ? Math.floor((now - start.getTime()) / (1000 * 60 * 60 * 24)) + 1 : 0

  return { completedLessons, totalSolved, days }
}

const Dashboard1 = () => {
  const { profile, user } = useAuth()
  const [stats, setStats] = useState(() => getStats(user?.id))

  useEffect(() => {
    const refresh = () => setStats(getStats(user?.id))
    window.addEventListener('storage', refresh)
    window.addEventListener('focus', refresh)
    return () => {
      window.removeEventListener('storage', refresh)
      window.removeEventListener('focus', refresh)
    }
  }, [])

  const name = profile?.name ? `, ${profile.name}` : ''

  return (
    <>
      <div className="dashboard-wrapper">
        <h1 className="dashboard-h1">
          Witaj w SQL Learning{name}!
        </h1>
        <p className="dashboard-desc">
          Rozpocznij swoją naukę SQL z personalizowanymi przykładami
        </p>

        <div className="dashboard-info">
          <div className="dashboard-lessons">
            <p className="lessons-text">
              <span className="lessons-number">{stats.completedLessons}</span><br/>
              Ukończone lekcje
            </p>
          </div>

          <div className="dashboard-tasks">
            <p className="tasks-text">
              <span className="task-number">{stats.totalSolved}</span><br/>
              Rozwiązane zadania
            </p>
          </div>

          <div className="dashboard-days">
            <p className="days-text">
              <span className="days-number">{stats.days}</span><br/>
              Dni nauki
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard1
