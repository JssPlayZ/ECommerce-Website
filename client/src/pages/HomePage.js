import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../utils/helpers';
import { Spinner, Pagination } from '../components/UI';
import ProductCard from '../components/ProductCard';
import Hero from '../components/Hero';

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [pages, setPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [searchParams, setSearchParams] = useSearchParams();
    
    // Read state from URL or set defaults
    const page = Number(searchParams.get('page')) || 1;
    const searchTerm = searchParams.get('search') || '';
    const category = searchParams.get('category') || 'all';
    const sortBy = searchParams.get('sort') || 'latest';
    const limit = Number(searchParams.get('limit')) || 8; 

    const categories = ["all", "electronics", "jewelery", "men's clothing", "women's clothing"];
    const limitOptions = [8, 12, 16]; 

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get(`${API_URL}/products`, {
                    params: { 
                        page,
                        search: searchTerm, 
                        category,
                        sort: sortBy,
                        limit 
                    }
                });
                setProducts(data.products);
                setPages(data.pages);
            } catch (err) { 
                setError('Failed to load products.'); 
            } finally { 
                setLoading(false); 
            }
        };

        // Debounce the fetch call
        const debounceFetch = setTimeout(fetchProducts, 300);
        // Cleanup function to clear the timeout if dependencies change before 300ms
        return () => clearTimeout(debounceFetch);

    // CORRECTED: Added all dependencies derived from searchParams
    }, [page, searchTerm, category, sortBy, limit, searchParams]); 

    const updateSearchParams = (key, value) => {
        const newSearchParams = new URLSearchParams(searchParams);
        
        // Handle defaults: remove param if it matches default
        if (key === 'page' && value === 1) newSearchParams.delete('page');
        else if (key === 'search' && value === '') newSearchParams.delete('search');
        else if (key === 'category' && value === 'all') newSearchParams.delete('category');
        else if (key === 'sort' && value === 'latest') newSearchParams.delete('sort');
        else if (key === 'limit' && value === 8) newSearchParams.delete('limit');
        else newSearchParams.set(key, value);

        // Reset page to 1 if filters (other than page itself) change
        if(key !== 'page') {
            newSearchParams.delete('page');
        }
        setSearchParams(newSearchParams);
    };


    return (
        <>
            <Hero />
            <div className="container mx-auto p-4 md:p-8">
                {/* --- Filter Bar --- */}
                <div className="mb-8 p-4 bg-white dark:bg-slate-800/50 rounded-lg shadow-sm flex flex-col md:flex-row flex-wrap items-center gap-4 border dark:border-slate-700">
                    {/* Search Input */}
                    <div className="relative flex-grow w-full md:w-auto">
                        <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => updateSearchParams('search', e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 focus:ring-amber-500 focus:border-amber-500" />
                         <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    {/* Category Buttons */}
                    <div className="flex items-center gap-2 flex-wrap justify-center">
                        {categories.map(cat => ( <button key={cat} onClick={() => updateSearchParams('category', cat)} className={`px-3 py-1 text-sm rounded-full transition font-medium ${category === cat ? 'bg-slate-800 text-white dark:bg-amber-500 dark:text-slate-900' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'}`} > {cat.charAt(0).toUpperCase() + cat.slice(1)} </button> ))}
                    </div>
                    {/* Sort By Dropdown */}
                    <div className="relative">
                         <select value={sortBy} onChange={(e) => updateSearchParams('sort', e.target.value)} className="appearance-none w-full md:w-auto pl-3 pr-8 py-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 font-medium focus:ring-amber-500 focus:border-amber-500">
                            <option value="latest">Sort: Latest</option>
                            <option value="price-asc">Price: Low-High</option>
                            <option value="price-desc">Price: High-Low</option>
                            <option value="rating">Top Rated</option>
                        </select>
                         <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                    {/* Items Per Page Dropdown */}
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
                
                <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Explore Our Products</h2>
                
                {loading ? <Spinner /> : error ? <div className="text-center text-red-500">{error}</div> : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {products.length > 0 ? products.map(product => <ProductCard key={product._id} product={product} />) : <p className="col-span-full text-center text-slate-500">No products found matching your criteria.</p>}
                        </div>
                        <Pagination pages={pages} currentPage={page} onPageChange={(p) => updateSearchParams('page', p)} />
                    </>
                )}
            </div>
        </>
    );
};

export default HomePage;