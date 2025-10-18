import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// Route files
import productRoutes from './routes/product.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/order.js';
import adminRoutes from './routes/admin.js';

// Error Middleware
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// Mount Routers
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`));