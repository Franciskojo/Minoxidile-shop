import mongoose from 'mongoose';
import slugify from 'slug';

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
            maxlength: [200, 'Name cannot exceed 200 characters'],
        },
        slug: { type: String, unique: true },
        description: {
            type: String,
            required: [true, 'Description is required'],
        },
        shortDescription: { type: String, default: '' },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price cannot be negative'],
        },
        salePrice: {
            type: Number,
            default: 0,
            min: [0, 'Sale price cannot be negative'],
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Category is required'],
        },
        vendor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Vendor is required'],
        },
        brand: { type: String, default: '' },
        images: [
            {
                url: { type: String, required: true },
                alt: { type: String, default: '' },
            },
        ],
        stock: {
            type: Number,
            required: [true, 'Stock is required'],
            min: [0, 'Stock cannot be negative'],
            default: 0,
        },
        rating: { type: Number, default: 0, min: 0, max: 5 },
        numReviews: { type: Number, default: 0 },
        isFeatured: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
        tags: [{ type: String, trim: true }],
        weight: { type: Number, default: 0 },
        dimensions: {
            length: { type: Number, default: 0 },
            width: { type: Number, default: 0 },
            height: { type: Number, default: 0 },
        },
        location: { type: String, default: '', trim: true },
        sku: { type: String, default: '' },
    },
    { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual: effective price (sale price if set, otherwise regular price)
productSchema.virtual('effectivePrice').get(function () {
    return this.salePrice > 0 && this.salePrice < this.price
        ? this.salePrice
        : this.price;
});

// Virtual: on sale flag
productSchema.virtual('onSale').get(function () {
    return this.salePrice > 0 && this.salePrice < this.price;
});

// Virtual: discount percentage
productSchema.virtual('discountPercent').get(function () {
    if (this.salePrice > 0 && this.salePrice < this.price) {
        return Math.round(((this.price - this.salePrice) / this.price) * 100);
    }
    return 0;
});

productSchema.pre('save', async function (next) {
    if (this.isModified('name')) {
        const baseSlug = slugify(this.name, { lower: true });
        // ensure uniqueness
        let slug = baseSlug;
        let count = 1;
        while (await mongoose.models.Product.exists({ slug, _id: { $ne: this._id } })) {
            slug = `${baseSlug}-${count++}`;
        }
        this.slug = slug;
    }
    next();
});

// Index for text search
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

const Product = mongoose.model('Product', productSchema);
export default Product;
