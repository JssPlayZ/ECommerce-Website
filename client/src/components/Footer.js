import React from 'react';

const Footer = () => (
    <footer className="bg-white dark:bg-slate-800/50 mt-12 border-t dark:border-slate-700">
        <div className="container mx-auto py-6 px-6 text-center text-slate-600 dark:text-slate-400">
            &copy; {new Date().getFullYear()} MERNShop. All Rights Reserved.
        </div>
    </footer>
);

export default Footer;