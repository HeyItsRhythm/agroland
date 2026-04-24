const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars from root .env
dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('./models/User');

const checkUser = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');

        const email = 'president202212102392@gmail.com';
        const user = await User.findOne({ email });

        if (user) {
            console.log('User found:', user.email);
            console.log('Role:', user.role);
        } else {
            console.log('User NOT found. Creating user...');
            // We can't easily set the password here without knowing the hashing logic used in routes
            // but we can see the logic in authRoutes.js: bcrypt.hash(password, 10)
            const bcrypt = require('bcryptjs');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('Patel@7777', salt);

            await User.create({
                email,
                password: hashedPassword,
                full_name: 'President User',
                role: 'seller'
            });
            console.log('User created successfully with password Patel@7777');
        }
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.connection.close();
    }
};

checkUser();
