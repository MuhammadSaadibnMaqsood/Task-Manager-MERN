import React, { useEffect, useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import { ADD_BUTTON, EMPTY_STATE, FILTER_LABELS, FILTER_OPTIONS, FILTER_WRAPPER, HEADER, ICON_WRAPPER, LABEL_CLASS, SELECT_CLASSES, STAT_CARD, STATS, STATS_GRID, TAB_ACTIVE, TAB_BASE, TAB_INACTIVE, TABS_WRAPPER, VALUE_CLASS, WRAPPER } from '../assets/dummy'
import { CalendarIcon, Filter, HouseIcon } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import TaskItem from '../components/TaskItem'

const API_BASE = 'http://localhost:4000/api/task'
const Dashboard = () => {

  const [showModel, setShowModel] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filter, setFilter] = useState('all');
  // const { task, refreshTask } = useOutletContext()
  const [task, setTask] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await fetch('http://localhost:4000/api/task');
      const data = await res.json();
      setTask(data);
    };

    fetchTasks();
  }, []);

  const stats = useMemo(() => {
    return {
      total: task.length,
      lowPriority: task.filter(t => t.priority?.toLowerCase() === 'low').length,
      mediumPriority: task.filter(t => t.priority?.toLowerCase() === 'medium').length,
      highPriority: task.filter(t => t.priority?.toLowerCase() === 'high').length,
      completed: task.filter(t =>
        t.completed === true ||
        t.completed?.toLowerCase?.() === 'yes' ||
        t.completed === 1
      ).length
    };
  }, [task]);


  // FILTER TASK 

  const filterTask = useMemo(() => task.filter(task => {
    const dueDate = new Date(task.dueDate)
    const today = new Date()
    const nextWeek = new Date(today); nextWeek.setDate(today.getDate() + 7)

    switch (filter) {
      case 'today':
        return dueDate.toDateString() === today.toDateString();

      case 'week':
        return dueDate >= today && dueDate <= nextWeek
      case 'high':
      case 'medium':
      case 'low':
        return task.priority?.toLowerCase() === filter

      default:
        return true
    }

  }), [task, filter])

  return (
    <div className={`${WRAPPER} ml-60 `}>

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

        <button onClick={() => setShowModel(true)} className={ADD_BUTTON}>Add New Task </button>

      </div>

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

      {/* CONTENT  */}

      <div className='space-y-6'>
        <div className={FILTER_WRAPPER}>
          <div className='flex items-center gap-2 min-w-0'>
            <Filter className='w-5 h-5 text-purple-500 shrink-0' />
            <h2 className='text-base md:text-lg font-semibold text-gray-800 truncate '>
              {FILTER_LABELS[filter]}
            </h2>
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}
            className={SELECT_CLASSES}>
            {FILTER_OPTIONS.map((opt) => <option key={opt} value={opt}>
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </option>)}
          </select>

          <div className={TABS_WRAPPER}>
            {FILTER_OPTIONS.map(opt => (
              <button key={opt} onClick={() => setFilter(opt)}
                className={`${TAB_BASE} ${filter === opt ? TAB_ACTIVE : TAB_INACTIVE}`}>
                {opt.charAt(0).toUpperCase() + opt.slice(1)}

              </button>
            ))}
          </div>

        </div>

        {/* TASK LIST  */}

        <div className='space-y-4'>
          {filterTask.length === 0 ? (
            <div className={EMPTY_STATE.wrapper}>
              <div className={EMPTY_STATE.iconWrapper}>
                <CalendarIcon className='w-8 h-8 text-purple-500' />
              </div>
              <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                No task founded
              </h3>
              <p className='text-sm text-gray-500 mb-4'>
                {filter === 'all' ? 'Create your first task to get started' : 'No task match this filter'}
              </p>
              <button onClick={() => setShowModel(true)}
                className={EMPTY_STATE.btn}>Add new task</button>

            </div>
          ) : (
            filterTask.map(task => (
              <TaskItem key={task._id || task.id} task={task} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard