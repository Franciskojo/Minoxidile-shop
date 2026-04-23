import mongoose from 'mongoose';
import colors from 'colors';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    console.log('--- Database Connection Debug ---'.bgYellow.black);
    console.log(`Loading URI: ${mongoURI ? 'FOUND (starts with ' + mongoURI.substring(0, 15) + '...)' : 'MISSING'}`.yellow);

    if (!mongoURI) {
      throw new Error('MONGO_URI is not defined in environment variables. Check your .env file.');
    }

    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

export default connectDB;
