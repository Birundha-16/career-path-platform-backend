import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const uri = process.env.MONGODB_URI;

console.log('----------------------------------------------------');
console.log('🔍 Testing MongoDB Atlas Connection...');
console.log(`📡 URI: ${uri ? uri.replace(/:([^@]+)@/, ':****@') : 'NOT FOUND'}`);
console.log('----------------------------------------------------');

if (!uri) {
  console.error('❌ MONGODB_URI is empty in backend/.env!');
  process.exit(1);
}

try {
  mongoose.set('strictQuery', false);
  const conn = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 8000,
  });

  console.log('✅ SUCCESS! MongoDB Atlas Connected Successfully!');
  console.log(`   Host: ${conn.connection.host}`);
  console.log(`   Database: ${conn.connection.name}`);
  console.log('----------------------------------------------------');
  await mongoose.disconnect();
  process.exit(0);
} catch (error) {
  console.error('❌ CONNECTION FAILED!');
  console.error(`   Error name: ${error.name}`);
  console.error(`   Error message: ${error.message}`);
  console.log('----------------------------------------------------');

  if (error.message.includes('Authentication failed') || error.message.includes('bad auth')) {
    console.log('🔑 CAUSE: WRONG USERNAME OR PASSWORD');
    console.log('   Check MongoDB Atlas -> Database Access -> ensure user & password match.');
  } else if (error.message.includes('buffering timed out') || error.message.includes('timed out') || error.name === 'MongooseServerSelectionError') {
    console.log('🌐 CAUSE: IP ADDRESS NOT WHITELISTED IN ATLAS (NETWORK ACCESS)');
    console.log('   1. Go to https://cloud.mongodb.com');
    console.log('   2. Click "Network Access" on the left menu');
    console.log('   3. Click "+ Add IP Address"');
    console.log('   4. Click "ALLOW ACCESS FROM ANYWHERE" (0.0.0.0/0)');
    console.log('   5. Click Confirm and wait 1 minute for it to become Active.');
  }
  console.log('----------------------------------------------------');
  process.exit(1);
}
