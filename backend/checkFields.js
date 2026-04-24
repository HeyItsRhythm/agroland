const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Property = require('./models/Property');

const checkFields = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    const properties = await Property.find().lean();
    if (properties.length > 0) {
        console.log('--- ALL KEYS IN FIRST PROPERTY ---');
        console.log(Object.keys(properties[0]));
        console.log('--- VALUES ---');
        console.log(properties[0]);
    } else {
        console.log('No properties found.');
    }
    mongoose.connection.close();
};

checkFields();
