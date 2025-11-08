import React from 'react';
import { useApp } from '../context/AppContext'; 

const ToastContainer = () => {
    const { toasts } = useApp();
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

const Pagination = ({ pages, currentPage, onPageChange }) => {
    if (pages <= 1) return null;

    const pageNumbers = [];
    const maxPagesToShow = 5;
    const halfMaxPages = Math.floor(maxPagesToShow / 2);

    let startPage = Math.max(1, currentPage - halfMaxPages);
    let endPage = Math.min(pages, currentPage + halfMaxPages);

    // Adjust start/end if near the beginning or end
    if (currentPage <= halfMaxPages) {
        endPage = Math.min(pages, maxPagesToShow);
    }
    if (currentPage + halfMaxPages >= pages) {
        startPage = Math.max(1, pages - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    const buttonClass = (isActive) => 
        `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive 
            ? 'bg-slate-800 text-white dark:bg-amber-500 dark:text-slate-900 cursor-default' 
            : 'bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`;
    
    const ellipsisClass = "px-4 py-2 text-sm font-medium text-slate-500 dark:text-slate-400";

    return (
        <div className="flex justify-center items-center space-x-1 mt-8">
            {/* Previous Button */}
            <button 
                onClick={() => onPageChange(currentPage - 1)} 
                disabled={currentPage === 1}
                className={`${buttonClass(false)} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
                &lt;
            </button>

            {/* First Page & Ellipsis */}
            {startPage > 1 && (
                <>
                    <button onClick={() => onPageChange(1)} className={buttonClass(false)}>1</button>
                    {startPage > 2 && <span className={ellipsisClass}>...</span>}
                </>
            )}

            {/* Page Number Buttons */}
            {pageNumbers.map(number => (
                <button 
                    key={number}
                    onClick={() => onPageChange(number)}
                    className={buttonClass(currentPage === number)}
                    disabled={currentPage === number}
                >
                    {number}
                </button>
            ))}

             {/* Ellipsis & Last Page */}
            {endPage < pages && (
                <>
                    {endPage < pages - 1 && <span className={ellipsisClass}>...</span>}
                    <button onClick={() => onPageChange(pages)} className={buttonClass(false)}>{pages}</button>
                </>
            )}

            {/* Next Button */}
            <button 
                onClick={() => onPageChange(currentPage + 1)} 
                disabled={currentPage === pages}
                className={`${buttonClass(false)} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
                &gt;
            </button>
        </div>
    );
};


export { ToastContainer, Toast, Spinner, Pagination };