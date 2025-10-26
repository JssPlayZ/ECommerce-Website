import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useApp } from '../../context/AppContext';
import { API_URL, formatCurrency } from '../../utils/helpers';
import { Spinner } from '../../components/UI';
// --- NEW: Import Recharts components ---
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Icon Components for Stat Cards
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.975 5.975 0 0112 13a5.975 5.975 0 013 1.197M15 21a9 9 0 00-9-5.197" /></svg>;
const ProductsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>;
const OrdersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const RevenueIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>;


const DashboardPage = () => {
    const { user, showToast } = useApp();
    const [stats, setStats] = useState(null);
    const [salesData, setSalesData] = useState([]); // <-- NEW state for chart data
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                // Fetch both stats and sales data
                const [statsRes, salesRes] = await Promise.all([
                    axios.get(`${API_URL}/admin/stats`, config),
                    axios.get(`${API_URL}/admin/sales-data`, config) // <-- Fetch sales data
                ]);
                setStats(statsRes.data);
                setSalesData(salesRes.data); // <-- Set sales data state
            } catch (error) {
                showToast(error.response?.data?.message || 'Could not fetch dashboard data', 'error');
            } finally {
                setLoading(false);
            }
        };

        if (user && user.isAdmin) {
            fetchDashboardData();
        }
    }, [user, showToast]);

    if (loading) return <Spinner />;
    if (!stats) return <div className="p-8 text-red-500">Could not load dashboard data.</div>;

    const statCards = [
        { title: 'Total Users', value: stats.users, icon: <UsersIcon />, color: 'from-blue-500 to-blue-600', link: '/admin/userlist' },
        { title: 'Total Products', value: stats.products, icon: <ProductsIcon />, color: 'from-green-500 to-green-600', link: '/admin/productlist' },
        { title: 'Total Orders', value: stats.orders, icon: <OrdersIcon />, color: 'from-amber-500 to-amber-600', link: '/admin/orderlist' }, // Link to future order list
        { title: 'Total Revenue', value: formatCurrency(stats.revenue), icon: <RevenueIcon />, color: 'from-red-500 to-red-600', link: '#' }, // No link for revenue yet
    ];

    const customTooltipFormatter = (value, name, props) => {
        if (name === 'Daily Revenue') {
            return [formatCurrency(value), name];
        }
        if (name === 'Orders') {
            return [value, name]; // Just show the count for orders
        }
        return [value, name];
    };

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Admin Dashboard</h1>

            {/* Stat Cards */}
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

            {/* NEW: Sales Chart Section */}
            <div className="mt-8 p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg border dark:border-slate-700">
                <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Sales Trend (Last 30 Days)</h2>
                {salesData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                            <XAxis dataKey="date" stroke="currentColor" />
                            {/* Left Y Axis for Revenue */}
                            <YAxis
                                yAxisId="left"
                                stroke="#f59e0b"
                                tickFormatter={(value) => `₹${value / 1000}k`} // Format as thousands
                            />
                            {/* --- NEW: Right Y Axis for Order Count --- */}
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                stroke="#8884d8"
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'rgba(51, 65, 85, 0.9)', border: 'none', borderRadius: '0.5rem', color: '#fff' }}
                                itemStyle={{ color: '#ddd' }}
                                labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                                formatter={customTooltipFormatter} // <-- Use custom formatter
                            />
                            <Legend />
                            <Line
                                yAxisId="left" // Plot against left axis
                                type="monotone"
                                dataKey="totalSales"
                                stroke="#f59e0b" // Amber color
                                strokeWidth={2}
                                activeDot={{ r: 8 }}
                                name="Daily Revenue"
                            />
                            <Line
                                yAxisId="right" // <-- Plot against right axis
                                type="monotone"
                                dataKey="count"
                                stroke="#8884d8" // Purple color
                                strokeWidth={2}
                                name="Orders"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-slate-500 dark:text-slate-400">No sales data available for the last 30 days.</p>
                )}
            </div>

            {/* Welcome Message */}
            <div className="mt-8 p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg border dark:border-slate-700">
                <h2 className="text-2xl font-bold mb-4">Welcome, {user.name}!</h2>
                <p className="text-slate-600 dark:text-slate-300">
                    This is your central command center. Use the sidebar navigation to manage products, users, and orders.
                </p>
            </div>
        </div>
    );
};

export default DashboardPage;