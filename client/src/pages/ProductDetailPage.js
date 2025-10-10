import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import { API_URL, formatCurrency } from '../utils/helpers';
import { Spinner } from '../components/UI';
import ProductCard from '../components/ProductCard';

const ProductDetailPage = () => {
    const { id } = useParams();
    const { addToCart, wishlist, toggleWishlist, user } = useApp();
    const [product, setProduct] = React.useState(null);
    const [relatedProducts, setRelatedProducts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState('');
    const isWishlisted = wishlist.some(item => item._id === id);

    useEffect(() => {
        const fetchProductAndRelated = async () => {
            setLoading(true);
            setError('');
            try {
                window.scrollTo(0, 0);
                const { data: mainProduct } = await axios.get(`${API_URL}/products/${id}`);
                setProduct(mainProduct);

                if (mainProduct) {
                    const { data: related } = await axios.get(`${API_URL}/products/${id}/related`);
                    setRelatedProducts(related);
                }

            } catch (err) { setError('Could not find this product.'); } 
            finally { setLoading(false); }
        };
        
        if (id) fetchProductAndRelated();
        else { setError('No product ID found in URL.'); setLoading(false); }

    }, [id]);

    if (loading) return <div className="py-20"><Spinner /></div>;
    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
    if (!product) return null;

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg border dark:border-slate-700 mb-8">
                <Link to="/" className="mb-6 inline-block bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-4 py-2 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition active:scale-95 text-sm font-medium">
                    &larr; Back to Products
                </Link>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div className="flex items-center justify-center p-4 bg-white rounded-lg aspect-square">
                        <img src={product.image} alt={product.title} className="max-h-full object-contain" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{product.title}</h2>
                        <p className="text-sm text-slate-600 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 inline-block px-2 py-1 rounded my-3 capitalize font-medium">{product.category}</p>
                        <p className="text-4xl font-light text-amber-500 my-4">{formatCurrency(product.price)}</p>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{product.description}</p>
                        <div className="flex items-center gap-4 mt-8">
                            <button onClick={() => addToCart(product)} className="w-full bg-slate-800 text-white px-10 py-3 rounded-md hover:bg-slate-700 dark:bg-amber-500 dark:text-slate-900 dark:hover:bg-amber-600 transition text-lg font-semibold active:scale-95">
                                Add to Cart
                            </button>
                            {/* NEW: Wishlist button */}
                            {user && (
                                <button 
                                    onClick={() => toggleWishlist(product._id)}
                                    className="p-3 rounded-md bg-slate-200 dark:bg-slate-700 transition-colors"
                                    aria-label="Toggle Wishlist"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-all duration-300 ${isWishlisted ? 'text-red-500' : 'text-slate-500 dark:text-slate-400 hover:text-red-500'}`} fill={isWishlisted ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 016.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {relatedProducts.length > 0 && (
                <div>
                    <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">You Might Also Like</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedProducts.map(relatedProduct => (
                            <ProductCard key={relatedProduct._id} product={relatedProduct} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetailPage;