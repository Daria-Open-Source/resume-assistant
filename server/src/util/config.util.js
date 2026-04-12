import mongoose from 'mongoose'; 
export const connectToMongo = async (dbName) => await mongoose.connect(process.env.DARIA_DB_USER, { dbName });