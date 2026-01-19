import React, { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Calendar, Trash2, Plus, X, Clock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ManageShifts = () => {
    const [shifts, setShifts] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newShift, setNewShift] = useState({
        date: '',
        start_time: '',
        end_time: '',
        employee: ''
    });
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchShifts();
        fetchEmployees();
    }, []);

    const fetchShifts = async () => {
        try {
            const res = await api.get('/shifts/');
            setShifts(res.data);
        } catch (error) {
            console.error('Failed to fetch shifts', error);
        }
    };

    const fetchEmployees = async () => {
        try {
            const res = await api.get('/auth/list/');
            // Filter to show only employees (not managers)
            setEmployees(res.data.filter(u => u.role === 'employee'));
        } catch (error) {
            console.error('Failed to fetch employees', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this shift?')) return;
        try {
            await api.delete(`/shifts/${id}/`);
            setShifts(shifts.filter(s => s.id !== id));
        } catch (error) {
            console.error('Failed to delete shift', error);
            alert('Failed to delete shift.');
        }
    };

    const handleCreateShift = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/shifts/', newShift);
            setShowAddForm(false);
            setNewShift({ date: '', start_time: '', end_time: '', employee: '' });
            fetchShifts();
            alert('Shift created successfully!');
        } catch (error) {
            console.error('Failed to create shift', error);
            alert('Failed to create shift. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Manage Shifts</h2>
                <button 
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                    <Plus className="w-5 h-5" />
                    <span>Create Shift</span>
                </button>
            </div>

            {/* Create Shift Form */}
            {showAddForm && (
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">New Shift</h3>
                        <button onClick={() => setShowAddForm(false)} className="text-gray-500 hover:text-gray-700">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <form onSubmit={handleCreateShift} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <input 
                                    type="date" 
                                    value={newShift.date}
                                    onChange={(e) => setNewShift({...newShift, date: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                                <input 
                                    type="time" 
                                    value={newShift.start_time}
                                    onChange={(e) => setNewShift({...newShift, start_time: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                                <input 
                                    type="time" 
                                    value={newShift.end_time}
                                    onChange={(e) => setNewShift({...newShift, end_time: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Assign Employee</label>
                                <select 
                                    value={newShift.employee}
                                    onChange={(e) => setNewShift({...newShift, employee: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select Employee</option>
                                    {employees.map(emp => (
                                        <option key={emp.id} value={emp.id}>{emp.username}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                                Create Shift
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Shifts Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Time</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Assigned Employee</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {shifts.map(shift => (
                                <tr key={shift.id} className="hover:bg-blue-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-gray-900 font-medium">
                                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                                <Calendar className="w-4 h-4 text-blue-600" />
                                            </div>
                                            {new Date(shift.date).toLocaleDateString('en-GB', {
                                                weekday: 'short',
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-2">
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-700 font-medium">{shift.start_time}</span>
                                            <span className="text-gray-400">-</span>
                                            <span className="text-gray-700 font-medium">{shift.end_time}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                                {shift.employee_details?.username?.charAt(0)?.toUpperCase() || '?'}
                                            </div>
                                            <span className="px-3 py-1 text-sm font-semibold rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800">
                                                {shift.employee_details?.username || 'Unassigned'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <button 
                                            onClick={() => handleDelete(shift.id)}
                                            className="text-red-500 hover:text-red-700 transition-all p-2.5 hover:bg-red-100 rounded-lg group"
                                            title="Delete Shift"
                                        >
                                            <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {shifts.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-4">
                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                                <Calendar className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <div>
                                                <p className="text-gray-500 font-medium">No shifts found</p>
                                                <p className="text-gray-400 text-sm">Click "Create Shift" to add your first shift</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageShifts;
