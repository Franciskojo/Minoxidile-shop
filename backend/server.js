import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';
import colors from 'colors';

import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import vendorRoutes from './routes/vendorRoutes.js';
import vendorApplicationRoutes from './routes/vendorApplicationRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import chatSocket from './utils/chatSocket.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Environment variables validation
const validateEnv = () => {
    const warnings = [];
    if (process.env.NODE_ENV !== 'production') warnings.push('Running in development mode');
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.includes('placeholder') || process.env.JWT_SECRET.includes('minoxidile_jwt')) {
        warnings.push('JWT_SECRET is missing or using a weak/placeholder value');
    }
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('placeholder')) {
        warnings.push('STRIPE_SECRET_KEY is a placeholder (payments will fail)');
    }
    if (!process.env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_API_SECRET.includes('your_')) {
        warnings.push('Cloudinary config is missing or using placeholders (image uploads will fail)');
    }

    if (warnings.length > 0) {
        console.warn('\n⚠️  Environment Warnings:'.yellow.bold);
        warnings.forEach(w => console.warn(`   - ${w}`.yellow));
        console.warn('');
    }
};

validateEnv();

// Connect to MongoDB
connectDB();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: [
            process.env.FRONTEND_URL,
            'https://minoxidile-shop.vercel.app',
            'http://localhost:5173'
        ].filter(Boolean),
        credentials: true,
    },
});

chatSocket(io);

// Middleware
app.use(cors({
    origin: [
        process.env.FRONTEND_URL,
        'https://minoxidile-shop.vercel.app',
        'http://localhost:5173'
    ].filter(Boolean),
    credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/vendor', vendorRoutes);
app.use('/api/vendor-applications', vendorApplicationRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/contact', contactRoutes);

// Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString(), env: process.env.NODE_ENV });
});

// Error Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
    console.log(`\n🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
    console.log(`📡 API available at http://localhost:${PORT}/api`.cyan);
});
