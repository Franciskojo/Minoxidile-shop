import mongoose from 'mongoose';

const vendorApplicationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        storeName: {
            type: String,
            required: [true, 'Store name is required'],
            trim: true,
        },
        storeDescription: {
            type: String,
            required: [true, 'Store description is required'],
        },
        businessEmail: {
            type: String,
            required: [true, 'Business email is required'],
            lowercase: true,
            trim: true,
        },
        businessPhone: {
            type: String,
            required: [true, 'Business phone is required'],
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
        adminComment: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }
);

const VendorApplication = mongoose.model('VendorApplication', vendorApplicationSchema);
export default VendorApplication;
