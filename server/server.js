import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import analysisRouter from './routes/analysisRoutes.js';
import vitalsRouter from './routes/vitalsRoutes.js';
import morgan from 'morgan';

const app = express();
const port = process.env.PORT || 4000;

// Trust proxy for Vercel
app.use(morgan('dev'));
app.set('trust proxy', 1);

// Connect to Database
connectDB();

const allowedOrigins = [
    ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim().replace(/\/$/, '')) : []),
    'http://localhost:5173',
    // 'http://localhost:5173/',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    "https://health-mate-ewjo.vercel.app",
].filter(Boolean);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(cors({ origin: true, credentials: true }));

// API Endpoints
app.get('/', (req, res) => res.send("API Working"));
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/analysis', analysisRouter);
app.use('/api/vitals', vitalsRouter);

app.use((err, req, res, next) => {
    console.error("GLOBAL ERROR:", err);
    res.status(500).json({
        success: false,
        message: err.message
    });
});

app.listen(port, () => console.log(`Server started on PORT: ${port}`));


