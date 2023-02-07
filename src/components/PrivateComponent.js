import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateComponent = () => {
    const auth = localStorage.getItem('data');
    return auth?<Outlet />:<Navigate to="/register" />
}

export default PrivateComponent