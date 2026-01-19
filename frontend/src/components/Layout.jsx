import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';
import { Calendar, RefreshCw, Users, LogOut, Menu, X } from 'lucide-react';

const Layout = () => {
    const { user, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();

    // Helper to check if link is active
    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button 
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                            >
                                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                            <div className="flex items-center space-x-3">
                                <img src={logo} alt="WSMS Logo" className="w-15" />
                                <h1 className="text-xl md:text-2xl fontfamily baron text-gray-800">Work Shift Management System</h1>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-gray-800">{user?.username || 'User'}</p>
                                <p className="text-xs text-gray-500 capitalize">{user?.role || 'Employee'}</p>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                                {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out`}>
                    <nav className="p-4 space-y-2 mt-4 h-full flex flex-col">
                        <Link
                            to="/dashboard"
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                isActive('/dashboard') 
                                    ? 'bg-blue-50 text-blue-700 font-semibold' 
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            <Calendar className="w-5 h-5" />
                            <span>Dashboard</span>
                        </Link>
                        
                        <Link
                            to="/swaps"
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                isActive('/swaps') 
                                    ? 'bg-blue-50 text-blue-700 font-semibold' 
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            <RefreshCw className="w-5 h-5" />
                            <span>Swap Requests</span>
                        </Link>
                        
                        {user?.role === 'manager' && (
                            <>
                                <Link
                                    to="/manage-employees"
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                        isActive('/manage-employees') 
                                            ? 'bg-blue-50 text-blue-700 font-semibold' 
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <Users className="w-5 h-5" />
                                    <span>Employees</span>
                                </Link>
                                <Link
                                    to="/manage" // This might be renamed to manage-shifts later
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                        isActive('/manage') 
                                            ? 'bg-blue-50 text-blue-700 font-semibold' 
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <Calendar className="w-5 h-5" /> 
                                    {/* Using Calendar icon for shifts management for now, could be diff icon */}
                                    <span>Manage Shifts</span>
                                </Link>
                            </>
                        )}
                        
                        <div className="mt-auto pt-4 border-t border-gray-200 mb-20 lg:mb-0">
                            <button 
                                onClick={logout}
                                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-4 lg:p-8 overflow-y-auto w-full">
                    <div className="max-w-7xl mx-auto pb-20 lg:pb-0">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
