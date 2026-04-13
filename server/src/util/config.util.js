import mongoose from 'mongoose'; 
// mongoose.set('debug', true);
export const connectToMongo = async (dbName) => await mongoose.connect(process.env.DARIA_DB_USER, { dbName });