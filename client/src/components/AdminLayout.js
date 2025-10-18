import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
    return (
        <div className="flex min-h-screen bg-slate-100 dark:bg-slate-900">
            <AdminSidebar />
            <main className="flex-grow p-8">
                <Outlet /> {/* This is where the specific admin page content will be rendered */}
            </main>
        </div>
    );
};

export default AdminLayout;