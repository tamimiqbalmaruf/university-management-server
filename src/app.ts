import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import notFound from './app/middleware/notFound';
import router from './app/routes';
import { dbConnect } from './utils/dbConnect';

const app: Application = express();

// parsers
app.use(express.json());
app.use(cors());

// connections
dbConnect();

// application routes
app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the API of first project',
  });
});

app.use(globalErrorHandler);

app.use(notFound)

export default app;
