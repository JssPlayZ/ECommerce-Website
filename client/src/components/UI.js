import React from 'react';
import { useApp } from '../context/AppContext'; // Corrected: useApp hook

const ToastContainer = () => {
    const { toasts } = useApp(); // Corrected: useApp hook
    return (
        <div className="fixed top-5 right-5 z-[100] space-y-2">
            {toasts.map(toast => <Toast key={toast.id} {...toast} />)}
        </div>
    );
};

const Toast = ({ message, type, visible }) => {
    const bgColor = { success: 'bg-green-500', error: 'bg-red-500', info: 'bg-slate-600' }[type];
    return (
        <div className={`${bgColor} text-white p-4 rounded-md shadow-lg transition-all duration-500 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            {message}
        </div>
    );
};

const Spinner = () => ( <div className="flex justify-center items-center py-20"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500"></div></div> );

const Pagination = ({ pages, page, onPageChange }) => {
    if (pages <= 1) return null;
    return (
        <div className="flex justify-center items-center space-x-2 mt-8">
            {[...Array(pages).keys()].map(x => (
                <button 
                    key={x + 1}
                    onClick={() => onPageChange(x + 1)}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${page === x + 1 ? 'bg-slate-800 text-white dark:bg-amber-500 dark:text-slate-900' : 'bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                >
                    {x + 1}
                </button>
            ))}
        </div>
    );
};


export { ToastContainer, Toast, Spinner, Pagination };