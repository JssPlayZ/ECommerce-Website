import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import { Spinner } from '../components/UI';

const WishlistPage = () => {
    const { wishlist, loading } = useApp();

    if (loading) return <div className="py-20"><Spinner /></div>;

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Your Wishlist</h2>
            {wishlist.length === 0 ? (
                <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-lg shadow-sm border dark:border-slate-700">
                    <p className="text-slate-500 dark:text-slate-400 mb-4">You haven't added any items to your wishlist yet.</p>
                    <Link 
                        to="/"
                        className="bg-slate-800 text-white px-6 py-2 rounded-md hover:bg-slate-700 dark:bg-amber-500 dark:text-slate-900 dark:hover:bg-amber-600 transition active:scale-95 font-bold"
                    >
                        Explore Products
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {wishlist.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default WishlistPage;