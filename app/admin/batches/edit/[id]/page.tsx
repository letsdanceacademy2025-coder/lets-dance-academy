"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import BatchForm from '@/components/admin/BatchForm';
import { useParams } from 'next/navigation';

export default function EditBatchPage() {
    const { id } = useParams();
    const [batch, setBatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBatch = async () => {
            if (!id) return;
            try {
                const res = await fetch(`/api/batches/${id}`);
                const data = await res.json();
                if (data.success) {
                    setBatch(data.data.batch);
                } else {
                    setError(data.message);
                }
            } catch (e) {
                console.error(e);
                setError('Failed to load batch');
            } finally {
                setLoading(false);
            }
        };
        fetchBatch();
    }, [id]);

    if (loading) return <div className="p-8">Loading...</div>;
    if (error) return <div className="p-8 text-red-500 font-bold">Error: {error}</div>;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <Link href="/admin/batches" className="text-gray-500 hover:text-black mb-2 block font-bold text-sm uppercase">← Back to Batches</Link>
                    <h1 className="text-3xl font-black uppercase tracking-tight">Edit Batch</h1>
                    {batch && <p className="text-sm text-gray-500 font-mono">ID: {batch['_id']}</p>}
                </div>
            </div>
            {batch && <BatchForm initialData={batch} isEdit={true} />}
        </div>
    );
}
