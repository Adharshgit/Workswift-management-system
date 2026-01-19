import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.jpg';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <nav className="navbar">
            <div className="logo">
                <Link to="/">
                    <img src={logo} alt="WSMS Logo" className="logo-img" />
                    WSMS
                </Link>
            </div>
            <div className="nav-links">
                <Link to="/" className="nav-link">Dashboard</Link>
                <Link to="/shifts" className="nav-link">{user.role === 'manager' ? 'All Shifts' : 'My Shifts'}</Link>
                <Link to="/swaps" className="nav-link">Swaps</Link>
                {user.role === 'manager' && <Link to="/create-shift" className="nav-link">Create Shift</Link>}
            </div>
            <div className="user-info">
                <span>{user.username} <small>({user.role})</small></span>
                <button onClick={handleLogout} className="btn-logout">Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;
