import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong!";

    type TErrorSources = {
        path: string | number;
        message: string;
    } []

const errorSources: TErrorSources = [{
    path: "",
    message: "Something went wrong!"
}]


if(err instanceof ZodError){
    
}




    return res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        // error: err
    })

};

export default globalErrorHandler;