import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import axios from 'axios';
import { API_URL, formatCurrency } from '../../utils/helpers';
import { Spinner } from '../../components/UI';

const ProductListPage = () => {
    const { user, showToast } = useApp();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllProducts = async () => {
            setLoading(true);
            try {
                // CORRECTED: Call the new admin-only endpoint
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get(`${API_URL}/products/all`, config); 
                setProducts(data);
            } catch (error) {
                showToast(error.response?.data?.message || 'Could not fetch products', 'error');
            } finally {
                setLoading(false);
            }
        };

        if (user && user.isAdmin) {
            fetchAllProducts();
        }
    }, [user, showToast]);

    const createProductHandler = async () => {
        if (window.confirm('Are you sure you want to create a new sample product?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.post(`${API_URL}/products`, {}, config);
                showToast('Sample product created!', 'success');
                navigate(`/admin/product/${data._id}/edit`);
            } catch (error) {
                showToast(error.response?.data?.message || 'Product creation failed', 'error');
            }
        }
    };

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`${API_URL}/products/${id}`, config);
                showToast('Product deleted successfully', 'success');
                setProducts(products.filter((p) => p._id !== id));
            } catch (error) {
                showToast(error.response?.data?.message || 'Product deletion failed', 'error');
            }
        }
    };

    if (loading) return <Spinner />;

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Manage Products ({products.length})</h1>
                <button onClick={createProductHandler} className="bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-slate-700 dark:bg-amber-500 dark:text-slate-900 dark:hover:bg-amber-600 font-bold">
                    + Create Product
                </button>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-x-auto border dark:border-slate-700">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-100 dark:bg-slate-700">
                        <tr>
                            <th className="px-6 py-3 font-bold">ID</th>
                            <th className="px-6 py-3 font-bold">NAME</th>
                            <th className="px-6 py-3 font-bold">PRICE</th>
                            <th className="px-6 py-3 font-bold">CATEGORY</th>
                            <th className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product._id} className="border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                <td className="px-6 py-4 font-mono text-xs">{product._id}</td>
                                <td className="px-6 py-4 font-medium">{product.title}</td>
                                <td className="px-6 py-4">{formatCurrency(product.price)}</td>
                                <td className="px-6 py-4 capitalize">{product.category}</td>
                                <td className="px-6 py-4 flex gap-4">
                                    <Link to={`/admin/product/${product._id}/edit`} className="text-amber-500 hover:underline font-bold">Edit</Link>
                                    <button onClick={() => deleteHandler(product._id)} className="text-red-500 hover:underline font-bold">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductListPage;