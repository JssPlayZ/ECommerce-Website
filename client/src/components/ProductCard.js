import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/helpers';

const ProductCard = ({ product }) => {
    const { addToCart, wishlist, toggleWishlist, user } = useApp();
    const isWishlisted = wishlist.some(item => item._id === product._id);

    const handleWishlistClick = (e) => {
        e.preventDefault(); // Prevent link navigation
        e.stopPropagation(); // Stop event from bubbling up to the main link
        toggleWishlist(product._id);
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden flex flex-col transition-all duration-300 group border dark:border-slate-700 hover:shadow-lg hover:-translate-y-1 relative">
            {/* NEW: Wishlist button */}
            {user && (
                 <button 
                    onClick={handleWishlistClick}
                    className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm transition-colors duration-300"
                    aria-label="Toggle Wishlist"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-all duration-300 ${isWishlisted ? 'text-red-500' : 'text-slate-400 hover:text-red-500'}`} fill={isWishlisted ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 016.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
                    </svg>
                </button>
            )}
           
            <Link to={`/product/${product._id}`} className="h-56 w-full flex items-center justify-center p-4 bg-white cursor-pointer">
               <img src={product.image} alt={product.title} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300" />
            </Link>
            <div className="p-4 flex flex-col flex-grow">
                <Link to={`/product/${product._id}`}>
                    <h3 className="text-md font-semibold text-slate-800 dark:text-white truncate cursor-pointer group-hover:text-amber-500">{product.title}</h3>
                </Link>
                <p className="text-slate-600 dark:text-slate-300 mt-2 text-lg font-bold">{formatCurrency(product.price)}</p>
                <div className="mt-auto pt-4">
                  <button onClick={() => addToCart(product)} className="w-full bg-slate-800 text-white py-2 rounded-md hover:bg-slate-700 dark:bg-amber-500 dark:text-slate-900 dark:hover:bg-amber-600 transition active:scale-95 duration-200 font-bold text-sm">
                      Add to Cart
                  </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;