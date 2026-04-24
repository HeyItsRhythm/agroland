const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Property = require('./models/Property');
const User = require('./models/User');

const dump = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    const properties = await Property.find().lean();
    console.log('--- PROPERTIES ---');
    properties.forEach(p => console.log(`Title: ${p.title} | SellerID: ${p.seller_id} | Type: ${typeof p.seller_id}`));

    const users = await User.find().lean();
    console.log('--- USERS ---');
    users.forEach(u => console.log(`Name: ${u.full_name} | ID: ${u._id} | Type: ${typeof u._id}`));

    mongoose.connection.close();
};

dump();
