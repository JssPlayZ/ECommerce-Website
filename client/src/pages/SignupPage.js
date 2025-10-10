import React, { useState } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext'; // Corrected: useApp hook
import { API_URL } from '../utils/helpers';
import AuthForm from '../components/AuthForm';

const SignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useApp(); // Corrected: useApp hook
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
        try {
            const { data } = await axios.post(`${API_URL}/auth/register`, { name, email, password });
            login(data);
            // Navigation is now handled by AuthRedirector in App.js
        } catch (err) { setError(err.response?.data?.message || 'Sign up failed.'); }
    };
    return <div className="container mx-auto p-4"><AuthForm type="Sign Up" onSubmit={handleSubmit} error={error} fields={{name, setName, email, setEmail, password, setPassword}} /></div>;
};

export default SignupPage;