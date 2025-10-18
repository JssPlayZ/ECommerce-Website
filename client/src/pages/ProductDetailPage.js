import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import { API_URL, formatCurrency } from '../utils/helpers';
import { Spinner } from '../components/UI';
import ProductCard from '../components/ProductCard';

// Star Rating Component for displaying stars
const StarRating = ({ value, count }) => {
    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
                <svg key={i} className={`w-5 h-5 ${i < Math.round(value) ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.365 2.445a1 1 0 00-.364 1.118l1.287 3.955c.3.921-.755 1.688-1.54 1.118l-3.365-2.445a1 1 0 00-1.175 0l-3.365 2.445c-.784.57-1.838-.197-1.54-1.118l1.287-3.955a1 1 0 00-.364-1.118L2.05 9.382c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
                </svg>
            ))}
            {count > 0 && <span className="text-slate-500 dark:text-slate-400 ml-2 text-sm">({count} reviews)</span>}
        </div>
    );
};


const ProductDetailPage = () => {
    const { id } = useParams();
    const { user, addToCart, wishlist, toggleWishlist, showToast } = useApp();
    
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loadingReview, setLoadingReview] = useState(false);
    
    const isWishlisted = wishlist.some(item => item._id === id);

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const { data: mainProduct } = await axios.get(`${API_URL}/products/${id}`);
                setProduct(mainProduct);

                if (mainProduct) {
                    const { data: related } = await axios.get(`${API_URL}/products/${id}/related`);
                    setRelatedProducts(related);
                }
            } catch (err) {
                setError('Could not find this product.');
            } finally {
                setLoading(false);
            }
        };

        setLoading(true);
        window.scrollTo(0, 0);
        if (id) {
            fetchProductData();
        } else {
            setError('No product ID found in URL.');
            setLoading(false);
        }
    }, [id]);

    const reviewSubmitHandler = async (e) => {
        e.preventDefault();
        setLoadingReview(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`${API_URL}/products/${id}/reviews`, { rating, comment }, config);
            showToast('Review submitted successfully!', 'success');
            setRating(0);
            setComment('');
            // Re-fetch product data by temporarily setting loading
            setLoading(true);
            const { data: mainProduct } = await axios.get(`${API_URL}/products/${id}`);
            setProduct(mainProduct);
            setLoading(false);
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to submit review', 'error');
        } finally {
            setLoadingReview(false);
        }
    };

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
                        <div className="flex items-center gap-4 my-3">
                           <StarRating value={product.rating} count={product.numReviews} />
                        </div>
                        <p className="text-4xl font-light text-amber-500 my-4">{formatCurrency(product.price)}</p>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{product.description}</p>
                        <div className="flex items-center gap-4 mt-8">
                            <button onClick={() => addToCart(product)} className="w-full bg-slate-800 text-white px-10 py-3 rounded-md hover:bg-slate-700 dark:bg-amber-500 dark:text-slate-900 dark:hover:bg-amber-600 transition text-lg font-semibold active:scale-95">
                                Add to Cart
                            </button>
                            {user && (
                                <button onClick={() => toggleWishlist(product._id)} className="p-3 rounded-md bg-slate-200 dark:bg-slate-700 transition-colors" aria-label="Toggle Wishlist">
                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-all duration-300 ${isWishlisted ? 'text-red-500' : 'text-slate-500 dark:text-slate-400 hover:text-red-500'}`} fill={isWishlisted ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 016.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Customer Reviews ({product.numReviews})</h3>
                    {product.reviews.length === 0 ? <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border dark:border-slate-700 text-slate-500">No reviews yet. Be the first!</div> : (
                        <div className="space-y-4">
                            {product.reviews.map((review) => (
                                <div key={review._id} className="p-4 bg-white dark:bg-slate-800 rounded-lg border dark:border-slate-700">
                                    <strong className="text-slate-800 dark:text-white">{review.name}</strong>
                                    <StarRating value={review.rating} />
                                    <p className="text-slate-600 dark:text-slate-300 mt-2">{review.comment}</p>
                                    <p className="text-xs text-slate-400 mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div>
                    <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Write a Review</h3>
                    {user ? (
                         <form onSubmit={reviewSubmitHandler} className="p-4 bg-white dark:bg-slate-800 rounded-lg border dark:border-slate-700 space-y-4">
                            <div>
                                <label className="font-medium block text-slate-700 dark:text-slate-300 mb-1">Your Rating</label>
                                <select value={rating} onChange={(e) => setRating(e.target.value)} required className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 focus:ring-amber-500 focus:border-amber-500">
                                    <option value="">Select...</option>
                                    <option value="1">1 - Poor</option>
                                    <option value="2">2 - Fair</option>
                                    <option value="3">3 - Good</option>
                                    <option value="4">4 - Very Good</option>
                                    <option value="5">5 - Excellent</option>
                                </select>
                            </div>
                             <div>
                                <label className="font-medium block text-slate-700 dark:text-slate-300 mb-1">Your Comment</label>
                                <textarea rows="3" value={comment} onChange={(e) => setComment(e.target.value)} required className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 focus:ring-amber-500 focus:border-amber-500"></textarea>
                            </div>
                            <button type="submit" disabled={loadingReview} className="w-full bg-slate-800 text-white py-2 rounded-md hover:bg-slate-700 disabled:bg-slate-400 font-bold transition">
                                {loadingReview ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </form>
                    ) : (
                        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border dark:border-slate-700 text-slate-500">
                            Please <Link to="/login" className="text-amber-500 hover:underline font-bold">sign in</Link> to write a review.
                        </div>
                    )}
                </div>
            </div>

            {relatedProducts.length > 0 && (
                <div className="mt-12">
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