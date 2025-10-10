import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Navbar = () => {
    const { user, logout, cart, theme, toggleTheme, isCartAnimating, wishlist } = useApp();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const cartItemCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setDropdownOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    const handleLogout = () => { logout(); setDropdownOpen(false); };
    const closeDropdown = () => setDropdownOpen(false);

    return (
        <header className="bg-white/80 dark:bg-slate-900/80 shadow-sm sticky top-0 z-50 backdrop-blur-lg transition-colors duration-300">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-slate-900 dark:text-white">
                    MERN<span className="text-amber-500">Shop</span>
                </Link>
                <div className="flex items-center space-x-2 sm:space-x-4">
                    {user ? (
                        <>
                            <Link to="/wishlist" className="relative text-slate-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 p-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 016.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" /></svg>
                                {wishlist.length > 0 && <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">{wishlist.length}</span>}
                            </Link>
                            <Link to="/cart" className={`relative text-slate-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 transition-transform duration-300 p-2 ${isCartAnimating ? 'transform scale-125' : ''}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                {cartItemCount > 0 && <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">{cartItemCount}</span>}
                            </Link>
                            <div className="relative" ref={dropdownRef}>
                                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center text-slate-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 font-medium">
                                    <span>Hi, {user.name}</span>
                                    <svg className={`w-4 h-4 ml-1 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </button>
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 z-20 border dark:border-slate-700">
                                        <Link to="/profile" onClick={closeDropdown} className="w-full text-left block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">Profile</Link>
                                        <Link to="/orders" onClick={closeDropdown} className="w-full text-left block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">My Orders</Link>
                                        
                                        {user.isAdmin && (
                                            <>
                                                <div className="border-t border-slate-200 dark:border-slate-700 my-1"></div>
                                                <Link to="/admin/productlist" onClick={closeDropdown} className="w-full text-left block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">Manage Products</Link>
                                            </>
                                        )}

                                        <div className="border-t border-slate-200 dark:border-slate-700 my-1"></div>
                                        <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">Logout</button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-slate-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 font-medium transition-colors">Login</Link>
                            <Link to="/signup" className="bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-slate-700 dark:bg-amber-500 dark:hover:bg-amber-600 transition active:scale-95 text-sm font-bold">Sign Up</Link>
                        </>
                    )}
                     <button onClick={toggleTheme} className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400">
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;