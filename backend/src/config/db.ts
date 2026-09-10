import mongoose from 'mongoose';

// Disable query buffering so calls fail-fast with friendly messages instead of 10s hang
mongoose.set('bufferCommands', false);

export function isDbConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

export async function connectDB(): Promise<void> {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri || mongoUri.trim() === '') {
    console.warn('⚠️ [MongoDB] Warning: MONGO_URI is not set in backend/.env.');
    console.warn('⚠️ [MongoDB] Please add your MongoDB Atlas connection string in backend/.env');
    return;
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 20000,
    });
    console.log(`✅ [MongoDB] Connected successfully to host: ${conn.connection.host}`);
  } catch (error: any) {
    console.error('❌ [MongoDB] Connection error:', error.message);
    console.warn('⚠️ [MongoDB] Verify that your IP address is whitelisted in MongoDB Atlas Network Access (0.0.0.0/0 allowed).');
  }
}

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ [MongoDB] Connection disconnected.');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ [MongoDB] Runtime error:', err.message);
});
