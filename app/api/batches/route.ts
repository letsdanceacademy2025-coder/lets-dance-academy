import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Batch from '@/models/Batch';
import { verifyToken } from '@/lib/jwt';

// Helper to generate slug
const slugify = (text: string) => {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start
        .replace(/-+$/, '');            // Trim - from end
};

// GET - List all batches (Public can see published, Admin can see all)
export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const token = req.headers.get('authorization')?.split(' ')[1];
        let isAdmin = false;

        if (token) {
            const decoded = verifyToken(token);
            if (decoded && decoded.role === 'admin') {
                isAdmin = true;
            }
        }

        const query: any = {};
        if (!isAdmin) {
            query.status = 'published';
        }

        // Support pagination
        const page = parseInt(req.nextUrl.searchParams.get('page') || '1');
        const limit = parseInt(req.nextUrl.searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        const batches = await Batch.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Batch.countDocuments(query);

        return NextResponse.json({
            success: true,
            data: {
                batches,
                pagination: {
                    total,
                    page,
                    pages: Math.ceil(total / limit)
                }
            }
        });

    } catch (error) {
        console.error('Fetch batches error:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch batches' }, { status: 500 });
    }
}

// POST - Create a new batch (Admin only)
export async function POST(req: NextRequest) {
    try {
        await connectDB();

        // Auth check
        const token = req.headers.get('authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded || decoded.role !== 'admin') {
            return NextResponse.json({ success: false, message: 'Forbidden - Admin access required' }, { status: 403 });
        }

        const body = await req.json();

        // Check if slug exists or generate
        if (!body.slug && body.title) {
            body.slug = slugify(body.title);
        }

        // Validate uniqueness of slug
        const existingBatch = await Batch.findOne({ slug: body.slug });
        if (existingBatch) {
            // Append random string to make unique
            body.slug = `${body.slug}-${Date.now().toString().slice(-4)}`;
        }

        const newBatch = await Batch.create(body);

        return NextResponse.json({
            success: true,
            message: 'Batch created successfully',
            data: { batch: newBatch }
        }, { status: 201 });

    } catch (error: any) {
        console.error('Create batch error:', error);
        return NextResponse.json({
            success: false,
            message: error.message || 'Failed to create batch'
        }, { status: 500 });
    }
}
