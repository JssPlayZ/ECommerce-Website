import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../utils/helpers';
import { Spinner, Pagination } from '../components/UI';
import ProductCard from '../components/ProductCard';
import Hero from '../components/Hero';

const HomePage = () => {
    // State for data
    const [products, setProducts] = useState([]);
    const [pages, setPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // --- NEW: Read filters from URL query parameters ---
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Get initial state from URL or set defaults
    const page = Number(searchParams.get('page')) || 1;
    const searchTerm = searchParams.get('search') || '';
    const category = searchParams.get('category') || 'all';
    const sortBy = searchParams.get('sort') || 'latest';

    const categories = ["all", "electronics", "jewelery", "men's clothing", "women's clothing"];

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // The API call now uses the values derived from the URL
                const { data } = await axios.get(`${API_URL}/products`, {
                    params: { 
                        page,
                        search: searchTerm, 
                        category,
                        sort: sortBy
                    }
                });
                setProducts(data.products);
                setPages(data.pages);
            } catch (err) { 
                setError('Failed to load products. Please try again later.'); 
            } finally { 
                setLoading(false); 
            }
        };

        // We use a debounce to prevent API calls on every keystroke in the search bar
        const debounceFetch = setTimeout(() => {
            fetchProducts();
        }, 300);

        return () => clearTimeout(debounceFetch);
    }, [searchParams]); // The effect now re-runs whenever the URL query params change

    // --- NEW: Functions to update URL query parameters ---
    const updateSearchParams = (key, value) => {
        const newSearchParams = new URLSearchParams(searchParams);
        if (key === 'page' && value === 1) {
            newSearchParams.delete('page');
        } else {
            newSearchParams.set(key, value);
        }
        // When updating filters other than page, reset to page 1
        if(key !== 'page') {
            newSearchParams.delete('page');
        }
        setSearchParams(newSearchParams);
    };


    return (
        <>
            <Hero />
            <div className="container mx-auto p-4 md:p-8">
                <div className="mb-8 p-4 bg-white dark:bg-slate-800/50 rounded-lg shadow-sm flex flex-col md:flex-row items-center gap-4 border dark:border-slate-700">
                    <div className="relative flex-grow w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Search for products..."
                            value={searchTerm}
                            onChange={(e) => updateSearchParams('search', e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-zinc-50 dark:bg-slate-700"
                        />
                         <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap justify-center">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => updateSearchParams('category', cat)}
                                className={`px-3 py-1 text-sm rounded-full transition font-medium ${category === cat ? 'bg-slate-800 text-white dark:bg-amber-500 dark:text-slate-900' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'}`}
                            >
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </button>
                        ))}
                    </div>
                    <div className="relative">
                         <select 
                            value={sortBy} 
                            onChange={(e) => updateSearchParams('sort', e.target.value)}
                            className="appearance-none w-full md:w-auto pl-3 pr-8 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-zinc-50 dark:bg-slate-700 font-medium"
                        >
                            <option value="latest">Sort by: Latest</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="rating">Top Rated</option>
                        </select>
                        <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                </div>
                
                <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Explore Our Products</h2>
                
                {loading ? <Spinner /> : error ? <div className="text-center text-red-500">{error}</div> : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {products.length > 0 ? products.map(product => <ProductCard key={product._id} product={product} />) : <p className="col-span-full text-center text-slate-500">No products found for your query.</p>}
                        </div>
                        <Pagination pages={pages} page={page} onPageChange={(p) => updateSearchParams('page', p)} />
                    </>
                )}
            </div>
        </>
    );
};

export default HomePage;