import React, { useEffect, useState } from 'react'
import { getPriorityBadgeColor, getPriorityColor, MENU_OPTIONS, TI_CLASSES } from '../assets/dummy'
import { Calendar, CheckCircle2, Clock, MoreVertical } from 'lucide-react';
import { format, isToday } from 'date-fns'
import axios from 'axios';
import TaskModel from './TaskModel';

// const API_BASE = 'http://localhost:4000/api/task'

const TaskItem = ({ task, onReferesh, onLogout, showCompletedCheckBox = true }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isCompleted, setIsComleted] = useState(
    [true, 'yes', 1].includes(typeof task.completed === 'string' ? task.completed.toLowerCase() : task.completed)
  );
  const [showEditModel, setShowEditModel] = useState(false);
  const [subTask, setSubTask] = useState(task.subTask || []);

  useEffect(() => {
    setIsComleted(
      [true, 1, 'yes'].includes(typeof task.completed === 'string' ? task.completed.toLowerCase() : task.completed)
    );
  }, [task.completed]);

  const getHeader = () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No auth token found');
    return { Authorization: `Bearer ${token}` };
  }

  const handleComplete = async () => {
    const newStatus = isCompleted ? 'no' : 'yes';
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/task/${task._id}/gp`, { completed: newStatus }, { headers: getHeader() });
      setIsComleted(!isCompleted);
      onReferesh?.();
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) onLogout?.();
    }
  }

  const handleAction = (action) => {
    setShowMenu(false);
    if (action === 'edit') setShowEditModel(true);
    if (action === 'delete') handleDelete();
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/task/${task._id}/gp`, { headers: getHeader() });
      onReferesh?.();
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) onLogout?.();
    }
  }

  const handleSave = async (updatedTask) => {
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/task/${task._id}/gp`, updatedTask, { headers: getHeader() });
      setShowEditModel(false);
      onReferesh?.();
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) onLogout?.();
    }
  }

  const borderColor = isCompleted ? 'border-green-500' : getPriorityColor(task.priority).split(' ')[0];
  const progress = subTask.length ? (subTask.filter(st => st.completed).length / subTask.length) * 100 : 0;

  return (
    <>
      <div className={`${TI_CLASSES} ${borderColor} px-2 hover:shadow-md transition-shadow duration-300`}>
        <div className={TI_CLASSES.leftContainer}>
          {showCompletedCheckBox && (
            <button
              onClick={handleComplete}
              className={`${TI_CLASSES.completeBtn} ${isCompleted ? 'text-green-300' : 'text-gray-300'} hover:text-green-500`}>
              <CheckCircle2 size={18} className={`${TI_CLASSES.checkboxIconBase} ${isCompleted ? 'fill-green-500' : ''}`} />
            </button>
          )}

          <div className='flex-1 min-w-0'>
            <div className='flex items-baseline gap-2 mb-1 flex-wrap'>
              <h3 className={`${TI_CLASSES.titleBase} ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-800'} hover:underline`}>
                {task.title}
              </h3>
              <span className={`${TI_CLASSES.priorityBadge} ${getPriorityBadgeColor(task.priority)} capitalize`}>
                {task.priority}
              </span>
            </div>
            {task.description && (
              <p className={`${TI_CLASSES.description} text-sm text-gray-600`}>
                {task.description}
              </p>
            )}
          </div>
        </div>

        <div className={TI_CLASSES.rightContainer}>
          <div className='relative'>
            <button onClick={() => setShowMenu(!showMenu)} className='hover:bg-purple-50 p-1 rounded-md'>
              <MoreVertical className='w-4 h-4 sm:w-5 sm:h-5 text-gray-500 hover:text-purple-600' />
            </button>
            {showMenu && (
              <div className={`${TI_CLASSES.menuDropdown} rounded-lg shadow-lg bg-white border border-purple-100`}>
                {MENU_OPTIONS.map(opt => (
                  <button
                    key={opt.action}
                    onClick={() => handleAction(opt.action)}
                    className='w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm hover:bg-purple-50 flex items-center gap-2 transition-colors duration-200'
                  >
                    {opt.icon}{opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className='mt-2 space-y-1 text-xs sm:text-sm px-2'>
            <div className={`flex items-center gap-1 ${task.dueDate && isToday(new Date(task.dueDate)) ? 'text-fuchsia-600 font-semibold' : 'text-gray-500'}`}>
              <Calendar className='w-3.5 h-3.5' />
              {task.dueDate
                ? (isToday(new Date(task.dueDate)) ? 'Today' : format(new Date(task.dueDate), 'MMM dd'))
                : '-'}
            </div>

            <div className='flex items-center gap-1 text-gray-400'>
              <Clock className='w-3 h-3 sm:w-3.5 sm:h-3.5' />
              {task.createdAt
                ? `Created ${format(new Date(task.createdAt), 'MMM dd')}`
                : 'No date'}
            </div>
          </div>
        </div>
      </div>

      <TaskModel
        isOpen={showEditModel}
        onClose={() => setShowEditModel(false)}
        taskToEdit={task}
        onSave={handleSave}
      />
    </>
  )
}

export default TaskItem
