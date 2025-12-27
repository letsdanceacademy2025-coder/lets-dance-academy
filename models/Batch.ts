import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface for Review
export interface IReview {
    updatedAt: Date;
    user: mongoose.Types.ObjectId;
    userName: string; // Snapshot of user name
    rating: number;
    comment: string;
    createdAt: Date;
}

// Interface for Notification
export interface INotification {
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    date: Date;
}

// Interface for Section
export interface ISection {
    title: string;
    videoUrl: string; // YouTube video link or iframe src
    isFree?: boolean; // For preview purposes
}

// Interface for Module
export interface IModule {
    title: string;
    sections: ISection[];
}

// Main Batch Interface
export interface IBatch extends Document {
    title: string;
    slug: string; // URL-friendly identifier
    description: string;
    instructor: string; // Name of instructor
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';

    // Pricing
    pricingType: 'one-time' | 'recurring';
    price: number;
    currency: string;

    // Details
    duration: string; // e.g., "4 Weeks" or "Lifetime"
    schedule?: string; // e.g., "Mon, Wed, Fri - 6:00 PM"
    coverImage?: string;
    videoPreview?: string; // YouTube preview link

    // Content
    modules: IModule[];

    // Engagement
    reviews: IReview[];
    notifications: INotification[];

    // Status
    status: 'draft' | 'published';

    createdAt: Date;
    updatedAt: Date;
}

// Schemas
const SectionSchema = new Schema<ISection>({
    title: { type: String, required: true },
    videoUrl: { type: String, required: true },
    isFree: { type: Boolean, default: false }
});

const ModuleSchema = new Schema<IModule>({
    title: { type: String, required: true },
    sections: [SectionSchema]
});

const ReviewSchema = new Schema<IReview>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const NotificationSchema = new Schema<INotification>({
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['info', 'success', 'warning', 'error'], default: 'info' },
    date: { type: Date, default: Date.now }
});

const BatchSchema = new Schema<IBatch>(
    {
        title: { type: String, required: [true, 'Title is required'], trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
        description: { type: String, required: [true, 'Description is required'] },
        instructor: { type: String, required: [true, 'Instructor name is required'] },
        level: {
            type: String,
            enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
            default: 'All Levels'
        },
        pricingType: {
            type: String,
            enum: ['one-time', 'recurring'],
            required: true,
            default: 'one-time'
        },
        price: { type: Number, required: true, min: 0 },
        currency: { type: String, default: 'INR' },

        duration: { type: String, required: true }, // e.g. "4 Weeks" or "Infinite"
        schedule: { type: String },
        coverImage: { type: String },
        videoPreview: { type: String },

        modules: [ModuleSchema],
        reviews: [ReviewSchema],
        notifications: [NotificationSchema],

        status: {
            type: String,
            enum: ['draft', 'published'],
            default: 'draft'
        }
    },
    {
        timestamps: true
    }
);

// Prevent model recompilation in development
const Batch: Model<IBatch> = mongoose.models.Batch || mongoose.model<IBatch>('Batch', BatchSchema);

export default Batch;
