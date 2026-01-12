import express from 'express';
import cors from 'cors';
import docsRouter from './routes/docs';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/docs', docsRouter);

export default app;
