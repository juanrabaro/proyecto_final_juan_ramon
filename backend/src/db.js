import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    // await mongoose.connect('mongodb://localhost:27018/proyectoFinal');
    await mongoose.connect('mongodb+srv://jr:pestillomongodb@cluster0.gjpvkwb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB: ', error);
  }
}