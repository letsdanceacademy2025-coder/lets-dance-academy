"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { FaPlus, FaTrash, FaPencil, FaEye } from 'react-icons/fa6';

interface Batch {
    _id: string;
    title: string;
    instructor: string;
    level: string;
    status: string;
    price: number;
    pricingType: string;
    slug: string;
}

export default function ManageBatchesPage() {
    const { token } = useAuth();
    const [batches, setBatches] = useState<Batch[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchBatches = async () => {
        try {
            const response = await fetch('/api/batches?limit=100', { // Fetch all for now
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setBatches(data.data.batches);
            } else {
                setError(data.message);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to fetch batches');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBatches();
    }, [token]);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this batch?')) return;

        try {
            const response = await fetch(`/api/batches/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setBatches(batches.filter(b => b._id !== id));
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error(err);
            alert('Failed to delete batch');
        }
    };

    if (loading) return <div className="p-8">Loading batches...</div>;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight">Manage Batches</h1>
                    <p className="text-gray-500 font-bold text-sm mt-1">Create and manage your courses</p>
                </div>
                <Link
                    href="/admin/batches/create"
                    className="bg-black text-white px-6 py-3 font-bold uppercase text-sm tracking-wide hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                    <FaPlus /> New Batch
                </Link>
            </div>

            {error && <div className="bg-red-100 text-red-700 p-4 mb-6 rounded">{error}</div>}

            <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-gray-600">Title</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-gray-600">Instructor</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-gray-600">Level</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-gray-600">Price</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-gray-600">Status</th>
                            <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-widest text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {batches.map((batch) => (
                            <tr key={batch._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-sm">{batch.title}</div>
                                    <div className="text-xs text-gray-400 font-mono mt-1">/{batch.slug}</div>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium">{batch.instructor}</td>
                                <td className="px-6 py-4">
                                    <span className="inline-block px-2 py-1 text-xs font-bold uppercase bg-gray-100 text-gray-600 rounded">
                                        {batch.level}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-gray-600">
                                    {batch.price === 0 ? 'Free' : `${batch.price} ${batch.pricingType === 'recurring' ? '/mo' : ''}`}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-block px-2 py-1 text-xs font-bold uppercase rounded ${batch.status === 'published' ? 'bg-green-100 text-green-700' :
                                        batch.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-gray-100 text-gray-600'
                                        }`}>
                                        {batch.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            href={`/admin/batches/${batch._id}`}
                                            className="p-2 rounded hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition-colors"
                                            title="View Batch Details"
                                        >
                                            <FaEye />
                                        </Link>
                                        <Link
                                            href={`/admin/batches/edit/${batch._id}`}
                                            className="p-2 rounded hover:bg-gray-100 text-gray-500 hover:text-green-600 transition-colors"
                                            title="Edit"
                                        >
                                            <FaPencil />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(batch._id)}
                                            className="p-2 rounded hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors"
                                            title="Delete"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {batches.length === 0 && !loading && (
                    <div className="p-12 text-center text-gray-500">
                        No batches found. Create your first one!
                    </div>
                )}
            </div>
        </div>
    );
}
