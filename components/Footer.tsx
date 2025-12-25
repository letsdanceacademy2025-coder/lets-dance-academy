import Link from 'next/link';

import { FaInstagram, FaYoutube, FaEnvelope, FaPhone } from 'react-icons/fa6';

export default function Footer() {
    return (
        <footer className="bg-gray-100 text-black pt-24 pb-12 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="text-2xl font-bold tracking-tighter uppercase block mb-6">
                            Let's Dance <span className="text-blue-600">.</span>
                        </Link>
                        <p className="text-gray-600 text-sm leading-relaxed mb-6 font-medium">
                            Professional training for everyone. Whether you are a beginner or a pro, we have a space for you to move, create and inspire.
                        </p>
                        <address className="not-italic text-sm font-bold text-gray-500">
                            Let's Dance Academy,<br />
                            Dhankwadi, Pune, 411043
                        </address>
                    </div>

                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest mb-6 text-gray-900">Links</h3>
                        <ul className="space-y-4">
                            <li>
                                <Link href="/batches" className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium">
                                    Regular Batches
                                </Link>
                            </li>
                            <li>
                                <Link href="/workshops" className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium">
                                    Weekend Workshops
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium">
                                    Student Dashboard
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest mb-6 text-gray-900">Academy</h3>
                        <ul className="space-y-4">
                            <li>
                                <Link href="/instructors" className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium">
                                    Instructors
                                </Link>
                            </li>
                            <li>
                                <Link href="/studio" className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium">
                                    Our Studio
                                </Link>
                            </li>
                            <li>
                                <Link href="/register" className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium">
                                    Join Now
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium">
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-black uppercase mb-6">Contact</h3>
                        <p className="text-gray-400 text-sm mb-4 font-medium leading-relaxed">
                            Have questions? Reach out to us directly.
                        </p>
                        <ul className="space-y-3 text-sm text-gray-400 font-bold">
                            <li className="flex items-center gap-3">
                                <FaEnvelope className="w-4 h-4 text-blue-600" />
                                <a href="mailto:letsdanceacademy5678@gmail.com" className="hover:text-black transition-colors">letsdanceacademy5678@gmail.com</a>
                            </li>
                            <li className="flex items-start gap-3">
                                <FaPhone className="w-4 h-4 text-blue-600 mt-0.5" />
                                <div className="flex flex-col">
                                    <a href="tel:+917448043738" className="hover:text-black transition-colors">+91 7448043738</a>
                                    <a href="tel:+917030877138" className="hover:text-black transition-colors">+91 7030877138</a>
                                </div>
                            </li>
                        </ul>

                        <div className="flex flex-col gap-3 mt-6">
                            <a href="https://www.instagram.com/letsdanceacademy_5678?igsh=MTA1dnY3cm9vc2sxNA==" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors text-xs font-bold uppercase tracking-widest">
                                <FaInstagram className="w-4 h-4" /> Instagram (Academy)
                            </a>
                            <a href="https://www.instagram.com/prathameshmane_did?igsh=cG1xczFwamRncXdz" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors text-xs font-bold uppercase tracking-widest">
                                <FaInstagram className="w-4 h-4" /> Instagram (Founder)
                            </a>
                            <a href="https://youtube.com/@prathameshmanedid?si=tTk9enmsRn_ayaAr" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors text-xs font-bold uppercase tracking-widest">
                                <FaYoutube className="w-4 h-4" /> YouTube
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-xs uppercase tracking-wider font-bold">
                        © {new Date().getFullYear()} Let's Dance Academy. All rights reserved. | <span className="text-gray-400">Created and maintained by <a href="https://digicraft.one" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">DigiCraft</a></span>
                    </p>
                    <div className="flex gap-6">
                        <Link href="/privacy-policy" className="text-gray-500 hover:text-black text-xs uppercase tracking-wider transition-colors font-bold">
                            Privacy Policy
                        </Link>
                        <Link href="/terms-of-service" className="text-gray-500 hover:text-black text-xs uppercase tracking-wider transition-colors font-bold">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
