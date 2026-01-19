import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, X, Plus } from 'lucide-react';

const CreateShift = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        date: '',
        start_time: '',
        end_time: '',
        employee: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/auth/list/').then(res => setUsers(res.data)).catch(console.error);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/shifts/', formData);
            alert('Shift created successfully!');
            navigate('/manage-shifts');
        } catch (error) {
            console.error(error);
            alert('Failed to create shift.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Create New Shift</h2>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <Plus className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">Shift Details</h3>
                        <p className="text-sm text-gray-500">Fill in the information below to create a new shift</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Date Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <div className="flex items-center space-x-2">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <span>Date</span>
                                </div>
                            </label>
                            <input 
                                type="date" 
                                name="date" 
                                value={formData.date}
                                required 
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                            />
                        </div>

                        {/* Employee Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <div className="flex items-center space-x-2">
                                    <User className="w-4 h-4 text-gray-400" />
                                    <span>Assign to Employee</span>
                                </div>
                            </label>
                            <select 
                                name="employee" 
                                value={formData.employee}
                                required 
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white appearance-none cursor-pointer"
                            >
                                <option value="">Select an employee...</option>
                                {users.filter(u => u.role === 'employee').map(u => (
                                    <option key={u.id} value={u.id}>{u.username}</option>
                                ))}
                            </select>
                        </div>

                        {/* Start Time Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <div className="flex items-center space-x-2">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    <span>Start Time</span>
                                </div>
                            </label>
                            <input 
                                type="time" 
                                name="start_time" 
                                value={formData.start_time}
                                required 
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                            />
                        </div>

                        {/* End Time Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <div className="flex items-center space-x-2">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    <span>End Time</span>
                                </div>
                            </label>
                            <input 
                                type="time" 
                                name="end_time" 
                                value={formData.end_time}
                                required 
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
                        <button 
                            type="button" 
                            onClick={() => navigate('/manage-shifts')}
                            className="px-5 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Plus className="w-4 h-4" />
                            <span>{loading ? 'Creating...' : 'Create Shift'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateShift;
