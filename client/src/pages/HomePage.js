import React from 'react';
import { useSearchParams } from 'react-router-dom'; // Removed 'Link' import
import axios from 'axios';
import { API_URL } from '../utils/helpers';
import { Spinner, Pagination } from '../components/UI';
import ProductCard from '../components/ProductCard';
import Hero from '../components/Hero';

// Simple Icon Components for Categories
const ElectronicsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const JeweleryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>;
const MensIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const WomensIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4a4 4 0 100 8 4 4 0 000-8zM7 21a5 5 0 0110 0" /></svg>;

const categoryDetails = [
    { name: "electronics", icon: <ElectronicsIcon />, label: "Electronics" },
    { name: "jewelery", icon: <JeweleryIcon />, label: "Jewelery" },
    { name: "men's clothing", icon: <MensIcon />, label: "Men's Clothing" },
    { name: "women's clothing", icon: <WomensIcon />, label: "Women's Clothing" },
];

const HomePage = () => {
    const [products, setProducts] = React.useState([]);
    // Removed unused topRatedProducts state
    const [pages, setPages] = React.useState(1);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState('');

    const [searchParams, setSearchParams] = useSearchParams();

    const page = Number(searchParams.get('page')) || 1;
    const searchTerm = searchParams.get('search') || '';
    const category = searchParams.get('category') || 'all';
    const sortBy = searchParams.get('sort') || 'latest';
    const limit = Number(searchParams.get('limit')) || 8;

    const limitOptions = [8, 12, 16];

    // Fetch main product list
    React.useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(''); // Reset error on new fetch
            try {
                const { data } = await axios.get(`${API_URL}/products`, {
                    params: { page, search: searchTerm, category, sort: sortBy, limit }
                });
                setProducts(data.products);
                setPages(data.pages);
            } catch (err) { setError('Failed to load products.'); }
            finally { setLoading(false); }
        };

        const debounceFetch = setTimeout(fetchProducts, 300);
        return () => clearTimeout(debounceFetch);
    }, [page, searchTerm, category, sortBy, limit, searchParams]);


    const updateSearchParams = (key, value) => {
        const newSearchParams = new URLSearchParams(searchParams);

        if (key === 'page' && value === 1) newSearchParams.delete('page');
        else if (key === 'search' && value === '') newSearchParams.delete('search');
        else if (key === 'category' && value === 'all') newSearchParams.delete('category');
        else if (key === 'sort' && value === 'latest') newSearchParams.delete('sort');
        else if (key === 'limit' && value === 8) newSearchParams.delete('limit');
        else newSearchParams.set(key, value);

        if(key !== 'page') {
            newSearchParams.delete('page');
        }
        setSearchParams(newSearchParams);
    };

    return (
        <>
            <Hero />

            {/* Shop by Category Section */}
            <section className="bg-slate-100 dark:bg-slate-800 py-12">
                <div className="container mx-auto px-4 md:px-8">
                     <h2 className="text-3xl font-bold mb-6 text-center text-slate-900 dark:text-white">Shop by Category</h2>
                     <div className="flex flex-wrap justify-center gap-6">
                         {/* All Categories Button */}
                         <button
                            onClick={() => updateSearchParams('category', 'all')}
                            className={`p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center flex flex-col items-center group w-full sm:w-auto flex-1 min-w-[150px] ${category === 'all' ? 'bg-amber-500 text-slate-900 ring-2 ring-amber-600' : 'bg-white dark:bg-slate-700'}`}
                         >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
                             <span className={`mt-2 font-semibold ${category === 'all' ? 'text-slate-900' : 'text-slate-800 dark:text-white group-hover:text-amber-500 transition-colors'}`}>All Categories</span>
                         </button>
                         {/* Individual Category Buttons */}
                         {categoryDetails.map((cat) => (
                            <button
                                key={cat.name}
                                onClick={() => updateSearchParams('category', cat.name)}
                                className={`p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center flex flex-col items-center group w-full sm:w-auto flex-1 min-w-[150px] ${category === cat.name ? 'bg-amber-500 text-slate-900 ring-2 ring-amber-600' : 'bg-white dark:bg-slate-700'}`}
                            >
                                <div className={`${category === cat.name ? 'text-slate-900' : 'text-amber-500 group-hover:scale-110 transition-transform'}`}>{cat.icon}</div>
                                <span className={`mt-2 font-semibold ${category === cat.name ? 'text-slate-900' : 'text-slate-800 dark:text-white group-hover:text-amber-500 transition-colors'}`}>{cat.label}</span>
                             </button>
                         ))}
                     </div>
                </div>
            </section>


            {/* Main Product Grid & Filters */}
            <section id="products-section" className="container mx-auto p-4 md:p-8">
                {/* --- Filter Bar --- */}
                <div className="mb-8 p-4 bg-white dark:bg-slate-800/50 rounded-lg shadow-sm flex flex-col md:flex-row flex-wrap items-center gap-4 border dark:border-slate-700">
                    <div className="relative flex-grow w-full md:w-auto"> {/* Search */}
                        <input type="text" placeholder="Search products..." value={searchTerm} onChange={(e) => updateSearchParams('search', e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 focus:ring-amber-500 focus:border-amber-500" />
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <div className="relative"> {/* Sort */}
                         <select value={sortBy} onChange={(e) => updateSearchParams('sort', e.target.value)} className="appearance-none w-full md:w-auto pl-3 pr-8 py-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 font-medium focus:ring-amber-500 focus:border-amber-500">
                            <option value="latest">Sort: Latest</option> <option value="price-asc">Price: Low-High</option> <option value="price-desc">Price: High-Low</option> <option value="rating">Top Rated</option>
                        </select>
                         <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                    <div className="relative"> {/* Limit */}
                         <select value={limit} onChange={(e) => updateSearchParams('limit', parseInt(e.target.value, 10))} className="appearance-none w-full md:w-auto pl-3 pr-8 py-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 font-medium focus:ring-amber-500 focus:border-amber-500">
                             {limitOptions.map(opt => ( <option key={opt} value={opt}>Show: {opt}</option> ))}
                        </select>
                         <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                </div>

                <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">
                    {category === 'all' ? 'All Products' : categoryDetails.find(c => c.name === category)?.label || 'Products'}
                </h2>

                {loading ? <Spinner /> : error ? <div className="text-center text-red-500">{error}</div> : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {products.length > 0 ? products.map(product => <ProductCard key={product._id} product={product} />) : <p className="col-span-full text-center text-slate-500 dark:text-slate-400">No products found matching your criteria.</p>}
                        </div>
                        <Pagination pages={pages} currentPage={page} onPageChange={(p) => updateSearchParams('page', p)} />
                    </>
                )}
            </section>
        </>
    );
};

export default HomePage;