import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { app } from './app';

process.on('uncaughtException', (err: Error) => {
  console.error('UNCAUGHT EXCEPTION: Shutting down');
  console.log(err.name, err.message);
  process.exit(1);
});

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

process.on('unhandledRejection', (err: Error) => {
  console.log('UNHANDLE REJECTION! Shutting down');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
