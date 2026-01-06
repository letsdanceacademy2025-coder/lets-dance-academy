"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FaPencil, FaArrowLeft, FaGraduationCap, FaClock, FaIndianRupeeSign, FaBell, FaComments, FaStar, FaPlay, FaListCheck, FaCircleInfo, FaUsers, FaCheck, FaXmark } from 'react-icons/fa6';
import { FaTimes, FaExternalLinkAlt } from 'react-icons/fa';

export default function ViewWorkshopPage() {
    const { id } = useParams();
    const [workshop, setWorkshop] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [videoModal, setVideoModal] = useState<string | null>(null);
    const [enrollments, setEnrollments] = useState<any[]>([]);
    const [loadingEnrollments, setLoadingEnrollments] = useState(false);

    useEffect(() => {
        const fetchWorkshop = async () => {
            try {
                const res = await fetch(`/api/workshops/${id}`);
                const data = await res.json();
                if (data.success) {
                    setWorkshop(data.data.workshop);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchWorkshop();
    }, [id]);

    const fetchEnrollments = async () => {
        if (!id) return;
        setLoadingEnrollments(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/enrollments?workshopId=${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setEnrollments(data.enrollments);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingEnrollments(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'students') {
            fetchEnrollments();
        }
    }, [activeTab, id]);

    const updateEnrollmentStatus = async (enrollmentId: string, status: string) => {
        if (!confirm(`Are you sure you want to mark this registration as ${status}?`)) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/enrollments/${enrollmentId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });
            const data = await res.json();
            if (data.success) {
                fetchEnrollments();
                alert(`Registration marked as ${status}`);
            } else {
                alert(data.message);
            }
        } catch (e) {
            alert('Error updating status');
        }
    };

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
    if (!workshop) return <div className="p-8">Workshop not found</div>;

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
                    <Link href="/admin/workshops" className="text-gray-500 hover:text-black mb-2 block font-bold text-sm uppercase flex items-center gap-2">
                        <FaArrowLeft /> Back to Workshops
                    </Link>
                    <h1 className="text-3xl font-black uppercase tracking-tight">{workshop.title}</h1>
                    <p className="text-gray-500 font-bold mt-2 flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-xs uppercase ${workshop.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {workshop.status}
                        </span>
                        <span>•</span>
                        <span>{workshop.instructor}</span>
                    </p>
                </div>
                <Link
                    href={`/admin/workshops/edit/${workshop._id}`}
                    className="bg-black text-white px-6 py-3 font-bold uppercase text-sm tracking-wide hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                    <FaPencil /> Edit Workshop
                </Link>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 overflow-x-auto">
                <TabButton id="overview" label="Overview" icon={FaCircleInfo} />
                <TabButton id="lessons" label="Lessons" icon={FaListCheck} />
                <TabButton id="reviews" label="Reviews" icon={FaComments} />
                <TabButton id="notifications" label="Notifications" icon={FaBell} />
                <TabButton id="students" label="Registered Students" icon={FaUsers} />
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
                        <div className="lg:col-span-2">
                            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                                <h3 className="font-bold uppercase tracking-wide mb-4 text-sm text-gray-400">About this workshop</h3>
                                <p className="whitespace-pre-wrap leading-relaxed text-gray-700">{workshop.description}</p>
                            </div>

                            {workshop.instructorImage && (
                                <div className="mt-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                    <h3 className="font-bold uppercase tracking-wide mb-4 text-sm text-gray-400">Instructor</h3>
                                    <div className="flex gap-4 items-start">
                                        <img src={workshop.instructorImage} alt={workshop.instructor} className="w-24 h-24 object-cover rounded-lg" />
                                        <div>
                                            <h4 className="font-bold text-lg">{workshop.instructor}</h4>
                                            {workshop.instructorBio && <p className="text-sm text-gray-600 mt-2">{workshop.instructorBio}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                                <div className="flex items-center gap-4 text-gray-700">
                                    <FaClock />
                                    <span className="font-bold text-sm">Duration:</span>
                                    <span>{workshop.duration}</span>
                                </div>
                                <div className="flex items-center gap-4 text-gray-700">
                                    <FaIndianRupeeSign />
                                    <span className="font-bold text-sm">Price:</span>
                                    <span>{workshop.price === 0 ? 'Free' : `₹${workshop.price}`}</span>
                                </div>
                                <div className="flex items-center gap-4 text-gray-700">
                                    <FaGraduationCap />
                                    <span className="font-bold text-sm">Level:</span>
                                    <span>{workshop.level}</span>
                                </div>
                                {workshop.schedule && (
                                    <div className="flex items-center gap-4 text-gray-700">
                                        <FaClock />
                                        <span className="font-bold text-sm">Schedule:</span>
                                        <span className="text-sm">{workshop.schedule}</span>
                                    </div>
                                )}
                            </div>

                            {workshop.videoPreview && (
                                <div className="mt-6">
                                    <h3 className="font-bold uppercase tracking-wide mb-2 text-xs text-gray-400">Preview</h3>
                                    <div
                                        className="aspect-video bg-gray-100 rounded-xl overflow-hidden relative group cursor-pointer"
                                        onClick={() => setVideoModal(workshop.videoPreview)}
                                    >
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-black group-hover:scale-110 transition-transform shadow-lg">
                                                <FaPlay className="ml-1" />
                                            </div>
                                        </div>
                                        <img
                                            src={`https://img.youtube.com/vi/${workshop.videoPreview.split('v=')[1] ? workshop.videoPreview.split('v=')[1].split('&')[0] : workshop.videoPreview.split('/').pop()}/mqdefault.jpg`}
                                            alt="Preview"
                                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'lessons' && (
                    <div className="max-w-4xl animate-fade-in">
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="space-y-4">
                                {workshop.lessons?.map((lesson: any, i: number) => (
                                    <div key={i} className="border border-gray-200 rounded-xl p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold shrink-0">
                                                {i + 1}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div>
                                                        <h4 className="font-bold">{lesson.title}</h4>
                                                        {lesson.description && <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>}
                                                        {lesson.videoUrl && <p className="text-xs text-blue-600 mt-2 font-mono truncate">{lesson.videoUrl}</p>}
                                                    </div>
                                                    {lesson.isFree && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold uppercase shrink-0">Free Preview</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {(!workshop.lessons || workshop.lessons.length === 0) && <p className="text-gray-400 italic text-sm">No lessons added yet.</p>}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div className="max-w-4xl animate-fade-in">
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="space-y-6">
                                {workshop.reviews?.map((review: any, i: number) => (
                                    <div key={i} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="font-bold">{review.userName}</div>
                                            <div className="text-yellow-500 text-xs flex gap-0.5">
                                                {[...Array(5)].map((_, s) => (
                                                    <FaStar key={s} className={s < review.rating ? 'text-yellow-400' : 'text-gray-200'} />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="text-gray-600 text-sm leading-relaxed">"{review.comment}"</div>
                                        <div className="text-xs text-gray-400 mt-2">{new Date(review.createdAt).toLocaleDateString()}</div>
                                    </div>
                                ))}
                                {(!workshop.reviews || workshop.reviews.length === 0) && <p className="text-gray-400 italic text-sm">No reviews yet.</p>}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'notifications' && (
                    <div className="max-w-4xl animate-fade-in">
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="space-y-4">
                                {workshop.notifications?.map((note: any, i: number) => (
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
                                {(!workshop.notifications || workshop.notifications.length === 0) && <p className="text-gray-400 italic text-sm">No active notifications.</p>}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'students' && (
                    <div className="animate-fade-in">
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-lg">Registered Students</h3>
                                <div className="text-sm font-bold bg-gray-100 px-3 py-1 rounded">Total: {enrollments.length}</div>
                            </div>

                            {loadingEnrollments ? (
                                <div className="text-center py-8 text-gray-500">Loading students...</div>
                            ) : enrollments.length === 0 ? (
                                <div className="text-center py-12 text-gray-400 italic">No students registered for this workshop yet.</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-gray-200 text-xs text-gray-400 uppercase tracking-widest">
                                                <th className="py-4 font-bold">Student</th>
                                                <th className="py-4 font-bold">Contact</th>
                                                <th className="py-4 font-bold">Branch</th>
                                                <th className="py-4 font-bold">Registered</th>
                                                <th className="py-4 font-bold">Payment</th>
                                                <th className="py-4 font-bold">UTR Number</th>

                                                <th className="py-4 font-bold">Status</th>
                                                <th className="py-4 font-bold text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {enrollments.map(enr => (
                                                <tr key={enr._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors text-sm">
                                                    <td className="py-4">
                                                        <div className="font-bold">{enr.userName}</div>
                                                        <div className="text-xs text-gray-400">{enr.userEmail}</div>
                                                    </td>
                                                    <td className="py-4">{enr.userPhone || '-'}</td>
                                                    <td className="py-4 capitalize">
                                                        {enr.branch === 'sambhaji-nagar' ? 'Sambhaji Nagar' : 'Balaji Nagar'}
                                                    </td>
                                                    <td className="py-4 text-gray-500">{new Date(enr.paymentDate || enr.createdAt).toLocaleDateString()}</td>
                                                    <td className="py-4 font-bold">₹{enr.price}</td>
                                                    <td className="py-4">
                                                        <div className="font-mono text-xs font-bold text-gray-700">{enr.utrNumber || '-'}</div>
                                                    </td>

                                                    <td className="py-4">
                                                        <span className={`px-2 py-1 rounded text-xs uppercase font-bold tracking-wide ${enr.status === 'active' ? 'bg-green-100 text-green-700' :
                                                            enr.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                                enr.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                                                            }`}>{enr.status}</span>
                                                    </td>
                                                    <td className="py-4 text-right">
                                                        {enr.status === 'pending' && (
                                                            <div className="flex justify-end gap-2">
                                                                <button
                                                                    onClick={() => updateEnrollmentStatus(enr._id, 'active')}
                                                                    className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-colors"
                                                                    title="Approve"
                                                                >
                                                                    <FaCheck />
                                                                </button>
                                                                <button
                                                                    onClick={() => updateEnrollmentStatus(enr._id, 'rejected')}
                                                                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors"
                                                                    title="Reject"
                                                                >
                                                                    <FaXmark />
                                                                </button>
                                                            </div>
                                                        )}
                                                        {enr.status !== 'pending' && (
                                                            <span className="text-gray-300 text-xs italic">Processed</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
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
