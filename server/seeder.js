import mongoose from 'mongoose';
import dotenv from 'dotenv';
import users from './data/users.js';
import { generateProducts } from './data/products.js';
import User from './models/User.js';
import Product from './models/Product.js';
import connectDB from './config/db.js';

dotenv.config();
await connectDB();

const importData = async () => {
    try {
        // Clear all previous data
        await Product.deleteMany();
        await User.deleteMany();

        // Insert the users from your users.js file
        const createdUsers = await User.insertMany(users);
        
        // Get the ID of the first user, who is the admin
        const adminUser = createdUsers[0]._id;

        // Generate 50 products and add the admin user's ID to each one
        const sampleProducts = generateProducts(50).map(product => {
            return { ...product, user: adminUser };
        });

        // Insert the new products into the database
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