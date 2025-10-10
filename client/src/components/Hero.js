import React from 'react';

const Hero = () => {
    return (
        <div className="relative h-96 bg-cover bg-center text-white" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1920&q=80')" }}>
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-start">
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">New Season Arrivals</h1>
                <p className="mt-4 text-lg md:text-xl max-w-lg">Check out all the new trends and refresh your wardrobe with our latest collection.</p>
                <button className="mt-8 bg-amber-500 text-slate-900 px-8 py-3 rounded-md hover:bg-amber-600 transition active:scale-95 font-bold text-lg">Shop Now</button>
            </div>
        </div>
    );
};

export default Hero;