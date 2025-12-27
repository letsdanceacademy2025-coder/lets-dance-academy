import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Batch from '@/models/Batch';
import { verifyToken } from '@/lib/jwt';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper to extract public ID
const getPublicIdFromUrl = (url: string) => {
    if (!url || !url.includes('/upload/')) return null;
    try {
        const parts = url.split('/upload/');
        const pathParts = parts[1].split('/');
        // Remove version if present
        if (pathParts[0].startsWith('v') && !isNaN(Number(pathParts[0].substring(1)))) {
            pathParts.shift();
        }
        return pathParts.join('/').split('.')[0];
    } catch (error) {
        return null;
    }
};

// GET - Get single batch (by ID or Slug)
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        let batch;
        if (mongoose.Types.ObjectId.isValid(id)) {
            batch = await Batch.findById(id);
        }

        if (!batch) {
            batch = await Batch.findOne({ slug: id });
        }

        if (!batch) {
            return NextResponse.json({ success: false, message: 'Batch not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: { batch } });

    } catch (error) {
        console.error('Fetch batch error:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch batch' }, { status: 500 });
    }
}

// PATCH - Update batch (Admin only)
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        const token = req.headers.get('authorization')?.split(' ')[1];
        if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

        const decoded = verifyToken(token);
        if (!decoded || decoded.role !== 'admin') {
            return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
        }

        const body = await req.json();

        // Update logic
        let batch;
        if (mongoose.Types.ObjectId.isValid(id)) {
            batch = await Batch.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        } else {
            batch = await Batch.findOneAndUpdate({ slug: id }, body, { new: true, runValidators: true });
        }

        if (!batch) {
            return NextResponse.json({ success: false, message: 'Batch not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Batch updated successfully',
            data: { batch }
        });

    } catch (error: any) {
        console.error('Update batch error:', error);
        return NextResponse.json({ success: false, message: error.message || 'Failed to update batch' }, { status: 500 });
    }
}

// DELETE - Delete batch (Admin only)
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        const token = req.headers.get('authorization')?.split(' ')[1];
        if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

        const decoded = verifyToken(token);
        if (!decoded || decoded.role !== 'admin') {
            return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
        }

        // Find batch first to get image URL
        let batch;
        if (mongoose.Types.ObjectId.isValid(id)) {
            batch = await Batch.findById(id);
        } else {
            batch = await Batch.findOne({ slug: id });
        }

        if (!batch) {
            return NextResponse.json({ success: false, message: 'Batch not found' }, { status: 404 });
        }

        // Delete image from Cloudinary if exists
        if (batch.coverImage) {
            const publicId = getPublicIdFromUrl(batch.coverImage);
            if (publicId) {
                try {
                    await cloudinary.uploader.destroy(publicId);
                    console.log(`Deleted Cloudinary image: ${publicId}`);
                } catch (err) {
                    console.error('Failed to delete Cloudinary image:', err);
                    // Continue to delete batch even if image delete fails
                }
            }
        }

        // Delete batch from DB
        await batch.deleteOne();

        return NextResponse.json({
            success: true,
            message: 'Batch deleted successfully'
        });

    } catch (error) {
        console.error('Delete batch error:', error);
        return NextResponse.json({ success: false, message: 'Failed to delete batch' }, { status: 500 });
    }
}
