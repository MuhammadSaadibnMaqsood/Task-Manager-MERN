import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import {
  ADD_BUTTON, EMPTY_STATE, FILTER_LABELS, FILTER_OPTIONS, FILTER_WRAPPER, HEADER, ICON_WRAPPER,
  LABEL_CLASS, SELECT_CLASSES, STAT_CARD, STATS, STATS_GRID, TAB_ACTIVE, TAB_BASE, TAB_INACTIVE,
  TABS_WRAPPER, VALUE_CLASS, WRAPPER
} from '../assets/dummy'
import { CalendarIcon, Filter, HouseIcon, Plus } from 'lucide-react'
import TaskItem from '../components/TaskItem'
import axios from 'axios'
import { TaskModel } from '../components/TaskModel'

// const API_BASE = 'http://localhost:4000/api/task'

const Dashboard = () => {
  const [showModel, setShowModel] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [filter, setFilter] = useState('all');
  const [completed, setcompleted] = useState([]);
  const [tasks, setTasks] = useState([])

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/task/gp`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await res.json()
      setTasks(data.tasks)


    } catch (err) {
      console.error(err)
    }
  }, [])



  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const stats = useMemo(() => {
    return {
      total: tasks.length,
      lowPriority: tasks.filter(t => t.priority?.toLowerCase() === 'low').length,
      mediumPriority: tasks.filter(t => t.priority?.toLowerCase() === 'medium').length,
      highPriority: tasks.filter(t => t.priority?.toLowerCase() === 'high').length,
      completed: tasks.filter(t =>
        t.completed === true ||
        t.completed?.toLowerCase?.() === 'yes' ||
        t.completed === 1
      ).length
    }
  }, [tasks])

  const filterTask = useMemo(() => tasks.filter(task => {
    const dueDate = new Date(task.dueDate)
    const today = new Date()
    const nextWeek = new Date(today)
    nextWeek.setDate(today.getDate() + 7)

    switch (filter) {
      case 'today':
        return dueDate.toDateString() === today.toDateString()
      case 'week':
        return dueDate >= today && dueDate <= nextWeek
      case 'high':
      case 'medium':
      case 'low':
        return task.priority?.toLowerCase() === filter
      default:
        return true
    }
  }), [tasks, filter])

  const handleSave = useCallback(async (taskData) => {
    try {
      if (taskData.id) {
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/task/${taskData.id}/gp`, taskData)
      } else {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/task`, taskData)
      }

      fetchTasks()
      setShowModel(false)
      setSelectedTask(null)

    } catch (error) {
      console.error('Error in saving task', error.response || error.message)
    }
  }, [fetchTasks])

  return (
    <div className={`${WRAPPER} lg:ml-60`}>
      {/* HEADER */}
      <div className={HEADER}>
        <div className='min-w-0'>
          <h1 className='text-xl md:text-3xl font-bold text-gray-800 flex items-center gap-2'>
            <HouseIcon className='text-purple-500 w-5 h-5 md:w-6 md:h-6 shrink-0' />
            <span className='truncate'>Task Overview</span>
          </h1>
          <p className='text-sm text-gray-500 mt-1 ml-7 truncate'>
            Manage your task efficiency
          </p>
        </div>

        <button onClick={() => setShowModel(true)} className={`${ADD_BUTTON} cursor-pointer`}>
          Add New Task
        </button>
      </div>

      {/* STATS */}
      <div className={STATS_GRID}>
        {STATS.map(({ key, label, icon: Icon, iconColor, borderColor = 'border-purple-100', valueKey, textColor, gradient }) => (
          <div key={key} className={`${STAT_CARD} ${borderColor}`}>
            <div className='flex items-center gap-2 md:gap-3'>
              <div className={`${ICON_WRAPPER} ${iconColor}`}>
                <Icon className='w-4 h-4 md:w-5 md:h-5' />
              </div>
              <div className='min-w-0'>
                <p className={`${VALUE_CLASS} ${gradient ? 'bg-gradient-to-r from-fuchsia-500 to-fuchsia-600 bg-clip-text text-transparent' : textColor}`}>
                  {stats[valueKey]}
                </p>
                <p className={LABEL_CLASS}>{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CONTENT */}
      <div className='space-y-6'>
        {/* Filter */}
        <div className={FILTER_WRAPPER}>
          <div className='flex items-center gap-2 min-w-0'>
            <Filter className='w-5 h-5 text-purple-500 shrink-0' />
            <h2 className='text-base md:text-lg font-semibold text-gray-800 truncate'>
              {FILTER_LABELS[filter]}
            </h2>
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className={SELECT_CLASSES}>
            {FILTER_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </option>
            ))}
          </select>

          <div className={TABS_WRAPPER}>
            {FILTER_OPTIONS.map(opt => (
              <button
                key={opt}
                onClick={() => setFilter(opt)}
                className={`${TAB_BASE} ${filter === opt ? TAB_ACTIVE : TAB_INACTIVE} cursor-pointer`}
              >
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Task List */}
        <div className='space-y-4'>
          {filterTask.length === 0 ? (
            <div className={EMPTY_STATE.wrapper}>
              <div className={EMPTY_STATE.iconWrapper}>
                <CalendarIcon className='w-8 h-8 text-purple-500' />
              </div>
              <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                No task found
              </h3>
              <p className='text-sm text-gray-500 mb-4'>
                {filter === 'all' ? 'Create your first task to get started' : 'No task matches this filter'}
              </p>
              <button onClick={() => setShowModel(true)} className={`${EMPTY_STATE.btn} cursor-pointer`}>
                Add new task
              </button>
            </div>
          ) : (
            filterTask.map(task => (
              <TaskItem
                key={task._id || task.id}
                task={task}
                onReferesh={fetchTasks}
                showCompletedCheckBox
                onEdit={() => {
                  setSelectedTask(task)
                  setShowModel(true)
                }}
              />
            ))
          )}
        </div>

        {/* Add New Task Button (Responsive) */}
        <div
          onClick={() => setShowModel(true)}
          className='hidden md:flex items-center justify-center p-4 border-2 border-dashed border-purple-200 rounded-xl hover:border-purple-400 bg-purple-50/50 transition-colors cursor-pointer'>
          <Plus className='h-5 w-5 text-purple-500' />
          <span className='text-gray-600 font-medium'>Add New Task</span>
        </div>
      </div>

      {/* Task Modal */}
      <TaskModel
        isOpen={showModel || !!selectedTask}
        onClose={() => {
          setShowModel(false)
          setSelectedTask(null)
        }}
        taskToEdit={selectedTask}
        onSave={handleSave}
      />
    </div>
  )
}

export default Dashboard
