import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { app } from './app';
import { error } from 'console';

dotenv.config();

const port = process.env.PORT || 3000;
const mongo_uri = process.env.DB || '';

mongoose
  .connect(mongo_uri)
  .then(() => {
    console.log('DB Connection successful');
  })
  .catch((error) => console.log(error));

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
