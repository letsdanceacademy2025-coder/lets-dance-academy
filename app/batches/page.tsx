
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import connectDB from '@/lib/db';
import Batch from '@/models/Batch';

// Ensure data is fresh on every request
export const dynamic = 'force-dynamic';

export default async function BatchesPage() {
    await connectDB();
    // Fetch only published batches
    const batches = await Batch.find({ status: 'published' }).sort({ createdAt: -1 });

    return (
        <div className="bg-white text-black min-h-screen font-sans selection:bg-blue-600 selection:text-white">
            <Header />

            <main className="pt-20">
                <section className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="mb-16">
                            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">Our Batches</h1>
                            <p className="text-xl text-gray-600 max-w-2xl font-medium leading-relaxed mb-4">
                                Choose from a variety of dance styles tailored to different skill levels. Whether you are stepping on the floor for the first time or looking to refine your technique, we have a class for you.
                            </p>
                            <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
                                Available at: Sambhaji Nagar & Balaji Nagar Branches
                            </p>
                        </div>

                        {batches.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {batches.map((batch: any, i: number) => (
                                    <Link
                                        href={`/batches/${batch._id}`}
                                        key={batch._id}
                                        className="group border border-gray-200 hover:border-blue-600 transition-colors bg-gray-50 flex flex-col h-full cursor-pointer"
                                    >
                                        <div className="relative h-64 overflow-hidden bg-gray-200">
                                            {batch.coverImage ? (
                                                <Image
                                                    src={batch.coverImage}
                                                    alt={batch.title}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 font-bold uppercase">
                                                    No Image
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                                        </div>

                                        <div className="p-8 flex flex-col grow">
                                            <span className="text-xs font-mono text-gray-400 mb-2 block font-bold">0{i + 1}</span>
                                            <h3 className="text-3xl font-black uppercase mb-4 group-hover:text-blue-600 transition-colors">{batch.title}</h3>
                                            <p className="text-gray-600 text-sm mb-8 leading-relaxed font-medium grow line-clamp-3">
                                                {batch.description}
                                            </p>

                                            <div className="border-t border-gray-200 pt-6 mt-auto">
                                                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-black mb-4">
                                                    <span>{batch.level}</span>
                                                </div>
                                                <button className="w-full bg-transparent border-2 border-black text-black py-3 text-xs font-bold uppercase hover:bg-black hover:text-white transition-colors">
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center text-gray-400 font-mono">
                                <p className="text-xl">No active batches available at the moment.</p>
                                <p className="text-sm mt-2">Please check back soon.</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
