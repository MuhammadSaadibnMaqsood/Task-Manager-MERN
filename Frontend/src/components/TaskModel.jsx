import React, { useCallback, useEffect, useState } from 'react'
import { DEFAULT_TASK } from '../assets/dummy'
import { PlusCircle, Save, X } from 'lucide-react'

const API_BASE = 'http://localhost:4000/api/task'

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (taskData.dueDate < today) {
      setError('Due date cannot be in the past')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const isEdit = Boolean(taskData.id)
      const url = isEdit ? `${API_BASE}/${taskData.id}` : API_BASE

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

      const saved = await response.json()
      onSave?.(saved)
      onClose()
    } catch (error) {
      setError(error.message || 'Unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Completed?
            </label>
            <select
              name="completed"
              value={taskData.completed}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-purple-500"
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

          <button
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold p-2 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : taskData.id ? 'Update Task' : 'Add Task'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default TaskModel
