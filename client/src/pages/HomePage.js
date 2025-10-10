import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../utils/helpers';
import { Spinner, Pagination } from '../components/UI';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('all');
    
    // Define categories statically for the filter buttons
    const categories = ["all", "electronics", "jewelery", "men's clothing", "women's clothing"];

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // The API now returns an object: { products, page, pages }
                const { data } = await axios.get(`${API_URL}/products`, {
                    params: { search: searchTerm, category, page }
                });
                // Update state with the new data structure
                setProducts(data.products);
                setPage(data.page);
                setPages(data.pages);
            } catch (err) { 
                setError('Failed to load products. Please try again later.'); 
            } finally { 
                setLoading(false); 
            }
        };

        // Debounce fetching to avoid excessive API calls while typing
        const debounceFetch = setTimeout(() => {
            fetchProducts();
        }, 300);

        return () => clearTimeout(debounceFetch);
    }, [searchTerm, category, page]);

    return (
        <>
            <Hero />
            <div className="container mx-auto p-4 md:p-8">
                {/* Search and Filter Section */}
                <div className="mb-8 p-4 bg-white dark:bg-slate-800/50 rounded-lg shadow-sm flex flex-col md:flex-row items-center gap-4 border dark:border-slate-700">
                    <div className="relative flex-grow w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Search for products..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-zinc-50 dark:bg-slate-700"
                        />
                         <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap justify-center">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => { setCategory(cat); setPage(1); }}
                                className={`px-3 py-1 text-sm rounded-full transition font-medium ${category === cat ? 'bg-slate-800 text-white dark:bg-amber-500 dark:text-slate-900' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'}`}
                            >
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
                
                <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Explore Our Products</h2>
                
                {/* Product Grid and Pagination */}
                {loading ? <Spinner /> : error ? <div className="text-center text-red-500">{error}</div> : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {products && products.length > 0 ? products.map(product => <ProductCard key={product._id} product={product} />) : <p className="col-span-full text-center text-slate-500">No products found for your query.</p>}
                        </div>
                        {pages > 1 && (
                            <div className="mt-8">
                                <Pagination page={page} pages={pages} onPageChange={(p) => setPage(p)} />
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default HomePage;