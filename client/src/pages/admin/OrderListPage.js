import React, { useState, useEffect, useCallback } from 'react'; // Import useCallback
import axios from 'axios';
import { useApp } from '../../context/AppContext';
import { API_URL, formatCurrency } from '../../utils/helpers';
import { Spinner } from '../../components/UI';

const OrderListPage = () => {
    const { user, showToast } = useApp();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Wrap fetchOrders in useCallback
    const fetchOrders = useCallback(async () => {
        if (!user || !user.isAdmin) return; // Guard clause
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`${API_URL}/admin/orders`, config);
            setOrders(data);
        } catch (error) {
            showToast(error.response?.data?.message || 'Could not fetch orders', 'error');
        } finally {
            setLoading(false);
        }
    }, [user, showToast]); // Add dependencies

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]); // Now useEffect depends on the stable fetchOrders function

    const markDeliveredHandler = async (orderId) => {
        if (window.confirm('Are you sure you want to mark this order as delivered?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.put(`${API_URL}/admin/orders/${orderId}/deliver`, {}, config);
                showToast('Order marked as delivered!', 'success');
                fetchOrders(); // Refresh the list
            } catch (error) {
                showToast(error.response?.data?.message || 'Failed to update order', 'error');
            }
        }
    };

    if (loading) return <Spinner />;

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Manage Orders ({orders.length})</h1>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-x-auto border dark:border-slate-700">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-100 dark:bg-slate-700">
                        <tr>
                            <th className="px-6 py-3 font-bold">ID</th>
                            <th className="px-6 py-3 font-bold">USER</th>
                            <th className="px-6 py-3 font-bold">DATE</th>
                            <th className="px-6 py-3 font-bold">TOTAL</th>
                            <th className="px-6 py-3 font-bold">DELIVERED</th>
                            <th className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id} className="border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                <td className="px-6 py-4 font-mono text-xs">{order._id}</td>
                                <td className="px-6 py-4 font-medium">{order.user?.name || 'Deleted User'}</td>
                                <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4 font-bold">{formatCurrency(order.totalPrice)}</td>
                                <td className="px-6 py-4">
                                    {order.isDelivered ? (
                                        <span className="text-green-500 font-bold">Delivered on {new Date(order.deliveredAt).toLocaleDateString()}</span>
                                    ) : (
                                        <span className="text-red-500 font-bold">Not Delivered</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    {!order.isDelivered && (
                                        <button onClick={() => markDeliveredHandler(order._id)} className="text-green-500 hover:underline font-bold">
                                            Mark as Delivered
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderListPage;