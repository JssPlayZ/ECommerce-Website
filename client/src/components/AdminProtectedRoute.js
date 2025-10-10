import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Spinner } from './UI';

const AdminProtectedRoute = () => {
    const { user, loading } = useApp();

    if (loading) {
        return <Spinner />;
    }

    return user && user.isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AdminProtectedRoute;