import mongoose from 'mongoose';
import slugify from 'slug';

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Category name is required'],
            trim: true,
            unique: true,
            maxlength: [50, 'Name cannot exceed 50 characters'],
        },
        slug: { type: String, unique: true },
        description: { type: String, default: '' },
        image: { type: String, default: '' },
        parent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            default: null,
        },
        isActive: { type: Boolean, default: true },
        order: { type: Number, default: 0 },
    },
    { timestamps: true }
);

categorySchema.pre('save', function (next) {
    if (this.isModified('name')) {
        this.slug = slugify(this.name, { lower: true });
    }
    next();
});

const Category = mongoose.model('Category', categorySchema);
export default Category;
