import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/auth';
import problemRoutes from './routes/problems';
import submissionRoutes from './routes/submissions';


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/submissions', submissionRoutes);

app.get('/', (_req, res) => {
    res.send('AlgoForge API is running');
});

const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
    });
});
