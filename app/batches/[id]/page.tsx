
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import CourseContent from '@/components/CourseContent';
import BatchEnrollment from '@/components/BatchEnrollment';
import connectDB from '@/lib/db';
import Batch from '@/models/Batch';
import User from '@/models/User';
import { notFound } from 'next/navigation';

export default async function BatchDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    await connectDB();

    let batch = null;
    try {
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            batch = await Batch.findOne({ _id: id, status: 'published' }).populate('reviews.user', 'name profilePicture');
        }
        if (!batch) {
            batch = await Batch.findOne({ slug: id, status: 'published' }).populate('reviews.user', 'name profilePicture');
        }
    } catch (e) {
        console.error("Batch fetch error", e);
    }

    if (!batch) {
        return notFound();
    }

    // Transform Data for Components
    const syllabus = batch.modules?.map((m: any) => ({
        title: m.title,
        sections: m.sections?.map((s: any) => s.title) || []
    })) || [];

    const reviews = batch.reviews?.map((r: any, i: number) => ({
        id: r._id ? r._id.toString() : i.toString(),
        userId: r.user?._id ? r.user._id.toString() : (r.user ? r.user.toString() : ''),
        user: r.user?.name || r.userName || 'User',
        userImage: r.user?.profilePicture || '',
        rating: r.rating,
        comment: r.comment,
        date: new Date(r.createdAt).toLocaleDateString()
    })) || [];

    const notifications = batch.notifications?.map((n: any, i: number) => ({
        id: n._id ? n._id.toString() : i.toString(),
        title: n.title,
        message: n.message,
        date: new Date(n.date).toLocaleDateString(),
        type: n.type
    })) || [];

    const embedUrl = (url: string) => {
        if (!url) return '';
        if (url.includes('embed/')) return url;
        if (url.includes('watch?v=')) return `https://www.youtube.com/embed/${url.split('watch?v=')[1].split('&')[0]}`;
        if (url.includes('youtu.be/')) return `https://www.youtube.com/embed/${url.split('youtu.be/')[1].split('?')[0]}`;
        return url;
    };

    // Format Price based on type
    let priceDisplay = batch.price === 0 ? 'Free' : `₹${batch.price}`;
    if (batch.pricingType === 'recurring' && batch.price > 0) {
        priceDisplay += ' / Month';
    }

    return (
        <div className="bg-white text-black min-h-screen font-sans selection:bg-blue-600 selection:text-white">
            <Header />

            <main className="pt-20">
                <section className="bg-neutral-900 text-white py-20">
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <Link href="/batches" className="text-gray-400 text-sm font-bold uppercase tracking-widest hover:text-white mb-6 block">← Back to Batches</Link>
                            <span className="bg-blue-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-widest mb-4 inline-block">{batch.level}</span>
                            <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-6 leading-none">{batch.title}</h1>
                            <p className="text-xl text-gray-300 max-w-xl font-medium leading-relaxed mb-8">
                                {batch.description}
                            </p>
                            <div className="flex flex-col gap-4">
                                <BatchEnrollment
                                    batchId={batch._id.toString()}
                                    price={priceDisplay}
                                    pricingType={batch.pricingType}
                                />
                                <button className="border-2 border-white px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors w-full">
                                    Watch Preview
                                </button>
                            </div>
                        </div>
                        <div className="relative aspect-video border border-white/20 bg-neutral-800">
                            {batch.videoPreview ? (
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`${embedUrl(batch.videoPreview)}?rel=0&modestbranding=1`}
                                    title={batch.title}
                                    className="absolute inset-0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500 font-bold uppercase">
                                    No Preview Available
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="md:col-span-2">
                            <CourseContent
                                batchId={batch._id.toString()}
                                syllabus={syllabus}
                                isPurchased={false}
                                notifications={notifications}
                                reviews={reviews}
                            />
                        </div>

                        <div className="border border-gray-200 p-8 h-fit bg-gray-50">
                            <h3 className="text-xl font-black uppercase tracking-tight mb-6">Class Details</h3>
                            <ul className="space-y-6 text-sm font-medium">
                                <li className="flex justify-between border-b border-gray-200 pb-2">
                                    <span className="text-gray-500 uppercase tracking-wide">Instructor</span>
                                    <span className="font-bold">{batch.instructor}</span>
                                </li>
                                <li className="flex justify-between border-b border-gray-200 pb-2">
                                    <span className="text-gray-500 uppercase tracking-wide">Schedule</span>
                                    <span className="font-bold text-right max-w-[150px]">{batch.schedule || 'Flexibile'}</span>
                                </li>
                                <li className="flex justify-between border-b border-gray-200 pb-2">
                                    <span className="text-gray-500 uppercase tracking-wide">Duration</span>
                                    <span className="font-bold">{batch.duration}</span>
                                </li>
                                <li className="flex justify-between border-b border-gray-200 pb-2">
                                    <span className="text-gray-500 uppercase tracking-wide">Price</span>
                                    <span className="font-bold">{priceDisplay}</span>
                                </li>
                                {batch.pricingType === 'recurring' && (
                                    <li className="flex justify-between border-b border-gray-200 pb-2">
                                        <span className="text-gray-500 uppercase tracking-wide">Payment Type</span>
                                        <span className="font-bold">Subscription</span>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div >
    );
}
