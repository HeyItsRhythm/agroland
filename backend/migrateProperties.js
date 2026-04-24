const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const Property = require('./models/Property');
const User = require('./models/User');

const migrateProperties = async () => {
    await connectDB();

    try {
        const properties = await Property.find();
        console.log(`Found ${properties.length} properties.`);

        for (let prop of properties) {
            console.log(`Checking property: ${prop.title} | seller_id: ${prop.seller_id} | Type: ${typeof prop.seller_id}`);
            if (prop.seller_id) {
                if (typeof prop.seller_id === 'string' || prop.seller_id instanceof String) {
                    if (mongoose.Types.ObjectId.isValid(prop.seller_id)) {
                        console.log(`  -> Converting property ${prop.title} seller_id string to ObjectId`);
                        prop.seller_id = new mongoose.Types.ObjectId(prop.seller_id);
                        await prop.save();
                    } else {
                        console.warn(`  -> Property ${prop.title} has invalid seller_id string: ${prop.seller_id}`);
                    }
                } else {
                    console.log(`  -> Already an ObjectId or other type`);
                }
            } else {
                console.log(`  -> No seller_id found`);
            }
        }

        console.log('Migration completed.');
    } catch (err) {
        console.error(err);
    } finally {
        mongoose.connection.close();
    }
};

migrateProperties();
