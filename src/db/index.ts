import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is required');
}

const globalForDb = globalThis as typeof globalThis & {
  __mongooseConnection?: mongoose.Connection;
};

export const db =
  globalForDb.__mongooseConnection ??
  mongoose.createConnection(MONGODB_URI);

if (process.env.NODE_ENV !== 'production') {
  globalForDb.__mongooseConnection = db;
}

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

db.once('open', () => {
  console.log('MongoDB connected successfully');
});
