import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ToastContainer } from './components/UI';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CartPage from './pages/CartPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ProfilePage from './pages/ProfilePage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import WishlistPage from './pages/WishlistPage';
import ProductListPage from './pages/admin/ProductListPage';
import ProductEditPage from './pages/admin/ProductEditPage';

const AuthRedirector = () => {
    const { user } = useApp();
    const location = useLocation();
    const navigate = useNavigate();
    React.useEffect(() => {
        if (user && (location.pathname === '/login' || location.pathname === '/signup')) {
            navigate('/');
        }
    }, [user, location, navigate]);
    return null;
};

function App() {
    return (
        <AppProvider>
            <Router>
                <div className="bg-zinc-50 dark:bg-slate-900 min-h-screen font-sans text-slate-800 dark:text-slate-200 flex flex-col">
                    <ToastContainer />
                    <Navbar />
                    <AuthRedirector />
                    <main className="flex-grow">
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<HomePage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/signup" element={<SignupPage />} />
                            <Route path="/cart" element={<CartPage />} />
                            <Route path="/product/:id" element={<ProductDetailPage />} />
                            
                            {/* User Routes */}
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/orders" element={<OrderHistoryPage />} />
                            <Route path="/wishlist" element={<WishlistPage />} />

                            {/* Admin Routes */}
                            <Route path="" element={<AdminProtectedRoute />}>
                                <Route path="/admin/productlist" element={<ProductListPage />} />
                                <Route path="/admin/product/:id/edit" element={<ProductEditPage />} />
                            </Route>
                        </Routes>
                    </main>
                    <Footer/>
                </div>
            </Router>
        </AppProvider>
    );
}

export default App;