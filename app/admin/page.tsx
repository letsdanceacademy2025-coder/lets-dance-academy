'use client';

import { useState, useEffect } from 'react';
import { FaUserGroup, FaIndianRupeeSign, FaCircleExclamation, FaUpRightFromSquare, FaSpinner, FaUsers, FaGraduationCap } from 'react-icons/fa6';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardStats {
    totalStudents: number;
    currentMonthRevenue: number;
    revenueGrowth: number;
    pendingEnrollments: number;
    activeBatches: number;
    activeWorkshops: number;
}

interface ActivityItem {
    _id: string;
    userName: string;
    type: string;
    batchTitle?: string;
    workshopTitle?: string;
    price: number;
    status: string;
    createdAt: string;
}

export default function AdminDashboard() {
    const { token } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<DashboardStats>({
        totalStudents: 0,
        currentMonthRevenue: 0,
        revenueGrowth: 0,
        pendingEnrollments: 0,
        activeBatches: 0,
        activeWorkshops: 0
    });
    const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/admin/stats', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await res.json();
                if (data.success) {
                    setStats(data.data.stats);
                    setRecentActivity(data.data.recentActivity);
                }
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchStats();
        }
    }, [token]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const timeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) return 'just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <FaSpinner className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    const statCards = [
        {
            title: 'Total Active Students',
            value: stats.totalStudents.toString(),
            change: 'Active Accounts',
            icon: FaUserGroup,
            color: 'blue'
        },
        {
            title: 'Monthly Revenue',
            value: formatCurrency(stats.currentMonthRevenue),
            change: `${stats.revenueGrowth > 0 ? '+' : ''}${stats.revenueGrowth}% vs last month`,
            icon: FaIndianRupeeSign,
            color: 'green'
        },
        {
            title: 'Pending Verifications',
            value: stats.pendingEnrollments.toString(),
            change: 'Needs Attention',
            icon: FaCircleExclamation,
            color: stats.pendingEnrollments > 0 ? 'orange' : 'gray'
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight text-black">Dashboard</h1>
                    <p className="text-gray-500 font-medium mt-1">Welcome back, Admin. Here's what's happening today.</p>
                </div>
                <div className="flex gap-3">
                    <a href="/admin/students" className="bg-black text-white px-4 py-2 text-xs font-bold uppercase tracking-wide hover:bg-blue-600 transition-colors flex items-center gap-2">
                        + New Student
                    </a>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCards.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-${stat.color}-50 text-${stat.color}-600`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                        </div>
                        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{stat.title}</h3>
                        <div className="flex items-end gap-3">
                            <span className="text-3xl font-black text-black tracking-tight">{stat.value}</span>
                            <span className={`text-xs font-bold mb-1.5 px-2 py-0.5 rounded-full ${stat.color === 'green' ? 'bg-green-50 text-green-600' :
                                    stat.color === 'orange' ? 'bg-orange-50 text-orange-600' : 'bg-gray-100 text-gray-500'
                                }`}>
                                {stat.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Active Batches</p>
                        <p className="text-2xl font-black">{stats.activeBatches}</p>
                    </div>
                    <FaUsers className="text-gray-300 w-8 h-8" />
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Active Workshops</p>
                        <p className="text-2xl font-black">{stats.activeWorkshops}</p>
                    </div>
                    <FaGraduationCap className="text-gray-300 w-8 h-8" />
                </div>
            </div>

            {/* Recent Activity & Quick Actions Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-bold uppercase tracking-wide text-sm">Recent Activity</h3>
                        <a href="/admin/payments" className="text-blue-600 text-xs font-bold uppercase hover:text-blue-800">View All</a>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {recentActivity.length > 0 ? recentActivity.map((activity) => (
                            <div key={activity._id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-2 h-2 rounded-full ${activity.status === 'active' ? 'bg-green-500' :
                                            activity.status === 'pending' ? 'bg-orange-500' : 'bg-gray-300'
                                        }`}></div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">
                                            {activity.userName}
                                            <span className="font-medium text-gray-500 mx-1">
                                                {activity.status === 'pending' ? 'submitted payment for' : 'enrolled in'}
                                            </span>
                                            <span className="text-black">{activity.batchTitle || activity.workshopTitle}</span>
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {formatCurrency(activity.price)} • {activity.status.toUpperCase()}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-xs font-medium text-gray-400 whitespace-nowrap ml-4">{timeAgo(activity.createdAt)}</span>
                            </div>
                        )) : (
                            <div className="p-8 text-center text-gray-400 text-sm">No recent activity</div>
                        )}
                    </div>
                </div>

                {/* Studio Status / Quick Actions */}
                <div className="space-y-6">
                    {/* Placeholder for future Live Class feature */}
                    <div className="bg-neutral-900 text-white rounded-2xl p-6 shadow-lg relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="font-bold uppercase tracking-wide text-sm mb-4 opacity-50">Studio Status</h3>
                            <p className="text-xl font-black mb-1">Let's Dance Academy</p>
                            <p className="text-neutral-400 text-sm mb-6">System Operational</p>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-xs font-bold">Online</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h3 className="font-bold uppercase tracking-wide text-sm mb-4">Quick Shortcuts</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <a href="/admin/students" className="p-3 bg-gray-50 hover:bg-black hover:text-white transition-colors rounded-xl flex flex-col items-center justify-center gap-2 text-center group">
                                <FaUserGroup className="text-gray-400 group-hover:text-white" />
                                <span className="text-xs font-bold">Students</span>
                            </a>
                            <a href="/admin/payments" className="p-3 bg-gray-50 hover:bg-black hover:text-white transition-colors rounded-xl flex flex-col items-center justify-center gap-2 text-center group">
                                <FaIndianRupeeSign className="text-gray-400 group-hover:text-white" />
                                <span className="text-xs font-bold">Payments</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
