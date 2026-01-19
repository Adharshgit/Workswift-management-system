import React, { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard.css';

const ShiftList = () => {
    const [shifts, setShifts] = useState([]);
    const [users, setUsers] = useState([]);
    const { user } = useAuth();
    const [swapTarget, setSwapTarget] = useState({});

    useEffect(() => {
        fetchShifts();
        fetchUsers();
    }, []);

    const fetchShifts = () => {
        api.get('/shifts/').then(res => setShifts(res.data)).catch(console.error);
    };

    const fetchUsers = () => {
        api.get('/auth/list/').then(res => {
            setUsers(res.data.filter(u => u.id !== user.id && u.role !== 'manager'));
        }).catch(console.error);
    };

    const handleSwapRequest = async (shiftId) => {
        const targetUserId = swapTarget[shiftId];
        if (!targetUserId) {
            alert('Please select a user to swap with.');
            return;
        }

        try {
            await api.post('/swaps/', {
                requesting_shift: shiftId,
                requested_employee: targetUserId
            });
            alert('Swap request sent!');
            setSwapTarget({ ...swapTarget, [shiftId]: '' });
        } catch (error) {
            console.error(error);
            alert('Failed to send request.');
        }
    };

    return (
        <div className="dashboard">
            <h2>{user.role === 'manager' ? 'All Shifts' : 'My Shifts'}</h2>
            <div className="dashboard-cards">
                {shifts.map(shift => (
                    <div className="card" key={shift.id}>
                        <h3>{new Date(shift.date).toLocaleDateString('en-GB')}</h3>
                        <p>{shift.start_time} - {shift.end_time}</p>
                        
                        {user.role === 'employee' && (
                            <div className="swap-action">
                                <select 
                                    value={swapTarget[shift.id] || ''} 
                                    onChange={(e) => setSwapTarget({...swapTarget, [shift.id]: e.target.value})}
                                    style={{padding: '5px', marginRight: '10px'}}
                                >
                                    <option value="">Select user</option>
                                    {users.map(u => (
                                        <option key={u.id} value={u.id}>{u.username}</option>
                                    ))}
                                </select>
                                <button 
                                    className="btn-link" 
                                    onClick={() => handleSwapRequest(shift.id)}
                                >
                                    Request Swap
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShiftList;
