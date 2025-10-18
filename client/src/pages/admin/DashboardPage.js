import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useApp } from '../../context/AppContext';
import { API_URL, formatCurrency } from '../../utils/helpers';
import { Spinner } from '../../components/UI';

// Icon Components for Stat Cards
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.975 5.975 0 0112 13a5.975 5.975 0 013 1.197M15 21a9 9 0 00-9-5.197" /></svg>;
const ProductsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>;
const OrdersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const RevenueIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>;


const DashboardPage = () => {
    const { user, showToast } = useApp();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get(`${API_URL}/admin/stats`, config);
                setStats(data);
            } catch (error) {
                showToast(error.response?.data?.message || 'Could not fetch dashboard stats', 'error');
            } finally {
                setLoading(false);
            }
        };

        if(user && user.isAdmin) {
            fetchStats();
        }
    }, [user, showToast]);

    if (loading) return <Spinner />;
    if (!stats) return <div className="p-8">Could not load dashboard data.</div>;

    const statCards = [
        { title: 'Total Users', value: stats.users, icon: <UsersIcon />, color: 'from-blue-500 to-blue-600', link: '/admin/userlist' },
        { title: 'Total Products', value: stats.products, icon: <ProductsIcon />, color: 'from-green-500 to-green-600', link: '/admin/productlist' },
        { title: 'Total Orders', value: stats.orders, icon: <OrdersIcon />, color: 'from-amber-500 to-amber-600', link: '#' },
        { title: 'Total Revenue', value: formatCurrency(stats.revenue), icon: <RevenueIcon />, color: 'from-red-500 to-red-600', link: '#' },
    ];

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => (
                    <Link to={stat.link} key={stat.title} className={`bg-gradient-to-br ${stat.color} p-6 rounded-lg shadow-lg text-white hover:scale-105 transition-transform duration-300 flex items-center justify-between`}>
                        <div>
                            <h3 className="text-lg font-semibold uppercase tracking-wider">{stat.title}</h3>
                            <p className="text-4xl font-bold mt-2">{stat.value}</p>
                        </div>
                        <div className="opacity-50">
                            {stat.icon}
                        </div>
                    </Link>
                ))}
            </div>
             <div className="mt-8 p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg border dark:border-slate-700">
                 <h2 className="text-2xl font-bold mb-4">Welcome, {user.name}!</h2>
                 <p className="text-slate-600 dark:text-slate-300">
                     This is your central command center. Use the sidebar navigation to manage all aspects of your store. Live analytics and order management features are coming soon.
                 </p>
            </div>
        </div>
    );
};

export default DashboardPage;