
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEnrollment extends Document {
    user: mongoose.Types.ObjectId;
    userName: string;
    userEmail: string;
    userPhone?: string;
    batch?: mongoose.Types.ObjectId;
    batchTitle?: string;
    workshop?: mongoose.Types.ObjectId;
    workshopTitle?: string;
    branch: string;

    utrNumber: string;
    status: 'pending' | 'active' | 'expired' | 'rejected';
    type: 'one-time' | 'recurring';
    price: number;
    paymentDate: Date;
    validUntil?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const EnrollmentSchema = new Schema<IEnrollment>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    userPhone: { type: String },
    batch: { type: Schema.Types.ObjectId, ref: 'Batch' },
    batchTitle: { type: String },
    workshop: { type: Schema.Types.ObjectId, ref: 'Workshop' },
    workshopTitle: { type: String },
    branch: { type: String, required: true },

    utrNumber: { type: String, required: true },
    status: {
        type: String,
        enum: ['pending', 'active', 'expired', 'rejected'],
        default: 'pending'
    },
    type: {
        type: String,
        enum: ['one-time', 'recurring'],
        required: true
    },
    price: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now },
    validUntil: { type: Date },
}, { timestamps: true });

const Enrollment = mongoose.models.Enrollment || mongoose.model<IEnrollment>('Enrollment', EnrollmentSchema);
export default Enrollment;
