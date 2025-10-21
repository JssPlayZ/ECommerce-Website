import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import User from '../models/User.js';
import Product from '../models/Product.js';
import connectDB from '../config/db.js';

dotenv.config({ path: '../.env' }); // Point to the main .env file
await connectDB();

const importScrapedData = async () => {
    try {
        // Clear existing products
        await Product.deleteMany();
        console.log('Existing products cleared.');

        // Find the admin user
        const adminUser = await User.findOne({ isAdmin: true });
        if (!adminUser) {
            console.error('Admin user not found. Please run the main seeder first.');
            process.exit(1);
        }

        // Read the scraped data from the JSON file
        const data = fs.readFileSync('scraped_products.json', 'utf8');
        const productsToImport = JSON.parse(data);

        // Add the admin user's ID to each product
        const sampleProducts = productsToImport.map(product => {
            return { ...product, user: adminUser._id };
        });

        // Insert the new products
        await Product.insertMany(sampleProducts);

        console.log(`Successfully imported ${sampleProducts.length} scraped products!`);
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

importScrapedData();