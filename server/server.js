import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/order.js';
import userRoutes from './routes/user.js';
import productRoutes from './routes/product.js'; // Import new product routes

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// --- Database Connection ---
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/user', userRoutes);
app.use('/api/products', productRoutes);

// Remove or comment out the old Fake Store API routes
/*
app.get('/api/products', async (req, res) => {
    try {
        const { data } = await axios.get('https://fakestoreapi.com/products');
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products' });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const { data } = await axios.get(`https://fakestoreapi.com/products/${req.params.id}`);
        res.json(data);
    } catch (error) {
        res.status(404).json({ message: 'Product not found' });
    }
});
*/

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));