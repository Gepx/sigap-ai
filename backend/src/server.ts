import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/error.middleware.js';
import authRoutes from './modules/auth/auth.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;


app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true 
}));
app.use(express.json());
app.use(cookieParser());


app.use('/api/auth', authRoutes);


app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});


app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[SERVER] Running on http://localhost:${PORT}`);
});
