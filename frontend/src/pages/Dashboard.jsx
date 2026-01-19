import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Calendar, RefreshCw, CheckCircle } from 'lucide-react';
import api from '../api';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        upcomingShifts: 0,
        pendingSwaps: 0,
        approvedSwaps: 0
    });
    const [upcomingShiftsList, setUpcomingShiftsList] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [shiftsRes, swapsRes] = await Promise.all([
                api.get('/shifts/'),
                api.get('/swaps/')
            ]);

            const shifts = shiftsRes.data;
            const swaps = swapsRes.data;

            // Calculate stats
            // Upcoming shifts: shifts in the future (simplified: all assigned for now)
            // Filter logic can be refined based on dates if needed
            const myUpcoming = shifts; 
            
            const pending = swaps.filter(s => s.status === 'pending' || s.status === 'accepted').length;
            const approved = swaps.filter(s => s.status === 'approved').length;

            setStats({
                upcomingShifts: myUpcoming.length,
                pendingSwaps: pending,
                approvedSwaps: approved
            });

            // Get top 3 upcoming
            setUpcomingShiftsList(myUpcoming.slice(0, 3));

        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium">Upcoming Shifts</p>
                            <p className="text-3xl font-bold mt-2">{stats.upcomingShifts}</p>
                        </div>
                        <Calendar className="w-12 h-12 text-blue-200" />
                    </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm font-medium">Active Swaps</p>
                            <p className="text-3xl font-bold mt-2">{stats.pendingSwaps}</p>
                        </div>
                        <RefreshCw className="w-12 h-12 text-purple-200" />
                    </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm font-medium">Approved Swaps</p>
                            <p className="text-3xl font-bold mt-2">{stats.approvedSwaps}</p>
                        </div>
                        <CheckCircle className="w-12 h-12 text-green-200" />
                    </div>
                </div>
            </div>

            {user.role !== 'manager' && (
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Your Upcoming Shifts</h2>
                    <div className="space-y-3">
                        {upcomingShiftsList.length === 0 ? (
                            <p className="text-gray-500">No upcoming shifts scheduled.</p>
                        ) : (
                            upcomingShiftsList.map(shift => (
                                <div key={shift.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                                    <div>
                                        <p className="font-semibold text-gray-800">{new Date(shift.date).toLocaleDateString('en-GB')}</p>
                                        <p className="text-sm text-gray-600">{shift.start_time} - {shift.end_time}</p>
                                    </div>
                                    <span className="text-blue-600 font-medium text-sm">Assigned</span>
                                </div>
                            ))
                        )}
                        <Link to="/shifts" className="inline-block mt-2 text-blue-600 hover:text-blue-800 font-medium">View all shifts</Link>
                    </div>
                </div>
            )}
            
            {user.role === 'manager' && (
                 <div className="bg-white rounded-xl shadow-md p-6 mt-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Manager Actions</h2>
                    <div className="flex gap-4">
                        <Link to="/create-shift" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">Create New Shift</Link>
                        <Link to="/manage" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">Manage Shifts</Link>
                        <Link to="/manage-employees" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">Manage Employees</Link>
                    </div>
                 </div>
            )}
        </div>
    );
};

export default Dashboard;
