import React from 'react';
import { NavLink } from 'react-router-dom';

// Icons
const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const ProductsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.975 5.975 0 0112 13a5.975 5.975 0 013 1.197M15 21a9 9 0 00-9-5.197" /></svg>;

const AdminSidebar = () => {
    const activeLink = "bg-slate-700 text-white";
    const normalLink = "text-slate-300 hover:bg-slate-700 hover:text-white";
    const linkClass = ({ isActive }) => `flex items-center gap-3 p-3 rounded-md transition-colors ${isActive ? activeLink : normalLink}`;

    return (
        <div className="w-64 bg-slate-800 flex-col p-4 hidden md:flex">
            <div className="text-2xl font-bold mb-8 text-center text-white">
                Admin Panel
            </div>
            <nav className="flex flex-col gap-2">
                <NavLink to="/admin/dashboard" className={linkClass}>
                    <DashboardIcon /> Dashboard
                </NavLink>
                <NavLink to="/admin/productlist" className={linkClass}>
                    <ProductsIcon /> Manage Products
                </NavLink>
                <NavLink to="/admin/userlist" className={linkClass}>
                    <UsersIcon /> Manage Users
                </NavLink>
                <NavLink to="/admin/orderlist" className={linkClass}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                    Manage Orders
                </NavLink>
            </nav>
        </div>
    );
};

export default AdminSidebar;