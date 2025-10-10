import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext'; // Corrected: useApp hook
import { API_URL, formatCurrency } from '../utils/helpers';
import { Spinner } from '../components/UI';

const OrderHistoryPage = () => {
    const { user } = useApp(); // Corrected: useApp hook
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) { setLoading(false); return; }
        const fetchOrders = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get(`${API_URL}/orders`, config);
                setOrders(data);
            } catch (error) { console.error("Failed to fetch orders", error); } 
            finally { setLoading(false); }
        };
        fetchOrders();
    }, [user]);
    
    if (loading) return <div className="py-20"><Spinner /></div>;

    return (
         <div className="container mx-auto p-4 md:p-8">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg max-w-4xl mx-auto border dark:border-slate-700">
                <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Your Orders</h2>
                {orders.length === 0 ? (<p className="text-slate-500">You haven't placed any orders yet.</p>) : (
                    <div className="space-y-6">
                        {orders.map(order => (
                            <div key={order._id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                                <div className="flex flex-wrap justify-between items-center mb-4 pb-2 border-b border-slate-200 dark:border-slate-700 gap-2">
                                    <div>
                                        <p className="font-semibold text-sm">ORDER ID: <span className="font-normal text-slate-600 dark:text-slate-400">{order._id}</span></p>
                                        <p className="font-semibold text-sm">DATE: <span className="font-normal text-slate-600 dark:text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</span></p>
                                    </div>
                                    <p className="font-bold text-lg text-slate-900 dark:text-white">Total: {formatCurrency(order.totalPrice)}</p>
                                </div>
                                <div className="space-y-3">
                                    {order.products.map(product => (
                                        <div key={product.productId} className="flex items-center space-x-4 text-sm">
                                            <img src={product.image} alt={product.title} className="w-12 h-12 object-contain rounded bg-white p-1 border dark:border-slate-600" />
                                            <p className="flex-grow text-slate-700 dark:text-slate-300">{product.title} <span className="text-slate-500 dark:text-slate-400">(x{product.quantity})</span></p>
                                            <p className="font-medium text-slate-800 dark:text-slate-200">{formatCurrency(product.price * product.quantity)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistoryPage;