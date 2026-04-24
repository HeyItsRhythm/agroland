const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

// Load env vars from root .env
dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');

const seedAdmin = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');

        const adminEmail = 'agrolandadmin7777@gmail.com';
        const adminPass = 'Admin@7777';

        const user = await User.findOne({ email: adminEmail });

        if (user) {
            console.log('Admin user found. Updating password to ensure it is correct...');
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(adminPass, salt);
            user.role = 'admin';
            user.full_name = 'AgroLand Admin';
            await user.save();
            console.log('Admin password updated successfully.');
        } else {
            console.log('Admin user NOT found. Creating admin...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(adminPass, salt);

            await User.create({
                email: adminEmail,
                password: hashedPassword,
                full_name: 'AgroLand Admin',
                role: 'admin'
            });
            console.log('Admin user created successfully.');
        }

        console.log('\n--- ADMIN CREDENTIALS ---');
        console.log('Email:', adminEmail);
        console.log('Password:', adminPass);
        console.log('-------------------------\n');

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.connection.close();
    }
};

seedAdmin();
