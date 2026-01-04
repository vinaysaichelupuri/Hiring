import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { featureflags } from "./schema/feature";
import featureRoutes from "./routes/routes";
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

const connection = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/Hiring');
    console.log('Database connection established');
  } catch (error) {
    console.error('Database connection failed:', error); 
  }
};
connection();

app.use('/api', featureRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
