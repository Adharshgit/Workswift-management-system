import React, { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Users, CheckCircle, XCircle } from 'lucide-react';
// import '../styles/Dashboard.css';

const SwapRequests = () => {
    const [swaps, setSwaps] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        fetchSwaps();
    }, []);

    const fetchSwaps = () => {
        api.get('/swaps/').then(res => setSwaps(res.data)).catch(console.error);
    };

    const handleAction = async (id, action) => {
        try {
            await api.post(`/swaps/${id}/${action}/`);
            fetchSwaps();
            alert(`Swap ${action}ed!`); // simple feedback
        } catch (error) {
            console.error(error);
            alert(`Failed to ${action} swap.`);
        }
    };

    const StatusBadge = ({ status }) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            accepted: 'bg-green-100 text-green-800 border-green-300',
            approved: 'bg-green-100 text-green-800 border-green-300',
            rejected: 'bg-red-100 text-red-800 border-red-300',
        };
        // Normalize status to match keys (e.g., 'approved' vs 'accepted')
        const normalizedStatus = status === 'approved' ? 'approved' : status === 'accepted' ? 'accepted' : status === 'rejected' ? 'rejected' : 'pending';
        
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[normalizedStatus]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Swap Requests</h2>
            <div className="space-y-4">
                {swaps.length === 0 && <p className="text-gray-500">No active swap requests.</p>}
                {swaps.map(swap => (
                    <div key={swap.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                    <Users className="w-5 h-5 text-gray-600" />
                                    <p className="font-semibold text-gray-800">
                                        From: {swap.requesting_employee_details?.username} <span className="mx-2 text-gray-400">→</span> To: {swap.requested_employee_details?.username}
                                    </p>
                                </div>
                                <p className="text-sm text-gray-600 ml-8">
                                    {new Date(swap.requesting_shift_details?.date).toLocaleDateString('en-GB')} ({swap.requesting_shift_details?.start_time})
                                </p>
                                <div className="mt-3 ml-8">
                                    <StatusBadge status={swap.status} />
                                </div>
                            </div>
                            
                            <div className="flex space-x-2 ml-4">
                                {/* Target Employee Actions */}
                                {user.id === swap.requested_employee && swap.status === 'pending' && (
                                    <>
                                        <button 
                                            onClick={() => handleAction(swap.id, 'accept')}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center space-x-1"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            <span>Accept</span>
                                        </button>
                                        <button 
                                            onClick={() => handleAction(swap.id, 'reject')}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center space-x-1"
                                        >
                                            <XCircle className="w-4 h-4" />
                                            <span>Decline</span>
                                        </button>
                                    </>
                                )}

                                {/* Manager Actions */}
                                {user.role === 'manager' && swap.status === 'accepted' && (
                                    <>
                                        <button 
                                            onClick={() => handleAction(swap.id, 'approve')}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center space-x-1"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            <span>Approve</span>
                                        </button>
                                        <button 
                                            onClick={() => handleAction(swap.id, 'reject')}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center space-x-1"
                                        >
                                            <XCircle className="w-4 h-4" />
                                            <span>Reject</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SwapRequests;
