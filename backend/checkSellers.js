const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Property = require('./models/Property');
const User = require('./models/User');

const check = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    const properties = await Property.find().lean();
    console.log(`Checking ${properties.length} properties.`);

    for (let p of properties) {
        const user = await User.findById(p.seller_id);
        if (user) {
            console.log(`Property ${p.title} has valid seller: ${user.full_name}`);
        } else {
            console.log(`Property ${p.title} has ORPHANED seller_id: ${p.seller_id}`);
        }
    }

    mongoose.connection.close();
};

check();
