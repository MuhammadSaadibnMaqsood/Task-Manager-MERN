import React, { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { BACK_BUTTON, DANGER_BTN, FULL_BUTTON, INPUTWRAPPER, personalFields, SECTION_WRAPPER, securityFields } from '../assets/dummy'
import { ChevronLeft, Icon, Lock, LogOut, Save, Shield, UserCircle } from 'lucide-react'
import { data, useNavigate } from 'react-router-dom'
import axios from 'axios'

// const API_URL = 'http://localhost:4000'
const Profile = ({ user, setCurrentUser, onLogout }) => {

  const navigate = useNavigate();

  const [profile, setProfile] = useState({ name: '', email: '' });
  const [password, setPassword] = useState({ current: '', new: '', confirm: '' })

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) return
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/me`, { headers: { Authorization: `Bearer ${token}` } }).then(({ data }) => {
      if (data.success) {
        setProfile({ name: data.user.name, email: data.user.email });

      } else {
        toast.error(data.message);
      }
    }).catch(() => toast.error('UNABLE TO LOAD PROFILE'));
  }, []);

  const saveProfile = async (e) => {
    try {
      const token = localStorage.getItem('token');

      const { data } = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile`, { name: profile.name, email: profile.email },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        setCurrentUser((prev) => ({
          ...prev, name: profile.name,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=random`,


        }))
        toast.success('Profile Updated');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Faild to update profile');
    }

  }

  const changePassword = async (e) => {

    e.preventDefault();

    if (password.new !== password.confirm) {
      return toast.error('Password does not match');
    }

    try {

      const token = localStorage.getItem('token');

      const { data } = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/user/password`, { currentpassword: password.current, newPassword: password.new },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data) {
        toast.success('Password Changed');
        setPassword({ current: '', new: '', confirm: '' });
      }
      else {
        toast.error(data.message);
      }

    } catch (error) {

      toast.error(error.response?.data?.message || 'Faild to change password');

    }

  }
  return (
    <div className=' sm:pl-0 min-h-screen bg-gray-50'>
      <ToastContainer position='top-center' autoClose={3000} />
      <div className='max-w-4xl mx-auto p-6'>
        <button onClick={() => navigate(-1)} className={BACK_BUTTON}>
          <ChevronLeft className='w-5 h-5 mr-1' />
          Back to Dashboard
        </button>
        <div className='flex items-center gap-4 mb-6'>
          <div className='w-16 h-16 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-md'>

            {profile.name ? profile.name[0].toUpperCase() : 'U'}

          </div>
          <div>

            <h1 className='text-3xl font-bold text-gray-800'>Account setting</h1>
            <p className='text-gray-500 text-sm'>Manage your profile and security settings</p>
          </div>

        </div>
        <div className='grid md:grid-cols-2 gap-8'>
          <section className={SECTION_WRAPPER}>
            <div className='flex items-center gap-2 mb-6'>
              <UserCircle className='text-purple-500 w-5 h-5' />
              <h2 className=' text-xl font-semibold text-gray-800'>Personal Information</h2>
            </div>

            {/* PERSONAL INFO  */}

            <form onSubmit={saveProfile} className='space-y-4'>
              {personalFields.map(({ name, type, placeholder, icon: Icon }) => (
                <div
                  key={name}
                  className={`${INPUTWRAPPER} border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-purple-400`}
                >
                  <Icon className="text-purple-500 w-5 h-5 mr-2" />
                  <input
                    type={type}
                    name={name}
                    required
                    placeholder={placeholder}
                    value={profile[name] || ''}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, [name]: e.target.value }))
                    }
                    className="w-full bg-transparent focus:outline-none text-sm"
                  />
                </div>
              ))}

              <button className={FULL_BUTTON}>

                <Save className='w-4 h-4' />Save changes

              </button>

            </form>

          </section>

          <section className={SECTION_WRAPPER}>
            <div className='flex items-center gap-2 mb-6'>
              <Shield className='text-purple-500 w-5 h-5' />
              <h2 className=' text-xl font-semibold text-gray-800'>Security</h2>
            </div>

            <form onSubmit={changePassword} className='space-y-4'>
              {securityFields.map(({ name, placeholder }) => (
                <div
                  key={name}
                  className={`${INPUTWRAPPER} border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-purple-400`}
                >
                  <Lock className="text-purple-500 w-5 h-5 mr-2" />
                  <input
                    type='password'
                    name={name}
                    required
                    placeholder={placeholder}
                    value={password[name] || ''}
                    onChange={(e) =>
                      setPassword((prev) => ({ ...password, [name]: e.target.value }))
                    }
                    className="w-full bg-transparent focus:outline-none text-sm"
                  />
                </div>
              ))}

              <button className={FULL_BUTTON}>

                <Shield className='w-4 h-4' />Change password

              </button>

              <div className='mt-8 pt-6 border-t border-purple-100'>
                <h3 className='text-red-600 font-semibold mb-4 flex items-center gap-2'>
                  <LogOut className='w-4 h-4' />Danger Zone
                </h3>

                <button className={DANGER_BTN} onClick={onLogout}>
                  Logout

                </button>



              </div>

            </form>

          </section>


        </div>

      </div>

    </div>
  )
}

export default Profile