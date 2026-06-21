import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import crypto from 'crypto';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Category from './models/categoryModel.js';
import connectDB from './config/db.js';

dotenv.config();

const SEED_PASSWORD = process.env.ADMIN_SEED_PASSWORD || crypto.randomBytes(12).toString('base64url');

await connectDB();

const importData = async () => {
    try {
        await User.deleteMany();
        await Product.deleteMany();
        await Category.deleteMany();

        // Create Categories
        const categories = await Category.insertMany([
            { name: 'Beard Care', slug: 'beard-care', description: 'Oils, balms, and washes for your beard' },
            { name: 'Minoxidil', slug: 'minoxidil', description: 'Growth treatments and solutions' },
            { name: 'Tools', slug: 'tools', description: 'Derma rollers, combs, and grooming tools' },
            { name: 'Supplements', slug: 'supplements', description: 'Vitamins for hair health' },
        ]);

        // Create Admin
        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: SEED_PASSWORD,
            role: 'admin',
        });

        // Create Vendor
        const vendorUser = await User.create({
            name: 'Premium Beard Co.',
            email: 'vendor@example.com',
            password: SEED_PASSWORD,
            role: 'vendor',
        });

        console.log(`\n🔑 Seeded accounts use password from ADMIN_SEED_PASSWORD env var.`.yellow);
        console.log(`   admin@example.com / vendor@example.com`.yellow);

        // Create Sample Products
        const products = [
            {
                name: 'Kirkland Minoxidil 5%',
                slug: 'kirkland-minoxidil-5',
                description: '6 month supply of topical solution for hair regrowth. Targeted for the crown and beard areas.',
                brand: 'Kirkland',
                category: categories[1]._id,
                price: 54.99,
                salePrice: 49.99,
                stock: 100,
                rating: 4.8,
                numReviews: 245,
                isFeatured: true,
                vendor: vendorUser._id,
                images: [{ url: 'https://images.unsplash.com/photo-1626015253241-c7a659fa5243?w=800&q=80', alt: 'Minoxidil' }]
            },
            {
                name: 'Organic Beard Oil',
                slug: 'organic-beard-oil',
                description: 'Nourishing oil with cedarwood and sandalwood scent. Promotes healthy beard growth.',
                brand: 'Premium Beard Co.',
                category: categories[0]._id,
                price: 24.99,
                stock: 50,
                rating: 4.9,
                numReviews: 89,
                isFeatured: true,
                vendor: vendorUser._id,
                images: [{ url: 'https://images.unsplash.com/photo-1590159413207-6880017de87f?w=800&q=80', alt: 'Beard Oil' }]
            },
            {
                name: 'Beard Derma Roller (0.5mm)',
                slug: 'beard-derma-roller-05mm',
                description: 'Stainless steel needles to stimulate hair follicles and improve absorption of growth oils.',
                brand: 'GroomMaster',
                category: categories[2]._id,
                price: 19.99,
                stock: 75,
                rating: 4.5,
                numReviews: 112,
                vendor: adminUser._id,
                images: [{ url: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=800&q=80', alt: 'Derma Roller' }]
            },
            {
                name: 'Regrowth Foam 5%',
                slug: 'regrowth-foam-5',
                description: 'Extra strength topical aerosol foam for targeted crown and beard hair follicle stimulation.',
                brand: 'Kirkland',
                category: categories[1]._id,
                price: 39.99,
                salePrice: 34.99,
                stock: 60,
                rating: 4.7,
                numReviews: 198,
                isFeatured: true,
                vendor: vendorUser._id,
                images: [{ url: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=800&q=80', alt: 'Foam' }]
            },
            {
                name: 'Biotin Growth Gummies',
                slug: 'biotin-growth-gummies',
                description: 'Tasty chewable vitamins packed with high-potency Biotin, Zinc, and Vitamin C/E for beard volume and nail strength.',
                brand: 'GroomMaster',
                category: categories[3]._id,
                price: 29.99,
                stock: 120,
                rating: 4.6,
                numReviews: 144,
                isFeatured: true,
                vendor: adminUser._id,
                images: [{ url: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=800&q=80', alt: 'Biotin Gummies' }]
            },
            {
                name: 'Premium Beard Balm',
                slug: 'premium-beard-balm',
                description: 'All-natural styling wax that tames, moisturizes, and thickens wild beard hairs with shea butter and beeswax.',
                brand: 'Premium Beard Co.',
                category: categories[0]._id,
                price: 21.99,
                salePrice: 18.99,
                stock: 45,
                rating: 4.9,
                numReviews: 95,
                isFeatured: true,
                vendor: vendorUser._id,
                images: [{ url: 'https://images.unsplash.com/photo-1590159413207-6880017de87f?w=800&q=80', alt: 'Beard Balm' }]
            },
            {
                name: 'Professional Grooming Kit',
                slug: 'professional-grooming-kit',
                description: 'Complete tools pack containing a pearwood comb, dual-sided bristle brush, and stainless steel trimming scissors.',
                brand: 'GroomMaster',
                category: categories[2]._id,
                price: 34.99,
                stock: 30,
                rating: 4.8,
                numReviews: 76,
                vendor: adminUser._id,
                images: [{ url: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=800&q=80', alt: 'Grooming Kit' }]
            },
            {
                name: 'Minoxidil Booster Serum 10%',
                slug: 'minoxidil-booster-serum-10',
                description: 'High-concentration booster drop serum for advanced hair reactivation and quick beard patch recovery.',
                brand: 'MaxGrowth',
                category: categories[1]._id,
                price: 64.99,
                stock: 40,
                rating: 4.4,
                numReviews: 67,
                vendor: vendorUser._id,
                images: [{ url: 'https://images.unsplash.com/photo-1626015253241-c7a659fa5243?w=800&q=80', alt: 'Minoxidil 10%' }]
            },
            {
                name: 'Biotin Thickening Shampoo',
                slug: 'biotin-thickening-shampoo',
                description: 'Cleanses and fortifies thin hair fibers, removing build-ups to maximize follicle density and strength.',
                brand: 'GroomMaster',
                category: categories[0]._id,
                price: 27.99,
                stock: 90,
                rating: 4.6,
                numReviews: 121,
                isFeatured: true,
                vendor: adminUser._id,
                images: [{ url: 'https://images.unsplash.com/photo-1590159413207-6880017de87f?w=800&q=80', alt: 'Shampoo' }]
            }
        ];

        await Product.insertMany(products);

        console.log('Data Imported!'.green.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await User.deleteMany();
        await Product.deleteMany();
        await Category.deleteMany();

        console.log('Data Destroyed!'.red.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
