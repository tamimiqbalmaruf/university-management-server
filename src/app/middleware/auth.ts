import { NextFunction, Request, Response } from "express"
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/AppError";
import { StatusCodes } from "http-status-codes";

const auth = () => {

    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const token = req.headers.authorization;

    if(!token){
        throw new AppError(StatusCodes.UNAUTHORIZED, "You're not authorized!")
    }
        
        next()
    })
};

export default auth;