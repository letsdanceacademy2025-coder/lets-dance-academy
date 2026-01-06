
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Enrollment from '@/models/Enrollment';
import { verifyToken } from '@/lib/jwt';
import { sendEnrollmentStatusEmail } from '@/lib/email';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await connectDB();

        const token = req.headers.get('authorization')?.split(' ')[1];
        if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        const decoded = verifyToken(token);
        if (!decoded || !decoded.id) return NextResponse.json({ success: false, message: 'Invalid session' }, { status: 401 });

        // Ideally check if admin
        // ...

        const { status, action } = await req.json();

        const enrollment = await Enrollment.findById(id);
        if (!enrollment) return NextResponse.json({ success: false, message: 'Enrollment not found' }, { status: 404 });

        if (action === 'extend') {
            // Extend validity
            const currentValidUntil = enrollment.validUntil ? new Date(enrollment.validUntil) : new Date();
            const baseDate = currentValidUntil < new Date() ? new Date() : currentValidUntil;

            // Move to next month
            const nextDate = new Date(baseDate);
            nextDate.setMonth(nextDate.getMonth() + 1);

            // Set to end of that month
            const endOfMonth = new Date(nextDate.getFullYear(), nextDate.getMonth() + 1, 0, 23, 59, 59, 999);

            enrollment.validUntil = endOfMonth;
            enrollment.paymentDate = new Date();
            enrollment.status = 'active';
            await enrollment.save();

            return NextResponse.json({ success: true, message: 'Subscription extended successfully' });
        }

        enrollment.status = status;

        if (status === 'active') {
            if (enrollment.type === 'recurring') {
                // Set validUntil to the end of the current month
                const now = new Date();
                const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
                enrollment.validUntil = endOfMonth;
            } else {
                // One-time payment (Lifetime) implies no expiry
                enrollment.validUntil = undefined;
            }
        }

        await enrollment.save();

        if (status === 'active' || status === 'rejected') {
            const courseTitle = enrollment.batchTitle || enrollment.workshopTitle || 'Course';
            const type = enrollment.batch ? 'batch' : 'workshop';

            // Run email in background
            sendEnrollmentStatusEmail(
                enrollment.userEmail,
                enrollment.userName,
                status,
                courseTitle,
                type
            ).catch(err => console.error('Failed to send status email:', err));
        }

        return NextResponse.json({ success: true, message: 'Enrollment status updated successfully' });

    } catch (error) {
        console.error('Enrollment update error:', error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
