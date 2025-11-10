import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import axios from 'axios';
import { API_URL, formatCurrency } from '../../utils/helpers';
import { Spinner, Pagination } from '../../components/UI';

const ProductListPage = () => {
    const { user, showToast } = useApp();
    const navigate = useNavigate();
    
    const [products, setProducts] = useState([]);
    const [pages, setPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const searchTerm = searchParams.get('search') || '';
    
    const limitOptions = [10, 25, 50];

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`${API_URL}/products`, {
                params: { 
                    page,
                    limit,
                    search: searchTerm 
                },
                config
            });
            setProducts(data.products);
            setPages(data.pages);
        } catch (error) {
            setError('Could not fetch products');
            showToast(error.response?.data?.message || 'Could not fetch products', 'error');
        } finally {
            setLoading(false);
        }
    }, [user, page, limit, searchTerm, showToast]);

    useEffect(() => {
        if (user && user.isAdmin) {
            const debounceTimer = setTimeout(() => {
                fetchProducts();
            }, 1000); // 1000ms delay

            return () => clearTimeout(debounceTimer);
        }
    }, [user, fetchProducts]);

    const updateSearchParams = (key, value) => {
        const newSearchParams = new URLSearchParams(searchParams);
        if (key === 'page' && value === 1) newSearchParams.delete('page');
        else if (key === 'limit' && value === 10) newSearchParams.delete('limit');
        else if (key === 'search' && value === '') newSearchParams.delete('search');
        else newSearchParams.set(key, value);

        if (key !== 'page') newSearchParams.delete('page'); // Reset to page 1 on filter change
        setSearchParams(newSearchParams);
    };

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
                fetchProducts(); // Re-fetch the current page of products
            } catch (error) {
                showToast(error.response?.data?.message || 'Product deletion failed', 'error');
            }
        }
    };

    return (
        <div className="p-4 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Manage Products</h1>
                <button onClick={createProductHandler} className="bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-slate-700 dark:bg-amber-500 dark:text-slate-900 dark:hover:bg-amber-600 font-bold w-full md:w-auto">
                    + Create Product
                </button>
            </div>

            <div className="mb-4 p-4 bg-white dark:bg-slate-800/50 rounded-lg shadow-sm flex flex-col md:flex-row gap-4 border dark:border-slate-700">
                <div className="relative flex-grow">
                    <input 
                        type="text" 
                        placeholder="Search by product name..." 
                        value={searchTerm}
                        onChange={(e) => updateSearchParams('search', e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 focus:ring-amber-500 focus:border-amber-500"
                    />
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <div className="relative">
                    <select 
                        value={limit} 
                        onChange={(e) => updateSearchParams('limit', parseInt(e.target.value, 10))}
                        className="appearance-none w-full md:w-auto pl-3 pr-8 py-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 font-medium focus:ring-amber-500 focus:border-amber-500"
                    >
                        {limitOptions.map(opt => (
                            <option key={opt} value={opt}>Show: {opt}</option>
                        ))}
                    </select>
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
            </div>

            {loading ? <Spinner /> : error ? <div className="text-center text-red-500">{error}</div> : (
                <>
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
                    <Pagination pages={pages} currentPage={page} onPageChange={(p) => updateSearchParams('page', p)} />
                </>
            )}
        </div>
    );
};

export default ProductListPage;