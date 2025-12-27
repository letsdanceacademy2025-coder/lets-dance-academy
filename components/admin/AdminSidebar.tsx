'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
    FaChartPie,
    FaUserGroup,
    FaCalendarCheck,
    FaMoneyBillWave,
    FaLayerGroup,
    FaImages,
    FaBullhorn,
    FaUserShield,
    FaGear,
    FaArrowRightFromBracket,
    FaBars,
    FaXmark
} from 'react-icons/fa6';

const menuItems = [
    { icon: FaChartPie, label: 'Dashboard', href: '/admin' },
    { icon: FaUserGroup, label: 'Students', href: '/admin/students' },
    { icon: FaCalendarCheck, label: 'Attendance', href: '/admin/attendance' },
    { icon: FaMoneyBillWave, label: 'Payments & Dues', href: '/admin/payments' },
    { icon: FaLayerGroup, label: 'Courses & Batches', href: '/admin/batches' },
    { icon: FaBullhorn, label: 'Promo Banners', href: '/admin/banners' },
    // { icon: FaImages, label: 'Content', href: '/admin/content' },
    { icon: FaUserShield, label: 'Manage Admins', href: '/admin/admins' },
    { icon: FaGear, label: 'Settings', href: '/admin/settings' },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const { logout } = useAuth();

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    return (
        <>
            {/* Mobile Header / Toggle */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-neutral-950 text-white z-50 flex items-center px-4 border-b border-neutral-800">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 -ml-2 hover:bg-neutral-800 rounded-lg transition-colors"
                >
                    {isOpen ? <FaXmark className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
                </button>
                <span className="ml-4 font-bold uppercase tracking-tight">Admin Panel</span>
            </div>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`w-64 bg-neutral-950 text-white flex-shrink-0 flex flex-col fixed inset-y-0 left-0 z-50 border-r border-neutral-800 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                }`}>
                {/* Logo Area */}
                <div className="p-6 border-b border-neutral-800 hidden md:block">
                    <Link href="/" className="text-xl font-bold tracking-tighter uppercase block">
                        Let's Dance <span className="text-blue-600">Admin</span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2 mt-16 md:mt-0">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                    : 'text-gray-400 hover:text-white hover:bg-neutral-900'
                                    }`}
                            >
                                <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-white'}`} />
                                <span className="text-sm font-bold tracking-wide">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-neutral-800">
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:text-white hover:bg-red-500/10 transition-colors"
                    >
                        <FaArrowRightFromBracket className="w-4 h-4" />
                        <span className="text-sm font-bold tracking-wide">Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
