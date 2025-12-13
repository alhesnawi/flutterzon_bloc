const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./model/user');
require('dotenv').config({ path: '/root/flutterzon/config.env' });

const userName = process.env.DB_USERNAME || process.env.MONGO_USER;
const password = encodeURIComponent(process.env.DB_PASSWORD || process.env.MONGO_PASS);
const mongoDb = process.env.MONGO_DB || 'e-store.yuyhuo4.mongodb.net';

const DB = `mongodb+srv://${userName}:${password}@${mongoDb}/?retryWrites=true&w=majority`;

mongoose.connect(DB).then(() => {
    console.log('Connected to MongoDB');
    createAdmin();
}).catch((err) => {
    console.log('Error connecting to MongoDB:', err);
});

async function createAdmin() {
    try {
        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@flutterzon.com' });
        
        // Hash the password
        const hashedPassword = await bcrypt.hash('admin123', 8);
        
        if (existingAdmin) {
            console.log('Admin already exists:', existingAdmin.email);
            // Update password and ensure admin type
            existingAdmin.type = 'admin';
            existingAdmin.password = hashedPassword;
            await existingAdmin.save();
            console.log('✅ Updated user to admin with new password');
        } else {
            // Create new admin user
            const admin = new User({
                name: 'Admin',
                email: 'admin@flutterzon.com',
                password: hashedPassword,
                type: 'admin',
                address: '',
                cart: []
            });
            
            await admin.save();
            console.log('✅ Admin created successfully!');
        }
        
        console.log('Email: admin@flutterzon.com');
        console.log('Password: admin123');
        
        process.exit(0);
    } catch (err) {
        console.error('Error creating admin:', err);
        process.exit(1);
    }
}
