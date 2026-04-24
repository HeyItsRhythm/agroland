const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Property = require('./models/Property');
const User = require('./models/User');

const dump = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    const properties = await Property.find().limit(3).lean();
    console.log('--- PROPERTIES (JSON) ---');
    console.log(JSON.stringify(properties, null, 2));

    const users = await User.find().limit(3).lean();
    console.log('--- USERS (JSON) ---');
    console.log(JSON.stringify(users, null, 2));

    mongoose.connection.close();
};

dump();
