import React from 'react';
import { Link } from 'react-router-dom';

const AuthForm = ({ type, onSubmit, error, fields }) => {
    const isLogin = type === "Login";
    return (
        <div className="max-w-md mx-auto mt-10 bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg border dark:border-slate-700">
            <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-6">{type} to MERNShop</h2>
            {error && <p className="bg-red-100 border border-red-300 text-red-800 p-3 rounded-md mb-4 text-sm">{error}</p>}
            <form onSubmit={onSubmit} className="space-y-6">
                {!isLogin && (
                     <div>
                        <label className="block text-slate-700 dark:text-slate-300 mb-2 font-medium" htmlFor="name">Name</label>
                        <input type="text" id="name" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-zinc-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500" value={fields.name} onChange={(e) => fields.setName(e.target.value)} required />
                    </div>
                )}
                <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-2 font-medium" htmlFor="email">Email Address</label>
                    <input type="email" id="email" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-zinc-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500" value={fields.email} onChange={(e) => fields.setEmail(e.target.value)} required />
                </div>
                <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-2 font-medium" htmlFor="password">Password</label>
                    <input type="password" id="password" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-zinc-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500" value={fields.password} onChange={(e) => fields.setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="w-full bg-slate-800 text-white py-3 rounded-md hover:bg-slate-700 dark:bg-amber-500 dark:text-slate-900 dark:hover:bg-amber-600 transition active:scale-95 font-bold">{type}</button>
            </form>
            <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <Link to={isLogin ? '/signup' : '/login'} className="text-amber-500 hover:underline font-medium">
                    {isLogin ? "Sign Up" : "Login"}
                </Link>
            </p>
        </div>
    );
};

export default AuthForm;