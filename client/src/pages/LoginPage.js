import React, { useState } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext'; // Corrected: useApp hook
import { API_URL } from '../utils/helpers';
import AuthForm from '../components/AuthForm';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useApp(); // Corrected: useApp hook

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const { data } = await axios.post(`${API_URL}/auth/login`, { email, password });
            login(data);
            // Navigation is now handled by AuthRedirector in App.js
        } catch (err) { setError(err.response?.data?.message || 'Login failed.'); }
    };
    return <div className="container mx-auto p-4"><AuthForm type="Login" onSubmit={handleSubmit} error={error} fields={{email, setEmail, password, setPassword}} /></div>;
};

export default LoginPage;