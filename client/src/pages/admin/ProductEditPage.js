import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useApp } from '../../context/AppContext';
import { API_URL } from '../../utils/helpers';
import { Spinner } from '../../components/UI';

const ProductEditPage = () => {
    const { id: productId } = useParams();
    const navigate = useNavigate();
    const { user, showToast } = useApp();

    const [title, setTitle] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get(`${API_URL}/products/${productId}`);
                setTitle(data.title);
                setPrice(data.price);
                setImage(data.image);
                setCategory(data.category);
                setDescription(data.description);
            } catch (error) {
                showToast('Could not fetch product details', 'error');
                navigate('/admin/productlist');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId, showToast, navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`${API_URL}/products/${productId}`, { title, price, image, category, description }, config);
            showToast('Product updated successfully!', 'success');
            navigate('/admin/productlist');
        } catch (error) {
            showToast(error.response?.data?.message || 'Product update failed', 'error');
        }
    };
    
    if (loading) return <Spinner />;

    return (
        <div className="container mx-auto p-4 md:p-8">
            <Link to="/admin/productlist" className="mb-6 inline-block bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-4 py-2 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition active:scale-95 text-sm font-medium">
                &larr; Go Back
            </Link>
            <div className="max-w-lg mx-auto bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg border dark:border-slate-700">
                <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
                <form onSubmit={submitHandler} className="space-y-4">
                    <div>
                        <label className="block text-slate-700 dark:text-slate-300 mb-2 font-medium">Title</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-zinc-50 dark:bg-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"/>
                    </div>
                    <div>
                        <label className="block text-slate-700 dark:text-slate-300 mb-2 font-medium">Price</label>
                        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-zinc-50 dark:bg-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"/>
                    </div>
                    <div>
                        <label className="block text-slate-700 dark:text-slate-300 mb-2 font-medium">Image URL</label>
                        <input type="text" value={image} onChange={(e) => setImage(e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-zinc-50 dark:bg-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"/>
                    </div>
                    <div>
                        <label className="block text-slate-700 dark:text-slate-300 mb-2 font-medium">Category</label>
                        <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-zinc-50 dark:bg-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"/>
                    </div>
                    <div>
                        <label className="block text-slate-700 dark:text-slate-300 mb-2 font-medium">Description</label>
                        <textarea rows="4" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-zinc-50 dark:bg-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"/>
                    </div>
                    <button type="submit" className="w-full bg-slate-800 text-white py-3 rounded-md hover:bg-slate-700 dark:bg-amber-500 dark:text-slate-900 dark:hover:bg-amber-600 transition font-bold active:scale-95">Update Product</button>
                </form>
            </div>
        </div>
    );
};

export default ProductEditPage;