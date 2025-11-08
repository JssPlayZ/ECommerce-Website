import React, { useState } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import { API_URL } from '../utils/helpers';
import AuthForm from '../components/AuthForm';

const GoogleSignInButton = () => {
    return (
        <a 
            href={`${API_URL}/auth/google`} 
            className="w-full flex items-center justify-center gap-2 py-3 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition font-medium"
        >
            <svg className="w-5 h-5" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
                <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path>
                <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.223 0-9.577-3.108-11.383-7.46l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path>
                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C39.73 36.548 44 31.023 44 24c0-1.341-.138-2.65-.389-3.917z"></path>
            </svg>
            Sign in with Google
        </a>
    );
};

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useApp();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const { data } = await axios.post(`${API_URL}/auth/login`, { email, password });
            login(data);
            // Navigation is now handled by AuthRedirector in App.js
        } catch (err) { setError(err.response?.data?.message || 'Login failed.'); }
    };
    return (
        <div className="container mx-auto p-4">
            <AuthForm type="Login" onSubmit={handleSubmit} error={error} fields={{email, setEmail, password, setPassword}} />
            <div className="max-w-md mx-auto mt-4">
                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t dark:border-slate-600"></span>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-zinc-50 dark:bg-slate-900 text-slate-500">Or continue with</span>
                    </div>
                </div>
                <GoogleSignInButton />
            </div>
        </div>
    );
};

export default LoginPage;