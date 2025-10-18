import { faker } from '@faker-js/faker';

const generateProducts = (count = 50) => {
    const products = [];
    const productNames = {
        'electronics': ["High-Speed 1TB SSD", "Wireless Noise-Cancelling Headphones", "4K Ultra HD Monitor", "Mechanical Gaming Keyboard"],
        'jewelery': ["Sterling Silver Necklace", "Diamond Stud Earrings", "Gold Bangle Bracelet"],
        "men's clothing": ["Classic Denim Jacket", "Slim-Fit Chino Pants", "Merino Wool Sweater"],
        "women's clothing": ["Floral Maxi Dress", "High-Waisted Skinny Jeans", "Classic Trench Coat"]
    };
    const categories = Object.keys(productNames);

    for (let i = 0; i < count; i++) {
        const category = faker.helpers.arrayElement(categories);
        const title = faker.helpers.arrayElement(productNames[category]);

        const product = {
            title: title,
            price: faker.commerce.price({ min: 1000, max: 30000, dec: 0 }),
            description: faker.commerce.productDescription(),
            category: category,
            image: faker.image.urlLoremFlickr({ category: category.split("'")[0], width: 400, height: 400 }) + `?random=${i}`,
        };
        products.push(product);
    }
    return products;
};

export { generateProducts };