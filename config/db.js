import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    mongoose.set('bufferCommands', false);
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careerCompassDB';

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Port: ${conn.connection.port || 27017}`);
    console.log(`   Database: ${conn.connection.name || 'careerCompassDB'}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('💡 MongoDB Compass Connection Troubleshooting:');
    console.error('   1. Ensure MongoDB service is running (or MongoDB Compass is open and connected).');
    console.error('   2. Verify local connection at: mongodb://127.0.0.1:27017');
    console.error('   3. Check MONGODB_URI in backend/.env');
  }
};

export default connectDB;
