import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useApp } from '../../context/AppContext';
import { API_URL } from '../../utils/helpers';
import { Spinner } from '../../components/UI';

const UserListPage = () => {
    const { user, showToast } = useApp();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`${API_URL}/user`, config);
            setUsers(data);
        } catch (error) {
            showToast(error.response?.data?.message || 'Could not fetch users', 'error');
        } finally {
            setLoading(false);
        }
    };

    // We need a stable reference for useEffect
    const stableShowToast = React.useCallback(showToast, []);

    useEffect(() => {
        if (user && user.isAdmin) {
            fetchUsers();
        }
    }, [user]);

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this user? This cannot be undone.')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`${API_URL}/user/${id}`, config);
                stableShowToast('User deleted successfully', 'success');
                fetchUsers(); // Re-fetch users after deletion
            } catch (error) {
                stableShowToast(error.response?.data?.message || 'User deletion failed', 'error');
            }
        }
    };

    const toggleAdminHandler = async (id) => {
         if (window.confirm('Are you sure you want to change this user\'s admin status?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.put(`${API_URL}/user/${id}/toggleadmin`, {}, config);
                stableShowToast('User admin status updated', 'success');
                fetchUsers(); // Re-fetch users to show updated status
            } catch (error) {
                stableShowToast(error.response?.data?.message || 'Failed to update admin status', 'error');
            }
        }
    };

    if (loading) return <Spinner />;

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Manage Users ({users.length})</h1>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-x-auto border dark:border-slate-700">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-100 dark:bg-slate-700">
                        <tr>
                            <th className="px-6 py-3 font-bold">ID</th>
                            <th className="px-6 py-3 font-bold">NAME</th>
                            <th className="px-6 py-3 font-bold">EMAIL</th>
                            <th className="px-6 py-3 font-bold">ADMIN</th>
                            <th className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u._id} className="border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                <td className="px-6 py-4 font-mono text-xs">{u._id}</td>
                                <td className="px-6 py-4 font-medium">{u.name}</td>
                                <td className="px-6 py-4">{u.email}</td>
                                <td className="px-6 py-4">
                                    {u.isAdmin ? (
                                        <span className="text-green-500 font-bold">Yes</span>
                                    ) : (
                                        <span className="text-slate-500">No</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 flex gap-4">
                                    <button onClick={() => toggleAdminHandler(u._id)} className="text-amber-500 hover:underline font-bold" disabled={u._id === user._id}>Toggle Admin</button>
                                    <button onClick={() => deleteHandler(u._id)} className="text-red-500 hover:underline font-bold" disabled={u.isAdmin}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserListPage;