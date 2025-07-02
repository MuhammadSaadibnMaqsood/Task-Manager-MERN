import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, ChevronDown, LogOut } from 'lucide-react';

const Navbar = ({ user = {}, onLogout }) => {
  const menuRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    setProfileMenuOpen(false);
    onLogout && onLogout();
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 
        ${isScrolled
          ? "backdrop-blur-lg bg-black/60 shadow-xl py-3 md:py-4 border-b border-white/20"
          : "bg-gradient-to-r from-black via-gray-900 to-black py-4"
        }`}
    >
      {/* Logo */}
      <a href="/" className="flex items-center gap-2 group">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight transition-all duration-300 group-hover:text-purple-400">
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            MANAGE YOUR FLOW
          </span>
        </h1>
      </a>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-purple-500/20 transition-colors duration-300">
          <Settings className="w-5 h-5 text-white hover:text-purple-300" />
        </button>

        <div ref={menuRef} className='relative'>
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className='flex items-center gap-2 px-3 py-2 rounded-full cursor-pointer hover:bg-purple-500/20 transition-colors duration-300'
          >
            <div className='relative group'>
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover border-2 border-purple-500 group-hover:border-pink-400 transition-all duration-300"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium border border-purple-300">
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
              )}
            </div>
            <ChevronDown className={`w-4 h-4 text-white transition-transform duration-200 ${profileMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {profileMenuOpen && (
            <div className='absolute right-0 mt-2 w-56 bg-gradient-to-br from-gray-900 to-black rounded-lg shadow-2xl py-1 z-50 border border-purple-500/30 backdrop-blur-lg'>
              <ul>
                <li className='hover:bg-purple-500/10 transition-colors duration-200'>
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      navigate('/profile');
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-left text-white"
                  >
                    <Settings className='h-4 w-4 text-purple-300' />
                    <span>Profile Settings</span>
                  </button>
                </li>
                <li className='hover:bg-red-500/10 transition-colors duration-200'>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-left text-white"
                  >
                    <LogOut className='w-4 h-4 text-red-400' />
                    <span>Logout</span>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
