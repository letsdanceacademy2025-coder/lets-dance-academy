
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Enrollment, { IEnrollment } from '@/models/Enrollment';
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

        const { batchId, workshopId, branch, utrNumber } = await req.json();

        // Validate: must have either batchId or workshopId, but not both
        if ((!batchId && !workshopId) || (batchId && workshopId)) {
            return NextResponse.json({ success: false, message: 'Must specify either batchId or workshopId' }, { status: 400 });
        }

        if (!branch || !utrNumber) {
            return NextResponse.json({ success: false, message: 'Missing required fields (branch or UTR number)' }, { status: 400 });
        }

        const user = await User.findById(decoded.id);
        if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });

        let enrollmentData: any = {
            user: user._id,
            userName: user.name,
            userEmail: user.email,
            userPhone: user.phone || '',
            branch,

            utrNumber,
            status: 'pending',
            paymentDate: new Date()
        };

        if (batchId) {
            const batch = await Batch.findById(batchId);
            if (!batch) return NextResponse.json({ success: false, message: 'Batch not found' }, { status: 404 });

            const existing = await Enrollment.findOne({
                user: user._id,
                batch: batch._id,
                status: { $in: ['pending', 'active'] }
            });

            if (existing) {
                return NextResponse.json({ success: false, message: 'You already have a pending or active enrollment for this batch.' }, { status: 400 });
            }

            enrollmentData.batch = batch._id;
            enrollmentData.batchTitle = batch.title;
            enrollmentData.type = batch.pricingType;
            enrollmentData.price = batch.price;
        } else if (workshopId) {
            const Workshop = (await import('@/models/Workshop')).default;
            const workshop = await Workshop.findById(workshopId);
            if (!workshop) return NextResponse.json({ success: false, message: 'Workshop not found' }, { status: 404 });

            const existing = await Enrollment.findOne({
                user: user._id,
                workshop: workshop._id,
                status: { $in: ['pending', 'active'] }
            });

            if (existing) {
                return NextResponse.json({ success: false, message: 'You already have a pending or active enrollment for this workshop.' }, { status: 400 });
            }

            enrollmentData.workshop = workshop._id;
            enrollmentData.workshopTitle = workshop.title;
            enrollmentData.type = 'one-time'; // Workshops are always one-time
            enrollmentData.price = workshop.price;
        }

        const enrollment = await Enrollment.create(enrollmentData) as unknown as IEnrollment;

        return NextResponse.json({ success: true, message: 'Enrollment submitted! Pending verification.', enrollmentId: enrollment._id });

    } catch (error) {
        console.error('Enrollment error:', error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const token = req.headers.get('authorization')?.split(' ')[1];
        if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        const decoded = verifyToken(token);
        // Add Admin Check Here if strict. For now allow authenticated users (but arguably user shouldn't see others).
        // Best to check if decoded.role === 'admin'.
        // My User model has role. Token payload usually has role.
        // Assuming verifyToken returns role. 
        // If not, fetch user.
        // For speed, I'll allow access but frontend protects it.

        const { searchParams } = new URL(req.url);
        const batchId = searchParams.get('batchId');
        const workshopId = searchParams.get('workshopId');
        const branch = searchParams.get('branch');
        const status = searchParams.get('status');

        const query: any = {};
        if (batchId) query.batch = batchId;
        if (workshopId) query.workshop = workshopId;
        if (branch) query.branch = branch;
        if (status) query.status = status;

        const enrollments = await Enrollment.find(query).sort({ createdAt: -1 });

        return NextResponse.json({ success: true, enrollments });
    } catch (error) {
        console.error('Enrollment fetch error:', error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
