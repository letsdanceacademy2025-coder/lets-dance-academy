/**
 * Quick script to inject the first admin into the database
 * Run this script using: npx tsx scripts/inject-first-admin-quick.ts
 * 
 * Edit the ADMIN_DATA object below with your desired admin credentials
 */

import { loadEnvConfig } from '@next/env';

loadEnvConfig(process.cwd());

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// ============================================
// EDIT THESE VALUES BEFORE RUNNING THE SCRIPT
// ============================================
const ADMIN_DATA = {
    name: 'Super Admin',
    email: 'admin@letsdanceacademy.com',
    password: 'admin123456',  // Change this to a secure password
    phone: '+91 1234567890',  // Optional
};
// ============================================

const MONGODB_URI = process.env.MONGODB_URI;

// Admin Schema
const AdminSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true },
        name: { type: String, required: true, trim: true },
        phone: { type: String, trim: true },
        role: { type: String, default: 'admin' },
        isActive: { type: Boolean, default: true },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    },
    { timestamps: true }
);

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

async function injectFirstAdmin() {
    try {
        console.log('🚀 Starting First Admin Injection Script...\n');

        // Validate input
        if (!ADMIN_DATA.name || !ADMIN_DATA.email || !ADMIN_DATA.password) {
            throw new Error('Please fill in all required fields (name, email, password) in the ADMIN_DATA object');
        }

        if (ADMIN_DATA.password.length < 6) {
            throw new Error('Password must be at least 6 characters');
        }

        if (!ADMIN_DATA.email.includes('@')) {
            throw new Error('Please provide a valid email');
        }

        // Connect to MongoDB
        console.log('📡 Connecting to MongoDB...');
        if (!MONGODB_URI) {
            throw new Error('MONGODB_URI is missing in environment variables');
        }
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB successfully!\n');

        // Check if admin with this email already exists
        const existingAdmin = await Admin.findOne({ email: ADMIN_DATA.email.toLowerCase() });
        if (existingAdmin) {
            console.log(`⚠️  Admin with email ${ADMIN_DATA.email} already exists!`);
            console.log('\n📋 Existing Admin Details:');
            console.log(`   ID: ${existingAdmin._id}`);
            console.log(`   Name: ${existingAdmin.name}`);
            console.log(`   Email: ${existingAdmin.email}`);
            console.log(`   Phone: ${existingAdmin.phone || 'N/A'}`);
            console.log(`   Created At: ${existingAdmin.createdAt}`);
            await mongoose.connection.close();
            process.exit(0);
        }

        // Hash password
        console.log('🔐 Hashing password...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(ADMIN_DATA.password, salt);

        // Create admin
        console.log('👤 Creating admin...');
        const admin = await Admin.create({
            name: ADMIN_DATA.name.trim(),
            email: ADMIN_DATA.email.toLowerCase().trim(),
            phone: ADMIN_DATA.phone?.trim(),
            password: hashedPassword,
            role: 'admin',
            isActive: true,
        });

        console.log('\n✅ First Admin created successfully!');
        console.log('\n📋 Admin Details:');
        console.log(`   ID: ${admin._id}`);
        console.log(`   Name: ${admin.name}`);
        console.log(`   Email: ${admin.email}`);
        console.log(`   Phone: ${admin.phone || 'N/A'}`);
        console.log(`   Role: ${admin.role}`);
        console.log(`   Created At: ${admin.createdAt}`);
        console.log('\n🎉 You can now login with these credentials!\n');

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error:', error instanceof Error ? error.message : error);
        await mongoose.connection.close();
        process.exit(1);
    }
}

// Run the script
injectFirstAdmin();
