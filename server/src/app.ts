import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import path from 'path';
import dotenv from 'dotenv';
import AppError from './utils/appError';
import globalErrorHandler from './controllers/errorController';

dotenv.config();

export const app = express();

app.use('/', express.static('uploads'));

app.use(cookieParser());
app.use(helmet());
app.use(
  cors({
    origin: ['https://localhost:3000'],
    credentials: true,
  }),
);

app.use(express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '10kb' }));

app.use(mongoSanitize());

// Routes for users

// Routes for posts

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler)
