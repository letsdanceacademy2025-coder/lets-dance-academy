"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FaPencil, FaArrowLeft, FaGraduationCap, FaClock, FaIndianRupeeSign, FaBell, FaComments, FaStar, FaPlay, FaListCheck, FaCircleInfo, FaUsers } from 'react-icons/fa6';
import { FaTimes } from 'react-icons/fa';

export default function ViewBatchPage() {
    const { id } = useParams();
    const [batch, setBatch] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [videoModal, setVideoModal] = useState<string | null>(null);

    useEffect(() => {
        const fetchBatch = async () => {
            try {
                const res = await fetch(`/api/batches/${id}`);
                const data = await res.json();
                if (data.success) {
                    setBatch(data.data.batch);
                } else {
                    // Handle error
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchBatch();
    }, [id]);

    const getEmbedUrl = (url: string) => {
        if (!url) return '';
        if (url.includes('embed/')) return url;
        if (url.includes('watch?v=')) {
            const videoId = url.split('watch?v=')[1].split('&')[0];
            return `https://www.youtube.com/embed/${videoId}`;
        }
        if (url.includes('youtu.be/')) {
            const videoId = url.split('youtu.be/')[1].split('?')[0];
            return `https://www.youtube.com/embed/${videoId}`;
        }
        return url;
    };

    if (loading) return <div className="p-8">Loading...</div>;
    if (!batch) return <div className="p-8">Batch not found</div>;

    const TabButton = ({ id, label, icon: Icon }: any) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`px-6 py-4 font-bold uppercase text-xs tracking-wide border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === id ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
            {Icon && <Icon />} {label}
        </button>
    );

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <Link href="/admin/batches" className="text-gray-500 hover:text-black mb-2 block font-bold text-sm uppercase flex items-center gap-2">
                        <FaArrowLeft /> Back to Batches
                    </Link>
                    <h1 className="text-3xl font-black uppercase tracking-tight">{batch.title}</h1>
                    <p className="text-gray-500 font-bold mt-2 flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-xs uppercase ${batch.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {batch.status}
                        </span>
                        <span>•</span>
                        <span>{batch.instructor}</span>
                    </p>
                </div>
                <Link
                    href={`/admin/batches/edit/${batch._id}`}
                    className="bg-black text-white px-6 py-3 font-bold uppercase text-sm tracking-wide hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                    <FaPencil /> Edit Batch
                </Link>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 overflow-x-auto">
                <TabButton id="overview" label="Overview" icon={FaCircleInfo} />
                <TabButton id="curriculum" label="Curriculum" icon={FaListCheck} />
                <TabButton id="reviews" label="Reviews" icon={FaComments} />
                <TabButton id="notifications" label="Notifications" icon={FaBell} />
                <TabButton id="students" label="Enrolled Students" icon={FaUsers} />
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
                        <div className="lg:col-span-2">
                            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                                <h3 className="font-bold uppercase tracking-wide mb-4 text-sm text-gray-400">About this course</h3>
                                <p className="whitespace-pre-wrap leading-relaxed text-gray-700">{batch.description}</p>
                            </div>
                        </div>
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                {batch.coverImage && (
                                    <div className="relative group cursor-pointer" onClick={() => batch.videoPreview && setVideoModal(batch.videoPreview)}>
                                        <img src={batch.coverImage} className="w-full aspect-video object-cover rounded-lg mb-6" alt="Cover" />
                                        {/* Play icon overlay for preview video if exists */}
                                        {batch.videoPreview && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors rounded-lg">
                                                <FaPlay className="text-white w-10 h-10 drop-shadow-lg opacity-80 group-hover:scale-110 transition-transform" />
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between py-2 border-b border-gray-50">
                                        <span className="text-gray-400 text-xs font-bold uppercase">Price</span>
                                        <span className="font-black text-xl flex items-center gap-1">
                                            <FaIndianRupeeSign className="w-4 h-4" />
                                            {batch.price === 0 ? 'Free' : batch.price}
                                            {batch.pricingType === 'recurring' && <span className="text-xs font-normal text-gray-400">/mo</span>}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-gray-50">
                                        <span className="text-gray-400 text-xs font-bold uppercase">Level</span>
                                        <span className="font-bold text-sm flex items-center gap-2"><FaGraduationCap className="text-gray-300" /> {batch.level}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-gray-50">
                                        <span className="text-gray-400 text-xs font-bold uppercase">Duration</span>
                                        <span className="font-bold text-sm flex items-center gap-2"><FaClock className="text-gray-300" /> {batch.duration}</span>
                                    </div>
                                    {batch.schedule && (
                                        <div className="pt-2">
                                            <span className="text-gray-400 text-xs font-bold uppercase block mb-1">Schedule</span>
                                            <span className="font-bold text-sm block">{batch.schedule}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'curriculum' && (
                    <div className="max-w-4xl animate-fade-in">
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold uppercase tracking-wide mb-6 text-sm text-gray-400">Curriculum Structure</h3>
                            <div className="space-y-4">
                                {batch.modules?.map((module: any, i: number) => (
                                    <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                                        <div className="bg-gray-50 px-6 py-4 font-bold flex justify-between">
                                            <span>{module.title}</span>
                                            <span className="text-xs bg-white border px-2 py-1 rounded text-gray-500 uppercase">{module.sections?.length || 0} Lessons</span>
                                        </div>
                                        <div className="divide-y divide-gray-100">
                                            {module.sections?.map((section: any, j: number) => (
                                                <div key={j} className="px-6 py-3 text-sm flex items-center justify-between text-gray-700 hover:bg-gray-50 group">
                                                    <div className="flex items-center gap-3">
                                                        <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">{j + 1}</span>
                                                        <span>{section.title}</span>
                                                        {section.isFree && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded uppercase font-bold">Free</span>}
                                                    </div>

                                                    {section.videoUrl && (
                                                        <button
                                                            onClick={() => setVideoModal(section.videoUrl)}
                                                            className="flex items-center gap-2 text-xs font-bold uppercase bg-gray-100 px-3 py-1.5 rounded text-gray-600 hover:bg-black hover:text-white transition-colors"
                                                        >
                                                            <FaPlay className="w-3 h-3" /> Play Video
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                {(!batch.modules || batch.modules.length === 0) && <p className="text-gray-400 italic">No curriculum added yet.</p>}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div className="max-w-4xl animate-fade-in">
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="space-y-6">
                                {batch.reviews?.map((review: any, i: number) => (
                                    <div key={i} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="font-bold text-sm">{review.userName}</div>
                                            <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex text-yellow-400 text-xs mb-2">
                                            {[...Array(5)].map((_, stars) => (
                                                <FaStar key={stars} className={stars < review.rating ? "text-yellow-400" : "text-gray-200"} />
                                            ))}
                                        </div>
                                        <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                                    </div>
                                ))}
                                {(!batch.reviews || batch.reviews.length === 0) && <p className="text-gray-400 italic text-sm">No reviews yet.</p>}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'notifications' && (
                    <div className="max-w-4xl animate-fade-in">
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="space-y-4">
                                {batch.notifications?.map((note: any, i: number) => (
                                    <div key={i} className={`p-4 rounded border-l-4 text-sm ${note.type === 'error' ? 'border-red-500 bg-red-50' :
                                        note.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                                            note.type === 'success' ? 'border-green-500 bg-green-50' :
                                                'border-blue-500 bg-blue-50'
                                        }`}>
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="font-bold text-sm">{note.title}</div>
                                            <div className="text-xs text-gray-400">{new Date(note.date).toLocaleDateString()}</div>
                                        </div>
                                        <div className="text-gray-600 leading-relaxed">{note.message}</div>
                                    </div>
                                ))}
                                {(!batch.notifications || batch.notifications.length === 0) && <p className="text-gray-400 italic text-sm">No active notifications.</p>}
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'students' && (
                    <div className="max-w-4xl animate-fade-in">
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center py-20">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaUsers className="text-gray-400 text-2xl" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Enrolled Students</h3>
                            <p className="text-gray-500 mb-6">Student enrollment management and tracking will be implemented here.</p>
                            <div className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg font-bold text-sm">
                                <span>Total Enrolled:</span>
                                <span>0</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Video Modal */}
            {videoModal && (
                <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in zoom-in duration-200">
                    <button
                        className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors p-2 z-10"
                        onClick={() => setVideoModal(null)}
                    >
                        <FaTimes size={32} />
                    </button>
                    <div className="w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 relative">
                        <iframe
                            src={getEmbedUrl(videoModal)}
                            className="w-full h-full"
                            title="Video Preview"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}
        </div>
    );
}
