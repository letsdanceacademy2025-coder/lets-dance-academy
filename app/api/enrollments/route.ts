
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Enrollment from '@/models/Enrollment';
import Batch from '@/models/Batch';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const token = req.headers.get('authorization')?.split(' ')[1];
        if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        const decoded = verifyToken(token);
        if (!decoded || !decoded.id) return NextResponse.json({ success: false, message: 'Invalid session' }, { status: 401 });

        const { batchId, branch, screenshot } = await req.json();

        if (!batchId || !branch || !screenshot) {
            return NextResponse.json({ success: false, message: 'Missing fields' }, { status: 400 });
        }

        const user = await User.findById(decoded.id);
        if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });

        const batch = await Batch.findById(batchId);
        if (!batch) return NextResponse.json({ success: false, message: 'Batch not found' }, { status: 404 });

        // Check if pending enrollment already exists?
        const existing = await Enrollment.findOne({
            user: user._id,
            batch: batch._id,
            status: 'pending'
        });

        if (existing) {
            return NextResponse.json({ success: false, message: 'You already have a pending enrollment for this batch.' }, { status: 400 });
        }

        // Create Enrollment
        const enrollment = await Enrollment.create({
            user: user._id,
            userName: user.name,
            userEmail: user.email,
            userPhone: user.phone || '',
            batch: batch._id,
            batchTitle: batch.title,
            branch,
            screenshot,
            status: 'pending',
            type: batch.pricingType,
            price: batch.price,
            paymentDate: new Date()
        });

        return NextResponse.json({ success: true, message: 'Enrollment submitted! Pending verification.', enrollmentId: enrollment._id });

    } catch (error) {
        console.error('Enrollment error:', error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
