import mongoose from 'mongoose';
import dotenv from 'dotenv';
import users from './data/users.js';
import { generateProducts } from './data/products.js';
import User from './models/User.js';
import Product from './models/Product.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const importData = async () => {
    try {
        await Product.deleteMany();
        await User.deleteMany();

        const createdUsers = await User.insertMany(users);
        const adminUser = createdUsers[0]._id; // First user is the admin

        const sampleProducts = generateProducts(50).map(product => {
            return { ...product, user: adminUser };
        });

        await Product.insertMany(sampleProducts);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Product.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}