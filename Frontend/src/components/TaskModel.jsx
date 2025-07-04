import React, { useCallback, useEffect, useState } from 'react'
import { DEFAULT_TASK } from '../assets/dummy'
import { CheckCircle, PlusCircle, Save, SaveIcon, X } from 'lucide-react'

// const API_BASE = 'http://localhost:4000/api/task'

export const TaskModel = ({ isOpen, onClose, taskToEdit, onSave, onLogout }) => {
  const [taskData, setTaskData] = useState(DEFAULT_TASK)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    if (!isOpen) return
    if (taskToEdit) {
      const normalized = taskToEdit.completed === true || taskToEdit.completed === 'yes' ? 'Yes' : 'No'
      setTaskData({
        ...DEFAULT_TASK,
        title: taskToEdit.title || '',
        description: taskToEdit.description || '',
        priority: taskToEdit.priority || 'low',
        dueDate: taskToEdit.dueDate?.split('T')[0] || '',
        completed: normalized,
        id: taskToEdit._id,
      })
    } else {
      setTaskData(DEFAULT_TASK)
    }
    setError(null)
  }, [isOpen, taskToEdit])

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setTaskData((prev) => ({ ...prev, [name]: value }))
  }, [])

  const getHeader = useCallback(() => {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No token found')
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  }, [])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    if (taskData.dueDate < today) {
      setError('Due date cannot be in the past')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const isEdit = Boolean(taskData.id)
      const url = isEdit ? `${import.meta.env.VITE_BACKEND_URL}/api/task/${taskData.id}/gp` : `${import.meta.env.VITE_BACKEND_URL}/api/task/gp`



      const response = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: getHeader(),
        body: JSON.stringify(taskData),
      })

      if (!response.ok) {
        if (response.status === 401) return onLogout?.()
        const err = await response.json()
        throw new Error(err.message || 'Failed to save task')
      }

      const result = await response.json();
      onSave?.(result.task);
      onClose()
    } catch (error) {
      setError(error.message || 'Unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }, [taskData, onClose, onSave, getHeader, onLogout, today])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-purple-100 rounded-xl max-w-md w-full shadow-lg relative p-6 animate-fadeIn">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            {taskData.id ? (
              <Save className="text-purple-500 w-5 h-5" />
            ) : (
              <PlusCircle className="text-purple-500 w-5 h-5" />
            )}
            {taskData.id ? 'Edit Task' : 'Add Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-purple-100 rounded-lg transition-colors text-gray-500 hover:text-purple-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={taskData.title}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-purple-500"
              placeholder="Task title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={taskData.description}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-purple-500"
              placeholder="Task description"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              name="priority"
              value={taskData.priority}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-purple-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <CheckCircle className='w-4 h-4 text-purple-500 inline-block mr-1' />
              Status
            </label>
            <div className='flex gap-4'>
              {[{ val: 'Yes', label: 'Completed' }, { val: 'No', label: 'In progress' }].map((item) => (
                <label key={item.val} className='flex items-center'>
                  <input
                    type='radio'
                    name='completed'
                    value={item.val}
                    checked={taskData.completed === item.val}
                    onChange={handleChange}
                    className='h-4 w-4 text-purple-500 focus:ring-purple-500 border-gray-300 rounded'
                  />
                  <span className='ml-2 text-sm text-gray-700'>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              min={today}
              value={taskData.dueDate}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <button
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold p-2 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : taskData.id ? <><SaveIcon className='w-4 h-4 ' /> Update task  </> : <>
              <PlusCircle className='w-4 h-4 ' /> Create task
            </>}
          </button>
        </form>
      </div>
    </div>
  )
}

export default TaskModel
