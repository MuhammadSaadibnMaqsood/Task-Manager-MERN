import { UserPlus } from 'lucide-react'
import React, { useState } from 'react'
import { BUTTONCLASSES, FIELDS, Inputwrapper } from '../assets/dummy'
import axios from 'axios'

const API_URL = 'http://localhost:4000'
const INITIAL_FORM = { name: '', email: '', password: '' }

const MESSAGE_SUCCESS = 'bg-green-100 text-green-700 px-4 py-2 rounded-md text-sm text-center'
const MESSAGE_ERROR = 'bg-red-100 text-red-700 px-4 py-2 rounded-md text-sm text-center'

export const Signup = ({ onSwitch }) => {
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ text: '', type: '' })

    try {
      const { data } = await axios.post(`${API_URL}/api/user/registor`, formData)
      console.log('Signup successful:', data)
      setMessage({ text: 'Registration successful! You can now login.', type: 'success' })
      setFormData(INITIAL_FORM)
    } catch (error) {
      console.error('Signup error:', error)
      setMessage({
        text: error.response?.data?.message || 'An error occurred. Please try again.',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='max-w-md w-full bg-white shadow-lg border border-purple-100 rounded-xl p-6 sm:p-8 mx-auto mt-20'>
      <div className='mb-6 text-center'>
        <div className='w-16 h-16 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-full mx-auto flex items-center justify-center mb-4 shadow-md'>
          <UserPlus className='w-7 h-7 text-white' />
        </div>
        <h2 className='text-2xl font-bold text-gray-800'>Create Account</h2>
        <p className='text-gray-500 text-sm mt-1'>Join Task-Flow to manage your tasks</p>
      </div>

      {message.text && (
        <div className={`${message.type === 'success' ? MESSAGE_SUCCESS : MESSAGE_ERROR} mb-4`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className='space-y-4'>
        {FIELDS.map(({ name, type, placeholder, icon: Icon }) => (
          <div key={name} className={`${Inputwrapper} border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-purple-400`}>
            <Icon className='text-purple-500 w-5 h-5 mr-2' />
            <input
              type={type}
              name={name}
              required
              placeholder={placeholder}
              value={formData[name]}
              onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
              className='w-full bg-transparent focus:outline-none text-sm text-gray-700'
            />
          </div>
        ))}

        <button type='submit' className={BUTTONCLASSES + ' w-full flex justify-center items-center'} disabled={loading}>
          {loading ? 'Signing up...' : (
            <>
              <UserPlus className='w-4 h-4 mr-2' /> Sign Up
            </>
          )}
        </button>
      </form>

      <p className='text-center text-sm text-gray-600 mt-6'>
        Already have an account?{' '}
        <button
          onClick={onSwitch}
          className='text-purple-600 hover:underline font-medium'
        >
          Login
        </button>
      </p>
    </div>
  )
}
