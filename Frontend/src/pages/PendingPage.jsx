import React, { useEffect, useState } from 'react'
import { Clock, CheckCircle2, Calendar } from 'lucide-react'

// const API_BASE = 'http://localhost:4000/api/task/gp'

const PendingPage = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/task/gp`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        const data = await res.json()
        if (data.success) {
          setTasks(data.tasks || [])
        } else {
          setError(data.message || 'Failed to fetch tasks')
        }
      } catch (err) {
        console.error(err)
        setError('Error fetching tasks')
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [])

  const pendingTasks = tasks.filter(task =>
    !(
      task.completed === true ||
      (typeof task.completed === 'string' && task.completed.toLowerCase() === 'yes') ||
      task.completed === 1
    )
  )

  return (
    <div className="sm:pl-60 min-h-screen  p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-6 border border-purple-100">
        <h1 className="text-3xl font-bold text-purple-700 mb-2 text-center flex items-center justify-center gap-2">
          <Clock className="w-6 h-6" /> Pending Tasks
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Review and complete your pending tasks to stay on track.
        </p>

        {loading && (
          <div className="flex justify-center items-center py-10">
            <svg className="animate-spin h-8 w-8 text-purple-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!loading && pendingTasks.length === 0 && (
          <div className="text-center py-10">
            <CheckCircle2 className="mx-auto w-12 h-12 text-green-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              All tasks are complete!
            </h3>
            <p className="text-gray-500">You have no pending tasks. Great job!</p>
          </div>
        )}

        <div className="space-y-4">
          {pendingTasks.map(task => (
            <div
              key={task._id}
              className="border border-purple-100 rounded-lg shadow hover:shadow-md transition p-4 bg-white"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-gray-800">{task.title}</h2>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  task.priority === 'high'
                    ? 'bg-red-100 text-red-600'
                    : task.priority === 'medium'
                    ? 'bg-yellow-100 text-yellow-600'
                    : 'bg-green-100 text-green-600'
                }`}>
                  {task.priority?.toUpperCase()}
                </span>
              </div>
              {task.description && <p className="text-gray-600 mb-2">{task.description}</p>}
              <div className="flex items-center text-gray-500 text-sm gap-2">
                <Calendar className="w-4 h-4" />
                Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PendingPage
