import React, { useState, useEffect, createContext, useContext, useCallback } from 'react'; // Import useCallback
import axios from 'axios';
import { API_URL } from '../utils/helpers';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
    // States
    const [user, setUser] = useState(null);
    const [cart, setCart] = useState({ items: [] });
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
    const [toasts, setToasts] = useState([]);
    const [isCartAnimating, setIsCartAnimating] = useState(false);

    const showToast = useCallback((message, type = 'info') => {
        const id = Date.now();
        const newToast = { id, message, type, visible: true };
        setToasts(prev => [...prev, newToast]);
        setTimeout(() => {
            setToasts(prev => prev.map(t => t.id === id ? { ...t, visible: false } : t));
            setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 500);
        }, 3000);
    }, []);

    const toggleTheme = useCallback(() => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    }, []);

    const fetchCart = useCallback(async (token) => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get(`${API_URL}/cart`, config);
            setCart(data);
        } catch (error) { 
            console.error("Failed to fetch cart", error); 
        }
    }, []);

    const fetchWishlist = useCallback(async (token) => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get(`${API_URL}/user/wishlist`, config);
            setWishlist(data);
        } catch (error) { 
            console.error("Failed to fetch wishlist", error); 
        }
    }, []);

    const login = useCallback(async (userData) => {
        localStorage.setItem('userInfo', JSON.stringify(userData));
        setUser(userData);
        try {
            await fetchCart(userData.token);
            await fetchWishlist(userData.token);
        } catch (error) {
            console.error("Failed to fetch data on login", error);
        }
    }, [fetchCart, fetchWishlist]);

    const logout = useCallback(() => {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('profilePicture');
        setUser(null);
        setCart({ items: [] });
        setWishlist([]);
    }, []);
    
    const updateUser = useCallback((userData) => {
        localStorage.setItem('userInfo', JSON.stringify(userData));
        setUser(userData);
    }, []);

    const addToCart = useCallback(async (product) => {
        if (!user) { showToast('Please log in to add items.', 'error'); return; }
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.post(`${API_URL}/cart`, { productId: product._id, quantity: 1 }, config);
            setCart(data);
            showToast(`${product.title} added to cart!`, 'success');
            setIsCartAnimating(true);
            setTimeout(() => setIsCartAnimating(false), 500);
        } catch (error) { 
            console.error("Add to cart error:", error.response?.data?.message || error.message);
            showToast('Failed to add to cart.', 'error'); 
        }
    }, [user, showToast]);

    const removeFromCart = useCallback(async (productId) => {
        if (!user) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.delete(`${API_URL}/cart/${productId}`, config);
            setCart(data);
            showToast('Item removed from cart.', 'info');
        } catch (error) { showToast('Failed to remove item.', 'error'); }
    }, [user, showToast]);

    const handleCheckout = useCallback(async () => {
        if (!user) return false;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`${API_URL}/orders`, {}, config);
            setCart({ items: [] }); 
            showToast('Checkout successful!', 'success');
            return true;
        } catch (error) { showToast('Checkout failed.', 'error'); return false; }
    }, [user, showToast]);

    const toggleWishlist = useCallback(async (productId) => {
        if (!user) { showToast('Please log in to manage your wishlist.', 'error'); return; }
        
        const isWishlisted = wishlist.some(item => item._id === productId);
        const config = { headers: { Authorization: `Bearer ${user.token}` } };

        try {
            if (isWishlisted) {
                const { data } = await axios.delete(`${API_URL}/user/wishlist/${productId}`, config);
                setWishlist(data);
                showToast('Removed from wishlist.', 'info');
            } else {
                const { data } = await axios.post(`${API_URL}/user/wishlist`, { productId }, config);
                setWishlist(data);
                showToast('Added to wishlist!', 'success');
            }
        } catch (error) {
            showToast('Failed to update wishlist.', 'error');
        }
    }, [user, wishlist, showToast]);


    // --- Effects that run once on load ---
    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const parsedInfo = JSON.parse(userInfo);
            setUser(parsedInfo);
            fetchCart(parsedInfo.token);
            fetchWishlist(parsedInfo.token);
        }
        setLoading(false);
    }, [fetchCart, fetchWishlist]);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        localStorage.setItem('theme', theme);
    }, [theme]);
    
    // Memoize the context value
    const value = React.useMemo(() => ({
        user, cart, loading, login, logout, addToCart, removeFromCart, theme, toggleTheme, handleCheckout, toasts, isCartAnimating, showToast, updateUser, wishlist, toggleWishlist
    }), [user, cart, loading, login, logout, addToCart, removeFromCart, theme, toggleTheme, handleCheckout, toasts, isCartAnimating, showToast, updateUser, wishlist, toggleWishlist]);

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};