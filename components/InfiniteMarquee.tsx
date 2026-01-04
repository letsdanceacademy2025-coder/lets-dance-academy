import Image from 'next/image';

const images = [
    '/images/1.jpg',
    '/images/2.jpg',
    '/images/3.jpg',
    '/images/4.jpg',
    '/images/5.jpg',
    '/images/6.jpg',
    '/images/7.jpg',
    '/images/8.jpg',
    '/images/9.jpg',
    '/images/10.jpg',
];

export default function InfiniteMarquee() {
    return (
        <section className="py-12 overflow-hidden relative z-20">
            {/* Gradient fade edges */}
            {/* <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-black to-transparent z-10 hidden md:block" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-black to-transparent z-10 hidden md:block" /> */}

            <div className="flex w-full">
                <div className="flex items-center gap-8 animate-marquee whitespace-nowrap will-change-transform">
                    {/* First set of images */}
                    {images.map((src, index) => (
                        <div
                            key={`set1-${index}`}
                            className="relative w-[300px] h-[200px] shrink-0 grayscale hover:grayscale-0 transition-all duration-500 hover:scale-105 cursor-pointer rounded-lg overflow-hidden border border-gray-800"
                        >
                            <Image
                                src={src}
                                alt={`Gallery image ${index + 1}`}
                                fill
                                sizes="(max-width: 768px) 300px, 400px"
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/20 hover:bg-transparent transition-colors" />
                        </div>
                    ))}

                    {/* Second set of images (duplicate for seamless loop) */}
                    {images.map((src, index) => (
                        <div
                            key={`set2-${index}`}
                            className="relative w-[300px] h-[200px] shrink-0 grayscale hover:grayscale-0 transition-all duration-500 hover:scale-105 cursor-pointer rounded-lg overflow-hidden border border-gray-800"
                        >
                            <Image
                                src={src}
                                alt={`Gallery image ${index + 1}`}
                                fill
                                sizes="(max-width: 768px) 300px, 400px"
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/20 hover:bg-transparent transition-colors" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
