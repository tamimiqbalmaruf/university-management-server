import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import { dbConnect } from './utils/dbConnect';


const app: Application = express();


// parsers
app.use(express.json());
app.use(cors());

// connections
dbConnect();

// application route


const getController = (req: Request, res: Response) => {
    
    res.status(200).json({
        success: true,
        message: 'Welcome to the API of first project',
    })
}

app.get('/', getController);

export default app;