import React, { useState } from 'react';
import axios from 'axios';
import { useApp } from '../../context/AppContext';
import { API_URL, formatCurrency } from '../../utils/helpers';
import { Spinner } from '../../components/UI';

// This is the modal component for editing before import
const EditAndImportModal = ({ product, onClose, onImport }) => {
    const [title, setTitle] = useState(product.title);
    const [price, setPrice] = useState(product.price);
    const [image, setImage] = useState(product.image);
    const [description, setDescription] = useState(product.description);
    const [category, setCategory] = useState(product.category || 'scraped'); // Default category

    const handleSubmit = (e) => {
        e.preventDefault();
        onImport({ ...product, title, price, image, description, category });
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b dark:border-slate-700">
                    <h3 className="text-xl font-bold">Import Product</h3>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-slate-700 dark:text-slate-300 mb-2 font-medium">Title</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border rounded-md dark:bg-slate-700 dark:border-slate-600"/>
                    </div>
                     <div>
                        <label className="block text-slate-700 dark:text-slate-300 mb-2 font-medium">Price</label>
                        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-3 py-2 border rounded-md dark:bg-slate-700 dark:border-slate-600"/>
                    </div>
                    <div>
                        <label className="block text-slate-700 dark:text-slate-300 mb-2 font-medium">Image URL</label>
                        <input type="text" value={image} onChange={(e) => setImage(e.target.value)} className="w-full px-3 py-2 border rounded-md dark:bg-slate-700 dark:border-slate-600"/>
                        <img src={image} alt="Preview" className="w-20 h-20 object-contain mt-2 bg-white p-1 rounded"/>
                    </div>
                     <div>
                        <label className="block text-slate-700 dark:text-slate-300 mb-2 font-medium">Category</label>
                        <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 border rounded-md dark:bg-slate-700 dark:border-slate-600"/>
                    </div>
                    <div>
                        <label className="block text-slate-700 dark:text-slate-300 mb-2 font-medium">Description</label>
                        <textarea rows="3" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border rounded-md dark:bg-slate-700 dark:border-slate-600"/>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-slate-200 dark:bg-slate-600 font-medium">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded-md bg-green-600 text-white font-medium">Import Product</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const ImporterPage = () => {
    const { user, showToast } = useApp();
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState("all");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    
    // State for the edit modal
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleScrape = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResults([]);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.post(`${API_URL}/admin/scrape`, { searchTerm }, config);
            setResults(data);
            if(data.length === 0) {
                showToast('Scraper finished but found 0 products.', 'info');
            } else {
                showToast(`Found ${data.length} products!`, 'success');
            }
        } catch (error) {
            showToast(error.response?.data?.message || 'Scraping failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleImport = async (product) => {
        // Map scraped category to our app's format
        const productToImport = {
            ...product,
            category: categoryMap[category] || category
        };

        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`${API_URL}/admin/import`, productToImport, config);
            showToast('Product imported successfully!', 'success');
            // Remove the imported product from the results list
            setResults(results.filter(r => r.title !== product.title));
            setSelectedProduct(null); // Close modal
        } catch (error) {
            showToast(error.response?.data?.message || 'Import failed', 'error');
        }
    };

    // Map for category conversion
    const categoryMap = {
        "all": "scraped",
        "electronics": "electronics",
        "jewelery": "jewelery",
        "mens-clothing": "men's clothing",
        "womens-clothing": "women's clothing"
    };

    return (
        <div className="p-4 md:p-8">
            {selectedProduct && (
                <EditAndImportModal 
                    product={selectedProduct} 
                    onClose={() => setSelectedProduct(null)}
                    onImport={handleImport}
                />
            )}

            <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Import Products</h1>
            
            <form onSubmit={handleScrape} className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-lg border dark:border-slate-700 flex flex-col md:flex-row gap-4">
                <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Enter Amazon search term (e.g., 'laptops')"
                    className="flex-grow px-3 py-2 border rounded-md dark:bg-slate-700 dark:border-slate-600"
                    required
                />
                 <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                    className="appearance-none px-3 py-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 font-medium"
                >
                    <option value="all">Assign Category: Other</option>
                    <option value="electronics">Assign: Electronics</option>
                    <option value="jewelery">Assign: Jewelery</option>
                    <option value="mens-clothing">Assign: Men's Clothing</option>
                    <option value="womens-clothing">Assign: Women's Clothing</option>
                </select>
                <button type="submit" className="bg-amber-500 text-slate-900 font-bold px-6 py-2 rounded-md" disabled={loading}>
                    {loading ? 'Scraping...' : 'Search & Scrape'}
                </button>
            </form>

            {loading && <Spinner />}

            <div className="mt-8 space-y-4">
                {results.map((product, index) => (
                    <div key={index} className="flex flex-col md:flex-row items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg shadow border dark:border-slate-700">
                        <img src={product.image} alt={product.title} className="w-20 h-20 object-contain rounded bg-white p-1" />
                        <div className="flex-grow">
                            <h4 className="font-bold">{product.title}</h4>
                            <p className="text-amber-500 font-bold">{formatCurrency(product.price)}</p>
                        </div>
                        <button 
                            onClick={() => setSelectedProduct({ ...product, category: categoryMap[category] || 'scraped' })} 
                            className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 w-full md:w-auto"
                        >
                            Edit & Import
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImporterPage;