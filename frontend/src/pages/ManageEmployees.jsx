import React, { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Users, Trash2, Plus, X } from 'lucide-react';

const ManageEmployees = () => {
    const [employees, setEmployees] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newEmployee, setNewEmployee] = useState({ username: '', password: '' });
    const { user } = useAuth();

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await api.get('/auth/list/');
            // Filter out the current user (manager) from the list if desired
            // or show all. Usually managers manage others.
            setEmployees(res.data.filter(emp => emp.id !== user.id)); 
        } catch (error) {
            console.error('Failed to fetch employees', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this employee?')) return;
        try {
            await api.delete(`/auth/delete/${id}/`);
            setEmployees(employees.filter(emp => emp.id !== id));
        } catch (error) {
            console.error('Failed to delete employee', error);
            alert('Failed to delete employee. Ensure you have permission.');
        }
    };

    const handleAddEmployee = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/create-employee/', {
                ...newEmployee,
                role: 'employee' // Force role to employee
            });
            setShowAddForm(false);
            setNewEmployee({ username: '', password: '' });
            fetchEmployees();
            alert('Employee created successfully');
        } catch (error) {
            console.error('Failed to create employee', error);
            alert('Failed to create employee. Username might be taken.');
        }
    };

    const handleDeleteSelf = async () => {
        if (!window.confirm('WARNING: Are you sure you want to delete YOUR Manager account? You will lose access immediately and registration for a new manager will be opened.')) return;
        
        const confirmText = prompt("To confirm, type 'DELETE' below:");
        if (confirmText !== 'DELETE') return;

        try {
            await api.delete('/auth/delete-manager/');
            alert('Manager account deleted. You will be logged out.');
            window.location.href = '/login'; // Force logout/redirect
        } catch (error) {
            console.error('Failed to delete manager account', error);
            alert('Failed to delete account.');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Manage Employees</h2>
                <button 
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Employee</span>
                </button>
            </div>

            {/* Add Employee Modal/Form */}
            {showAddForm && (
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">New Employee</h3>
                        <button onClick={() => setShowAddForm(false)} className="text-gray-500 hover:text-gray-700">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <form onSubmit={handleAddEmployee} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                <input 
                                    type="text" 
                                    value={newEmployee.username}
                                    onChange={(e) => setNewEmployee({...newEmployee, username: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input 
                                    type="password" 
                                    value={newEmployee.password}
                                    onChange={(e) => setNewEmployee({...newEmployee, password: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                                Create Account
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Employee List */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                {/* ... existing table code ... */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        {/* ... existing table content ... */}
                         <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Username</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {employees.map(emp => (
                                <tr key={emp.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold mr-3">
                                                {emp.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="font-medium text-gray-900">{emp.username}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            emp.role === 'manager' 
                                                ? 'bg-purple-100 text-purple-800' 
                                                : 'bg-blue-100 text-blue-800'
                                        }`}>
                                            {emp.role.charAt(0).toUpperCase() + emp.role.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                            Active
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <button 
                                            onClick={() => handleDelete(emp.id)}
                                            className="text-red-600 hover:text-red-900 transition-colors p-2 hover:bg-red-50 rounded-lg"
                                            title="Delete Employee"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {employees.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                        No employees found. Add one to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-red-800 mb-2">Danger Zone</h3>
                    <p className="text-red-600 mb-4 text-sm">
                        Deleting your manager account will remove your access. This action cannot be undone, 
                        but it will allow a new manager to register.
                    </p>
                    <button 
                        onClick={handleDeleteSelf}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center space-x-2"
                    >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete My Manager Account</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManageEmployees;
