export const API_URL = 'http://localhost:5001/api';
export const SERVER_URL = 'http://localhost:5001';
export const INR_CONVERSION_RATE = 1;

export const formatCurrency = (priceInUSD) => {
    const priceInINR = priceInUSD * INR_CONVERSION_RATE;
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(priceInINR);
};