require('dotenv').config(); // Load environment variables from .env file

const mongoose = require('mongoose');
const { Sequelize } = require('sequelize');

const DB_TYPE = process.env.DB_TYPE || 'mongodb'; // Default to MongoDB if not specified

/**
 * Connects to MongoDB using Mongoose.
 */
const connectMongoDB = async () => {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
        console.error('Error: MONGODB_URI environment variable is not set.');
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true, // Deprecated in Mongoose 6+
            // useFindAndModify: false, // Deprecated in Mongoose 6+
        });
        console.log('MongoDB connected successfully!');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1); // Exit process with failure
    }
};

/**
 * Connects to PostgreSQL using Sequelize.
 */
const connectPostgreSQL = async () => {
    const PG_DATABASE = process.env.PG_DATABASE;
    const PG_USER = process.env.PG_USER;
    const PG_PASSWORD = process.env.PG_PASSWORD;
    const PG_HOST = process.env.PG_HOST || 'localhost';
    const PG_PORT = process.env.PG_PORT || 5432;

    if (!PG_DATABASE || !PG_USER || !PG_PASSWORD) {
        console.error('Error: PostgreSQL environment variables (PG_DATABASE, PG_USER, PG_PASSWORD) are not fully set.');
        process.exit(1);
    }

    const sequelize = new Sequelize(PG_DATABASE, PG_USER, PG_PASSWORD, {
        host: PG_HOST,
        port: PG_PORT,
        dialect: 'postgres',
        logging: false, // Set to true to see SQL queries in console
        dialectOptions: {
            // ssl: {
            //     require: true,
            //     rejectUnauthorized: false // For self-signed certificates or development
            // }
        }
    });

    try {
        await sequelize.authenticate();
        console.log('PostgreSQL connected successfully!');
        // You might want to export or return the sequelize instance if models need it
        return sequelize;
    } catch (error) {
        console.error('PostgreSQL connection error:', error.message);
        process.exit(1); // Exit process with failure
    }
};

/**
 * Main function to connect to the database based on DB_TYPE environment variable.
 */
const connectDB = async () => {
    console.log(`Attempting to connect to database type: ${DB_TYPE}`);
    switch (DB_TYPE.toLowerCase()) {
        case 'mongodb':
            await connectMongoDB();
            break;
        case 'postgresql':
            // For PostgreSQL, we might want to return the sequelize instance
            // if it's needed elsewhere for model definitions.
            // For now, just connect.
            await connectPostgreSQL();
            break;
        default:
            console.error(`Error: Unsupported DB_TYPE "${DB_TYPE}". Please set DB_TYPE to 'mongodb' or 'postgresql'.`);
            process.exit(1);
    }
};

module.exports = connectDB;