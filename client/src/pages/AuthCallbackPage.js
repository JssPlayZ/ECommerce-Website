import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Spinner } from '../components/UI';

const AuthCallbackPage = () => {
    const { login } = useApp();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const handleAuth = async () => {
            const userParam = searchParams.get('user');
            if (userParam) {
                try {
                    // Parse the user data from the URL
                    const userData = JSON.parse(decodeURIComponent(userParam));
                    
                    // Wait for the login function to complete (which now includes
                    // fetching cart and wishlist) BEFORE navigating.
                    await login(userData);
                    
                    // Now that login is complete, redirect to the homepage
                    navigate('/');
                } catch (error) {
                    console.error("Failed to parse user data from URL", error);
                    navigate('/login');
                }
            } else {
                // No user data, redirect to login
                navigate('/login');
            }
        };

        handleAuth();
    }, [searchParams, login, navigate]);

    // Show a loading spinner while we process the login
    return (
        <div className="py-20">
            <Spinner />
            <p className="text-center text-slate-600 dark:text-slate-400">Finalizing your login...</p>
        </div>
    );
};

export default AuthCallbackPage;