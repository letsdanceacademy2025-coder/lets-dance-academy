
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Batch from '@/models/Batch';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await connectDB();

        const token = req.headers.get('authorization')?.split(' ')[1];
        if (!token) return NextResponse.json({ success: false, message: 'Unauthorized, please login' }, { status: 401 });

        const decoded = verifyToken(token);
        if (!decoded || !decoded.id) return NextResponse.json({ success: false, message: 'Invalid session' }, { status: 401 });

        const { rating, comment } = await req.json();
        if (!rating || !comment) {
            return NextResponse.json({ success: false, message: 'Rating and Comment are required' }, { status: 400 });
        }

        const user = await User.findById(decoded.id);
        if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });

        const batch = await Batch.findById(id);
        if (!batch) return NextResponse.json({ success: false, message: 'Batch not found' }, { status: 404 });

        // Allow multiple reviews by commenting out the duplicate check
        // const existing = batch.reviews.find((r: any) => r.user.toString() === decoded.id);
        // if (existing) { ... }

        batch.reviews.push({
            user: user._id,
            userName: user.name,
            rating,
            comment,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await batch.save();

        return NextResponse.json({ success: true, message: 'Review added successfully' });

    } catch (error) {
        console.error('Review submission error:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await connectDB();

        const token = req.headers.get('authorization')?.split(' ')[1];
        if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        const decoded = verifyToken(token);
        if (!decoded || !decoded.id) return NextResponse.json({ success: false, message: 'Invalid session' }, { status: 401 });

        const { rating, comment, reviewId } = await req.json();

        const batch = await Batch.findById(id);
        if (!batch) return NextResponse.json({ success: false, message: 'Batch not found' }, { status: 404 });

        // If reviewId is provided, find specific review
        let reviewIndex = -1;
        if (reviewId) {
            reviewIndex = batch.reviews.findIndex((r: any) => r._id.toString() === reviewId);
        } else {
            // Fallback to finding first review by user (legacy support)
            reviewIndex = batch.reviews.findIndex((r: any) => r.user.toString() === decoded.id);
        }

        if (reviewIndex === -1) {
            return NextResponse.json({ success: false, message: 'Review not found' }, { status: 404 });
        }

        // Verify ownership
        if (batch.reviews[reviewIndex].user.toString() !== decoded.id) {
            return NextResponse.json({ success: false, message: 'Unauthorized review update' }, { status: 403 });
        }

        batch.reviews[reviewIndex].rating = rating || batch.reviews[reviewIndex].rating;
        batch.reviews[reviewIndex].comment = comment || batch.reviews[reviewIndex].comment;
        batch.reviews[reviewIndex].updatedAt = new Date();

        await batch.save();

        return NextResponse.json({ success: true, message: 'Review updated successfully' });

    } catch (error) {
        console.error('Review update error:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
