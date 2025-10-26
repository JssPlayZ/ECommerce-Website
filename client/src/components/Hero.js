import React from 'react';

const Hero = () => {
    // Function to handle smooth scrolling
    const scrollToProducts = () => {
        const productSection = document.getElementById('products-section');
        if (productSection) {
            productSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="relative h-96 md:h-[500px] bg-cover bg-center text-white" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1920&q=80')" }}>
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30"></div>
            <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-start z-10">
                <h1 className="text-4xl md:text-6xl font-extrabold leading-tight shadow-text">New Season Arrivals</h1>
                <p className="mt-4 text-lg md:text-xl max-w-lg shadow-text">Check out all the new trends and refresh your wardrobe with our latest collection.</p>
                {/* Updated Button with onClick handler */}
                <button
                    onClick={scrollToProducts}
                    className="mt-8 bg-amber-500 text-slate-900 px-8 py-3 rounded-md hover:bg-amber-600 transition active:scale-95 font-bold text-lg shadow-lg"
                >
                    Shop Now
                </button>
            </div>
            {/* Simple CSS for text shadow */}
            <style>{`.shadow-text { text-shadow: 1px 1px 3px rgba(0,0,0,0.5); }`}</style>
        </div>
    );
};

export default Hero;