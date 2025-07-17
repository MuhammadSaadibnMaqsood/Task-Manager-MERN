import { Eye, EyeOff, LogIn } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { BUTTONCLASSES, Inputwrapper, fields } from '../assets/dummy';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const INITIAL_FORM = { name: '', email: '', password: '' };

const Login = ({ onSubmit, onSwitch }) => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  // const url = 'http://localhost:4000';

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (token) {
      (async () => {
        try {
          const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (data.success) {
            onSubmit?.({ token, userId, ...data.user });
            toast.success('Session restored. Redirecting...');
            navigate('/');
          } else {
            localStorage.clear();
          }
        } catch {
          localStorage.clear();
        }
      })();
    }
  }, [navigate, onSubmit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rememberMe) {
      toast.error('You must enable "Remember me" to login');
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/login`, formData);
      if (!data.token) throw new Error(data.message || 'Login failed');

      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.user.id);
      setFormData(INITIAL_FORM);
      onSubmit?.({ token: data.token, userId: data.user.id, ...data.user });
      setTimeout(() => navigate('/'), 1000);
    } catch (error) {
      const msg = error.response?.data.message || error.message;
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchMode = () => {
    toast.dismiss();
    onSwitch?.();
  };

  return (
    <div className="mt-20 max-w-md mx-auto bg-white shadow-xl border border-purple-100 rounded-2xl p-8 sm:p-10 md:p-12 w-full">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
      <div className="mb-6 text-center">
        <div className="w-16 h-16 bg-gradient-to-tr from-fuchsia-500 to-purple-600 rounded-full mx-auto flex items-center justify-center mb-4">
          <LogIn className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
        <p className="text-gray-500 text-sm mt-1">Sign in to continue to TaskFlow</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {fields.map(({ name, type, placeholder, icon: Icon, isPassword }) => (
          <div key={name} className={Inputwrapper}>
            <Icon className="text-purple-500 w-5 h-5" />
            <input
              type={isPassword ? (showPassword ? 'text' : 'password') : type}
              name={name}
              required
              placeholder={placeholder}
              value={formData[name]}
              onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
              className="w-full bg-transparent cursor-pointer focus:outline-none text-sm text-gray-700"
            />
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="ml-2 text-gray-500 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            )}
          </div>
        ))}

        <div className="flex items-center">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
            className="h-4 w-4 text-purple-500 cursor-pointer focus:ring-purple-400 border-gray-300 rounded"
          />
          <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
            Remember Me
          </label>
        </div>

        <button type="submit" className={`${BUTTONCLASSES} cursor-pointer`} disabled={loading}>
          {loading ? 'Logging in...' : <><LogIn className="w-4 h-4 inline-block mr-1" /> Login</>}
        </button>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{' '}
          <button
            type="button"
            className="text-purple-600 hover:text-purple-700 cursor-pointer hover:underline font-medium transition-colors"
            onClick={handleSwitchMode}
          >
            Signup
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
