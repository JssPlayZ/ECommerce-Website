import { faker } from '@faker-js/faker';

const generateProducts = (count = 50) => {
    const products = [];

    // Curated, realistic product names for better data
    const productNames = {
        'electronics': ["High-Speed 1TB SSD", "Wireless Noise-Cancelling Headphones", "4K Ultra HD Monitor", "Mechanical Gaming Keyboard", "Smart Home Hub", "Portable Bluetooth Speaker", "HD Webcam", "USB-C Docking Station"],
        'jewelery': ["Sterling Silver Necklace", "Diamond Stud Earrings", "Gold Bangle Bracelet", "Pearl Drop Pendant", "Sapphire Engagement Ring", "Men's Titanium Band"],
        "men's clothing": ["Classic Denim Jacket", "Slim-Fit Chino Pants", "Merino Wool Sweater", "Linen Button-Down Shirt", "Leather Bomber Jacket", "Athletic Performance Shorts"],
        "women's clothing": ["Floral Maxi Dress", "High-Waisted Skinny Jeans", "Cashmere V-Neck Sweater", "Silk Blouse", "Classic Trench Coat", "Yoga Leggings with Pockets"]
    };
    
    const categories = Object.keys(productNames);

    for (let i = 0; i < count; i++) {
        const category = faker.helpers.arrayElement(categories);
        const title = faker.helpers.arrayElement(productNames[category]);

        const product = {
            // Re-adding the 'id' field to satisfy the schema validation.
            id: (i + 1).toString(),
            title: title,
            price: faker.commerce.price({ min: 100, max: 2000, dec: 0 }),
            description: faker.lorem.sentence(),
            category: category,
            image: faker.image.urlLoremFlickr({ category: category.split("'")[0], width: 400, height: 400 }) + `?random=${i}`, // Ensure unique images
            rating: {
                rate: faker.number.float({ min: 3, max: 5, precision: 0.1 }),
                count: faker.number.int({ min: 50, max: 500 })
            }
        };
        products.push(product);
    }
    return products;
};

export { generateProducts } ;