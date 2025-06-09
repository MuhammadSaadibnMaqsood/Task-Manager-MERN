import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Navbar from './Navbar'
import SideBar from './SideBar'
import { Outlet } from 'react-router-dom'
import { Circle, TrendingUp , Zap, Clock } from 'lucide-react'
import axios from 'axios'
import StateCard from './StateCard'
// import StateCard from './StateCard' // Assumed correct import path

const Layout = ({ user, onLogout }) => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Token not found')

      const { data } = await axios.get('http://localhost:4000/api/task/gp', {
        headers: { Authorization: `Bearer ${token}` },
      })

      const arr = Array.isArray(data)
        ? data
        : Array.isArray(data?.task)
        ? data.task
        : Array.isArray(data?.data)
        ? data.data
        : []

      setTasks(arr)
    } catch (error) {
      console.error(error)
      setError(error.message || 'Could not load tasks')
      if (error.response?.status === 401) onLogout()
    } finally {
      setLoading(false)
    }
  }, [onLogout])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const stats = useMemo(() => {
    const completedTasks = tasks.filter(t =>
      t.completedTask === true ||
      t.completedTask === 1 ||
      (typeof t.completedTask === 'string' && t.completedTask.toLowerCase() === 'yes')
    ).length

    const totalCount = tasks.length
    const pendingCount = totalCount - completedTasks
    const completedPercentage = totalCount ? Math.round((completedTasks / totalCount) * 100) : 0

    return {
      totalCount,
      pendingCount,
      completedPercentage,
      completedTasks
    }
  }, [tasks])

  if (loading) return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
      <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500'></div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 via-red-200 to-red-300 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-lg w-full bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6 text-center border border-red-300 dark:border-red-700">
        <div className="flex justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" className="w-12 h-12 text-red-600" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9S3 16.97 3 12 7.03 3 12 3s9 4.03 9 9z" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-red-700 dark:text-red-400 mb-2">Oops! Something went wrong</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {error}
        </p>
        <button
          onClick={fetchTasks}
          className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-medium shadow-md transition duration-200"
        >
          Try Again
        </button>
      </div>
    </div>
  )

  return (
    <div className='bg-gray-50 dark:bg-gray-900 min-h-screen mt-24'>
      <Navbar user={user} onLogout={onLogout} />
      <SideBar user={user} tasks={tasks} />

      <div className='p-4 md:p-8'>
        <div className='grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6'>
          <div className='xl:col-span-2 space-y-3 sm:space-y-4'>
            <Outlet context={{ tasks, refreshTasks: fetchTasks }} />
          </div>

          <div className='xl:col-span-1 space-y-4 sm:space-y-6'>
            <div className='bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-5 shadow-sm border'>
              <h3 className='flex items-center gap-2 font-semibold text-gray-800 dark:text-white'>
                <TrendingUp  className='w-4 h-4 sm:w-5 sm:h-5 text-purple-500' />
                Task Statistics
              </h3>

              <div className='grid grid-cols-2 gap-3 sm:gap-4 my-4'>
                <StateCard title='Total Task' value={stats.totalCount} icon={<Circle className='w-4 h-4 text-purple-500' />} />
                <StateCard title='Completed' value={stats.completedTasks} icon={<Circle className='w-4 h-4 text-green-500' />} />
                <StateCard title='Pending' value={stats.pendingCount} icon={<Circle className='w-4 h-4 text-fuchsia-500' />} />
                <StateCard title='Completion Rate' value={`${stats.completedPercentage}%`} icon={<Zap className='w-4 h-4 text-purple-500' />} />
              </div>

              <hr className='my-3 border-purple-100' />
              <div className='space-y-2'>
                <div className='flex items-center justify-between text-gray-700 dark:text-gray-300'>
                  <span className='text-xs sm:text-sm font-medium flex items-center gap-1.5'>
                    <Circle className='w-3 h-3 text-purple-500 fill-purple-500' />
                    Task Progress
                  </span>
                  <span className='text-xs bg-purple-100 text-purple-700 rounded-full px-2'>
                    {stats.completedTasks}/{stats.totalCount}
                  </span>
                </div>

                <div className='relative pt-1'>
                  <div className='flex items-center gap-1.5'>
                    <div className='flex-1 h-2 sm:h-3 bg-purple-100 rounded-full overflow-hidden'>
                      <div
                        className='h-full bg-gradient-to-r from-purple-500 to-purple-700 transition-all duration-500'
                        style={{ width: `${stats.completedPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className='mt-6'>
                <h3 className='text-base sm:text-lg font-semibold flex items-center gap-2 text-gray-800 dark:text-white mb-3'>
                  <Clock className='w-5 h-5 text-purple-500' />
                  Recent Activities
                </h3>

                <div className='space-y-2'>
                  {tasks.slice(0, 3).map((task) => (
                    <div key={task._id || task.id} className='hover:bg-purple-50 dark:hover:bg-gray-700 transition duration-200 p-3 rounded flex items-center justify-between'>
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm font-medium text-gray-700 dark:text-gray-200'>
                          {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'No Date'}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${task.completed ? 'bg-green-100 text-green-700' : 'bg-fuchsia-100 text-fuchsia-700'}`}>
                        {task.completed ? "Done" : "Pending"}
                      </span>
                    </div>
                  ))}

                  {tasks.length === 0 && (
                    <div className='text-center py-4'>
                      <div className='w-12 h-12 mx-auto rounded-full flex items-center justify-center bg-purple-50 dark:bg-gray-700'>
                        <Clock className='w-6 h-6 text-purple-500' />
                      </div>
                      <p className='text-sm text-gray-700 dark:text-gray-300 mt-2'>
                        No Recent Activities
                      </p>
                      <p className='text-xs text-gray-400 dark:text-gray-500'>
                        Tasks will appear here once added.
                      </p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout
