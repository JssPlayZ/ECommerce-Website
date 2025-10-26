import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/helpers';
import { Spinner } from '../components/UI';

const CartPage = () => {
    const { cart, removeFromCart, loading, handleCheckout } = useApp();
    const navigate = useNavigate(); // Get the navigate function

    const onCheckout = async () => {
        // Just call handleCheckout and navigate if it succeeds
        const checkoutSuccess = await handleCheckout();
        if (checkoutSuccess) {
            navigate('/orders'); // Navigate after successful checkout
        }
    };

    if (loading) return <div className="py-20"><Spinner /></div>;
    const subtotal = cart.items.reduce((acc, item) => acc + item.quantity * item.price, 0);

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg max-w-4xl mx-auto border dark:border-slate-700">
                <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Your Shopping Cart</h2>
                {cart.items.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-slate-500 dark:text-slate-400 mb-4">Your cart is currently empty. Time to start shopping!</p>
                        <Link
                            to="/"
                            className="bg-slate-800 text-white px-6 py-2 rounded-md hover:bg-slate-700 dark:bg-amber-500 dark:text-slate-900 dark:hover:bg-amber-600 transition active:scale-95 font-bold"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div>
                        <div className="divide-y divide-slate-200 dark:divide-slate-700">
                        {cart.items.map(item => ( <div key={item.productId} className="flex items-center justify-between py-4"> <div className="flex items-center space-x-4"> <img src={item.image} alt={item.title} className="w-20 h-20 object-contain rounded bg-white p-1 border dark:border-slate-600"/> <div> <h3 className="font-semibold text-slate-800 dark:text-white">{item.title}</h3> <p className="text-slate-500 dark:text-slate-400 text-sm">{formatCurrency(item.price)} x {item.quantity}</p> </div> </div> <div className="flex items-center space-x-4"> <p className="font-semibold text-lg text-slate-800 dark:text-white">{formatCurrency(item.price * item.quantity)}</p> <button onClick={() => removeFromCart(item.productId)} className="text-slate-500 hover:text-red-500 transition"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button> </div> </div> ))}
                        </div>
                        <div className="mt-6 pt-4 border-t dark:border-slate-700 text-right">
                            <p className="text-xl font-bold text-slate-900 dark:text-white">Subtotal: {formatCurrency(subtotal)}</p>
                            <button onClick={onCheckout} className="mt-4 bg-slate-800 text-white px-8 py-3 rounded-md hover:bg-slate-700 dark:bg-amber-500 dark:text-slate-900 dark:hover:bg-amber-600 transition active:scale-95 font-bold">Proceed to Checkout</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;