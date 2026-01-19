import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '', // Added email
        password: '',
        role: 'employee',
    });
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            navigate('/');
        } catch (err) {
            // Check if backend provided a specific error message (e.g., manager limit)
             if (err.response && err.response.data && Array.isArray(err.response.data) && err.response.data.length > 0) {
                 setError(err.response.data[0]); // DRF sometimes returns list of errors
             } else if (err.response && err.response.data && err.response.data.non_field_errors) {
                setError(err.response.data.non_field_errors[0]);
             } else {
                setError('Registration failed. Username may be taken or manager already exists.');
             }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black px-4">
            <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
                
                {/* Logo and Title */}
                <div className="flex flex-col items-center mb-6">
                    <img src={logo} alt="WSMS Logo" className="w-16 h-16 rounded-xl mb-4 shadow-xl" />
                    <h1 className="text-3xl font-bold text-white text-center">
                        Register
                    </h1>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-500/20 text-red-200 text-sm p-3 rounded-lg mb-4 text-center">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-gray-200 mb-1">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-300"
                            placeholder="Enter username"
                        />
                    </div>

                    {/* Optional email field
                    <div>
                        <label className="block text-gray-200 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-300"
                            placeholder="Enter email"
                        />
                    </div> 
                    */}

                    <div>
                        <label className="block text-gray-200 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-300"
                            placeholder="Enter password"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-200 mb-1">Role</label>
                        <select 
                            name="role" 
                            value={formData.role} 
                            onChange={handleChange} 
                            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-300 [&>option]:bg-gray-800"
                        >
                            <option value="employee">Employee</option>
                            <option value="manager">Manager</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold hover:scale-[1.02] transition-transform duration-200 shadow-lg"
                    >
                        Register
                    </button>
                </form>

                {/* Footer */}
                <p className="text-center text-gray-200 text-sm mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-300 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
