"use client";
import React from 'react';
import Link from 'next/link';
import BatchForm from '@/components/admin/BatchForm';

export default function CreateBatchPage() {
    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <Link href="/admin/batches" className="text-gray-500 hover:text-black mb-2 block font-bold text-sm uppercase">← Back to Batches</Link>
                    <h1 className="text-3xl font-black uppercase tracking-tight">Create New Batch</h1>
                </div>
            </div>
            <BatchForm />
        </div>
    );
}
