import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Spinner } from './UI';
import AdminLayout from './AdminLayout';

const AdminProtectedRoute = () => {
    const { user, loading } = useApp();

    if (loading) {
        return <Spinner />;
    }

    // If user is an admin, render the AdminLayout which contains the sidebar and Outlet.
    // Otherwise, redirect to login.
    return user && user.isAdmin ? <AdminLayout /> : <Navigate to="/login" replace />;
};

export default AdminProtectedRoute;