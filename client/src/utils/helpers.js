export const API_URL = 'http://localhost:5001/api';
export const INR_CONVERSION_RATE = 15; // Set your desired rate

export const formatCurrency = (priceInUSD) => {
    const priceInINR = priceInUSD * INR_CONVERSION_RATE;
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(priceInINR);
};