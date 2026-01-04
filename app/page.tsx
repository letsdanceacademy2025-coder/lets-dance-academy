
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Achievements from '@/components/Achievements';
import PromoBanner from '@/components/PromoBanner';
import Link from 'next/link';
import Image from 'next/image';
import connectDB from '@/lib/db';
import GalleryFolder from '@/models/Gallery';
import { FaMusic, FaVideo, FaHeart, FaBriefcase, FaTrophy } from 'react-icons/fa6';
import InfiniteMarquee from '@/components/InfiniteMarquee';

export default async function Home() {
  await connectDB();
  // Fetch 3 most recent published gallery folders
  const recentAlbums = await GalleryFolder.find({ isPublished: true })
    .sort({ createdAt: -1 })
    .limit(3)
    .lean();

  const getCoverImage = (folder: any) => {
    if (folder.coverImage?.imageUrl) {
      return folder.coverImage.imageUrl;
    }
    return folder.images[0]?.imageUrl || '/placeholder.jpg';
  };

  return (
    <div className="bg-white text-black min-h-screen font-sans selection:bg-blue-600 selection:text-white">
      <Header />

      <main>
        {/* HERO SECTION - Imporved with Split Layout */}
        <section className="relative min-h-screen pt-20 grid grid-cols-1 md:grid-cols-2">
          {/* Text Content */}
          <div className="flex flex-col justify-center px-6 md:pl-20 py-20 bg-white z-10">
            <span className="inline-block text-blue-600 font-bold tracking-widest uppercase mb-4 text-sm">Welcome to the movement</span>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-8 leading-[0.9] text-black">
              Let's <br />
              Dance <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">Academy</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-md mb-12 font-medium leading-relaxed">
              Join the premier dance academy where passion meets precision. Regular batches and exclusive workshops for every mover.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/batches" className="bg-black text-white px-10 py-4 text-sm font-bold uppercase tracking-widest hover:bg-blue-600 transition-colors border-2 border-transparent text-center">
                Explore Batches
              </Link>
              <Link href="/workshops" className="bg-transparent text-black border-2 border-black px-10 py-4 text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors text-center">
                View Workshops
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative h-[50vh] md:h-auto bg-gray-100 overflow-hidden">
            <Image
              src="/hero.JPG"
              alt="Dance Class"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-r from-white via-transparent to-transparent md:hidden"></div>
            <div className="absolute inset-0 bg-linear-to-t from-white via-transparent to-transparent md:hidden"></div>
          </div>
        </section>

        <PromoBanner />

        <InfiniteMarquee />

        {/* BENTO GRID SECTION - Short preview still good on home */}
        <section className="py-24 bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16">
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-black">Why Choose Us</h2>
              <div className="h-1 w-20 bg-blue-600"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-[1200px] md:h-[600px]">
              {/* Feature 1 - Regular Batches */}
              <div className="col-span-1 md:col-span-2 md:row-span-2 group relative border border-gray-200 bg-white overflow-hidden">
                <Link href="/batches" className="block w-full h-full relative">
                  <Image src="/batches.png" alt="Regular Batches" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
                  <div className="absolute bottom-0 left-0 p-8 w-full z-10 text-white">
                    <h3 className="text-3xl font-black uppercase mb-2">Regular Batches</h3>
                    <p className="text-gray-200 text-sm mb-6 font-medium">Consistent weekly classes designed to build your foundation.</p>
                    <span className="inline-block border-b-2 border-white pb-1 text-xs font-bold uppercase tracking-widest group-hover:border-blue-400 group-hover:text-blue-400 transition-colors">Explore All Batches</span>
                  </div>
                </Link>
              </div>

              {/* Feature 2 - Workshops */}
              <div className="col-span-1 md:col-span-2 md:row-span-1 group relative border border-gray-200 bg-white overflow-hidden">
                <Link href="/workshops" className="block w-full h-full relative">
                  <Image src="/workshop.png" alt="Workshops" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
                  <div className="absolute bottom-0 left-0 p-8 z-10 text-white">
                    <h3 className="text-2xl font-black uppercase mb-2">Exclusive Workshops</h3>
                    <p className="text-gray-200 text-sm font-medium">Intensive weekend sessions.</p>
                  </div>
                </Link>
              </div>

              {/* Feature 3 - Private */}
              <div className="col-span-1 md:col-span-1 md:row-span-1 group relative border border-gray-200 bg-white overflow-hidden">
                <Image src="/private.png" alt="Private Classes" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
                <div className="absolute bottom-0 left-0 p-6 z-10 text-white">
                  <h3 className="text-xl font-black uppercase mb-1">Private Classes</h3>
                  <p className="text-gray-300 text-xs font-bold">1-on-1 Attention</p>
                </div>
              </div>

              {/* Feature 4 - Showcase */}
              <div className="col-span-1 md:col-span-1 md:row-span-1 group relative border border-gray-200 bg-white overflow-hidden">
                <Image src="/showcase.png" alt="Showcase" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
                <div className="absolute bottom-0 left-0 p-6 z-10 text-white">
                  <h3 className="text-xl font-black uppercase mb-1">Showcase</h3>
                  <p className="text-gray-300 text-xs font-bold">Stage Performance</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Removed Detailed Batches and Workshops sections from Home as they now have their own pages. 
            Kept Bento grid as a navigation/preview element. */}

        <Achievements />

        {/* SERVICES SECTION - BRIEF OVERVIEW */}
        <section className="py-24 bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16 flex justify-between items-end">
              <div>
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-black">Our Services</h2>
                <div className="h-1 w-20 bg-blue-600"></div>
              </div>
              <Link href="/studio" className="text-sm font-bold uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors">
                View All Details →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {[
                { title: "Choreography", desc: "Concerts & Theatrical Acts", Icon: FaMusic },
                { title: "Music Videos", desc: "Celebrity Collaborations", Icon: FaVideo },
                { title: "Weddings", desc: "Sangeet Training", Icon: FaHeart },
                { title: "Corporate Events", desc: "Professional Shows", Icon: FaBriefcase },
                { title: "Award Functions", desc: "Renowned Ceremonies", Icon: FaTrophy }
              ].map((service, i) => (
                <div key={i} className="bg-gray-50 border border-gray-200 hover:border-blue-600 p-6 transition-colors group">
                  <div className="text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                    <service.Icon size={40} />
                  </div>
                  <h3 className="text-lg font-black uppercase mb-2 group-hover:text-blue-600 transition-colors">{service.title}</h3>
                  <p className="text-xs text-gray-600 font-medium leading-relaxed">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GALLERY ALBUMS SECTION */}
        {recentAlbums.length > 0 && (
          <section className="py-24 bg-white border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-6">
              <div className="mb-16 flex justify-between items-end">
                <div>
                  <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-black">Recent Moments</h2>
                  <div className="h-1 w-20 bg-blue-600"></div>
                </div>
                <Link href="/gallery" className="text-sm font-bold uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors">
                  View All Albums →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {recentAlbums.map((folder: any, i: number) => (
                  <Link
                    href={`/gallery/${folder._id.toString()}`}
                    key={folder._id.toString()}
                    className="group border border-gray-200 hover:border-blue-600 transition-colors bg-gray-50 flex flex-col h-full cursor-pointer"
                  >
                    <div className="relative h-64 overflow-hidden bg-gray-200">
                      {folder.images.length > 0 && (
                        <Image
                          src={getCoverImage(folder)}
                          alt={folder.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                    </div>

                    <div className="p-8 flex flex-col grow">
                      <span className="text-xs font-mono text-gray-400 mb-2 block font-bold">0{i + 1}</span>
                      <h3 className="text-2xl font-black uppercase mb-4 group-hover:text-blue-600 transition-colors">{folder.title}</h3>

                      {folder.description && (
                        <p className="text-gray-600 text-sm leading-relaxed font-medium line-clamp-2">
                          {folder.description}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CLIENT REVIEWS SECTION */}
        <section className="py-24 bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16 text-center">
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-black">What Our Students Say</h2>
              <div className="h-1 w-20 bg-blue-600 mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Review 1 */}
              <div className="bg-white p-8 border border-gray-200 hover:border-blue-600 transition-colors">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "Let's Dance Academy transformed my dancing skills! The instructors are incredibly talented and patient. I joined as a complete beginner and now I'm performing on stage with confidence."
                </p>
                <div className="border-t border-gray-200 pt-4">
                  <p className="font-black uppercase text-sm">Priya Sharma</p>
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mt-1">Contemporary Batch</p>
                </div>
              </div>

              {/* Review 2 */}
              <div className="bg-white p-8 border border-gray-200 hover:border-blue-600 transition-colors">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "The energy at Let's Dance Academy is unmatched! Every class feels like a celebration. The workshops are especially amazing – I've learned so many new styles and techniques."
                </p>
                <div className="border-t border-gray-200 pt-4">
                  <p className="font-black uppercase text-sm">Rahul Mehta</p>
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mt-1">Hip-Hop Batch</p>
                </div>
              </div>

              {/* Review 3 */}
              <div className="bg-white p-8 border border-gray-200 hover:border-blue-600 transition-colors">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "Best decision I made this year! The instructors really care about your progress and the community here is so supportive. It's not just about learning dance, it's about building confidence."
                </p>
                <div className="border-t border-gray-200 pt-4">
                  <p className="font-black uppercase text-sm">Ananya Desai</p>
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mt-1">Bollywood Batch</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-black text-white text-center">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8">Ready to Start?</h2>
            <p className="text-xl text-gray-400 mb-12">Don't wait for the perfect moment. Take the moment and make it perfect.</p>
            <div className="flex justify-center gap-4">
              <a
                href="https://wa.me/917448043738?text=Hi!%20I'm%20interested%20in%20booking%20a%20free%20trial%20class."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-black px-10 py-5 text-sm font-bold uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-colors rounded-none inline-block"
              >
                Book a Free Trial
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
