'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FaPhone, FaEnvelope, FaLocationDot, FaInstagram, FaWhatsapp } from 'react-icons/fa6';

export default function ContactPage() {
    const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus('submitting');
        // Simulate API call
        setTimeout(() => {
            setFormStatus('success');
        }, 1500);
    };

    return (
        <div className="bg-white text-black min-h-screen font-sans selection:bg-blue-600 selection:text-white">
            <Header />

            <main className="pt-20">
                {/* Hero */}
                <section className="bg-black text-white py-24 relative overflow-hidden">
                    <div className="absolute inset-0 z-0 opacity-20">
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                        <span className="text-blue-500 font-bold uppercase tracking-widest text-sm mb-4 block">Get in Touch</span>
                        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 max-w-3xl mx-auto">
                            Let's Start <br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500">Something New</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            Have questions about batches, workshops, or private lessons? We are here to help you find your rhythm.
                        </p>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-6 py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                        {/* Contact Info & Branches */}
                        <div className="space-y-12">
                            <div>
                                <h3 className="text-2xl font-black uppercase mb-8 flex items-center gap-3">
                                    <span className="w-8 h-1 bg-black"></span>
                                    Connect With Us
                                </h3>
                                <div className="space-y-6">
                                    <a href="tel:+917448043738" className="flex items-center gap-6 p-6 border border-gray-100 hover:border-black transition-colors group">
                                        <div className="w-12 h-12 bg-gray-50 flex items-center justify-center rounded-full group-hover:bg-blue-600 transition-colors">
                                            <FaPhone className="text-gray-400 group-hover:text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold uppercase text-gray-400 mb-1">Call Us</p>
                                            <p className="text-xl font-bold">+91 7448043738</p>
                                        </div>
                                    </a>

                                    <a href="mailto:letsdanceacademy5678@gmail.com" className="flex items-center gap-6 p-6 border border-gray-100 hover:border-black transition-colors group">
                                        <div className="w-12 h-12 bg-gray-50 flex items-center justify-center rounded-full group-hover:bg-blue-600 transition-colors">
                                            <FaEnvelope className="text-gray-400 group-hover:text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold uppercase text-gray-400 mb-1">Email Us</p>
                                            <p className="text-xl font-bold break-all">letsdanceacademy5678@gmail.com</p>
                                        </div>
                                    </a>

                                    <a href="https://wa.me/917448043738" target="_blank" rel="noopener noreferrer" className="flex items-center gap-6 p-6 border border-gray-100 hover:border-black transition-colors group">
                                        <div className="w-12 h-12 bg-gray-50 flex items-center justify-center rounded-full group-hover:bg-green-500 transition-colors">
                                            <FaWhatsapp className="text-gray-400 group-hover:text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold uppercase text-gray-400 mb-1">WhatsApp</p>
                                            <p className="text-xl font-bold">Chat with us</p>
                                        </div>
                                    </a>
                                </div>
                            </div>

                            {/* Branches */}
                            <div>
                                <h3 className="text-2xl font-black uppercase mb-8 flex items-center gap-3">
                                    <span className="w-8 h-1 bg-black"></span>
                                    Visit Our Studios
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-gray-50 p-6 border border-gray-100">
                                        <h4 className="font-black uppercase text-blue-600 mb-3">Sambhaji Nagar Branch</h4>
                                        <p className="text-sm font-medium text-gray-600 leading-relaxed mb-4">
                                            Sambhaji Nagar Road, Dhankwadi,<br />
                                            Near Suyog Hospital,<br />
                                            Pune 411043
                                        </p>
                                        <button className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-blue-600 hover:border-blue-600 transition-colors">
                                            View on Map
                                        </button>
                                    </div>
                                    <div className="bg-gray-50 p-6 border border-gray-100">
                                        <h4 className="font-black uppercase text-blue-600 mb-3">Balaji Nagar Branch</h4>
                                        <p className="text-sm font-medium text-gray-600 leading-relaxed mb-4">
                                            Balaji Nagar, Dhankawade Patil Township,<br />
                                            Near Siddhi Hospital,<br />
                                            Pune 411043
                                        </p>
                                        <button className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-blue-600 hover:border-blue-600 transition-colors">
                                            View on Map
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-white p-8 md:p-12 border border-gray-200 shadow-2xl relative">
                            {formStatus === 'success' ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10 p-12 text-center animate-in fade-in">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                        <div className="w-10 h-10 border-r-4 border-b-4 border-green-600 rotate-45 mt-[-8px]"></div>
                                    </div>
                                    <h3 className="text-2xl font-black uppercase mb-2">Message Sent!</h3>
                                    <p className="text-gray-500">We will get back to you shortly.</p>
                                    <button
                                        onClick={() => setFormStatus('idle')}
                                        className="mt-8 text-xs font-bold uppercase tracking-widest text-blue-600 hover:text-black"
                                    >
                                        Send another message
                                    </button>
                                </div>
                            ) : null}

                            <h3 className="text-2xl font-black uppercase mb-2">Send a Message</h3>
                            <p className="text-gray-500 mb-8 text-sm">Fill out the form below and we'll get back to you.</p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">First Name</label>
                                        <input type="text" required className="w-full bg-gray-50 border border-gray-200 p-4 font-bold focus:outline-none focus:border-blue-600 transition-colors" placeholder="Jane" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Last Name</label>
                                        <input type="text" required className="w-full bg-gray-50 border border-gray-200 p-4 font-bold focus:outline-none focus:border-blue-600 transition-colors" placeholder="Doe" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Email Address</label>
                                    <input type="email" required className="w-full bg-gray-50 border border-gray-200 p-4 font-bold focus:outline-none focus:border-blue-600 transition-colors" placeholder="jane@example.com" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Phone Number</label>
                                    <input type="tel" required className="w-full bg-gray-50 border border-gray-200 p-4 font-bold focus:outline-none focus:border-blue-600 transition-colors" placeholder="+91 99999 99999" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Message</label>
                                    <textarea required rows={4} className="w-full bg-gray-50 border border-gray-200 p-4 font-bold focus:outline-none focus:border-blue-600 transition-colors resize-none" placeholder="Tell us what you're looking for..."></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={formStatus === 'submitting'}
                                    className="w-full bg-black text-white p-5 font-bold uppercase tracking-widest hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {formStatus === 'submitting' ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
