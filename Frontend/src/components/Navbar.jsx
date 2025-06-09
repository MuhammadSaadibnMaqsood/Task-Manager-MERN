import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, ChevronDown, LogOut, Menu, X } from 'lucide-react';

const Navbar = ({ user = {}, onLogout }) => {
    const menuRef = useRef(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const navigate = useNavigate();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setProfileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Features", path: "/features" },
        { name: "Pricing", path: "/pricing" },
        { name: "About", path: "/about" }
    ];

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleProfileMenuToggle = () => {
        setProfileMenuOpen(!profileMenuOpen);
    };

    const handleLogout = () => {
        setProfileMenuOpen(false);
        onLogout && onLogout();
    };

    return (
        <nav className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 
                         ${isScrolled ? "bg-black/80 backdrop-blur-md shadow-lg py-3 md:py-4 text-white border-b border-white/10"
                          : "bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] text-white py-4 md:py-6"
            }`}
        >
            {/* Logo with animation */}
            <a href="/" className="flex items-center gap-2 group">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold transition-all duration-300 group-hover:text-purple-300">
                    MANAGE YOUR FLOW
                </h1>
                <span className="hidden md:block h-2 w-2 bg-purple-500 rounded-full animate-ping opacity-75 group-hover:animate-none"></span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4 lg:gap-8">
                {navLinks.map((link, i) => (
                    <a
                        key={i}
                        href={link.path}
                        className="group relative text-white hover:text-purple-300 transition-colors duration-300"
                    >
                        {link.name}
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
                    </a>
                ))}
                <button className="relative overflow-hidden border border-white/50 px-4 py-1 text-sm font-light rounded-full text-white hover:text-black hover:bg-white transition-all group">
                    <span className="relative z-10">New Launch</span>
                    <span className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                </button>
            </div>

            {/* Desktop Right Section */}
            <div className="hidden md:flex items-center gap-4">
                <button className="p-2 rounded-full hover:bg-white/10 transition-colors duration-300">
                    <Settings className="w-5 h-5 text-white hover:text-purple-300" />
                </button>
                
                <div ref={menuRef} className='relative'>
                    <button 
                        onClick={handleProfileMenuToggle}  
                        className='flex items-center gap-2 px-3 py-2 rounded-full cursor-pointer hover:bg-white/10 transition-colors duration-300'
                    >
                        <div className='relative'>
                            {user.avatar ? (
                                <img 
                                    src={user.avatar} 
                                    alt="avatar" 
                                    className="w-8 h-8 rounded-full object-cover border-2 border-purple-400" 
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-medium">
                                    {user.name ? user.name[0].toUpperCase() : 'U'}
                                </div>
                            )}
                        </div>
                        <div className='text-left'>
                            <p className='text-sm font-medium'>{user.name || 'User'}</p>
                            {user.email && <p className='text-xs text-white/70'>{user.email}</p>}
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${profileMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {profileMenuOpen && (
                        <div className='absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-xl py-1 z-50 border border-white/10 overflow-hidden'>
                            <ul>
                                <li className='hover:bg-white/10 transition-colors duration-200'>
                                    <button 
                                        onClick={() => {
                                            setProfileMenuOpen(false);
                                            navigate('/profile');
                                        }}
                                        className="flex items-center gap-3 w-full px-4 py-2.5 text-left text-white"
                                    >
                                        <Settings className='h-4 w-4 text-purple-300'/>
                                        <span>Profile Settings</span>
                                    </button>
                                </li>
                                <li className='hover:bg-white/10 transition-colors duration-200'>
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
                
                <button className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-2.5 rounded-full transition-all duration-300 group">
                    <span className="relative z-10">Login</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-3 md:hidden">
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors duration-300"
                >
                    {isMenuOpen ? (
                        <X className="h-6 w-6 text-white" />
                    ) : (
                        <Menu className="h-6 w-6 text-white" />
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={`fixed top-0 left-0 w-full h-screen bg-gradient-to-br from-[#0f0c29] to-[#24243e] text-white flex flex-col md:hidden items-center justify-center gap-8 text-lg font-medium transition-all duration-500 ease-in-out ${isMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}>
                <button 
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors duration-300" 
                    onClick={() => setIsMenuOpen(false)}
                >
                    <X className="h-6 w-6 text-white" />
                </button>

                {navLinks.map((link, i) => (
                    <a 
                        key={i} 
                        href={link.path} 
                        onClick={() => setIsMenuOpen(false)}
                        className="relative px-4 py-2 text-xl hover:text-purple-300 transition-colors duration-300"
                    >
                        {link.name}
                        <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-purple-400 transition-all duration-300 hover:w-full"></span>
                    </a>
                ))}

                <button className="relative overflow-hidden border border-white/50 px-6 py-2 text-sm font-light rounded-full text-white hover:text-black hover:bg-white transition-all group mt-4">
                    <span className="relative z-10">New Launch</span>
                    <span className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                </button>

                <button className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-10 py-3 rounded-full transition-all duration-300 group mt-4">
                    <span className="relative z-10">Login</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;