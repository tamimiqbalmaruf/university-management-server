import { NextFunction, Request, Response } from "express"
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/AppError";
import { StatusCodes } from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { TUserRole } from "../modules/user/user.interface";

const auth = (...requiredRoles: TUserRole[]) => {

    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {

        const token = req.headers.authorization;

        if (!token) {
            throw new AppError(StatusCodes.UNAUTHORIZED, "You're not authorized!")
        };

        jwt.verify(token, config.jwt_access_secret as string, function (err, decoded) {
            if (err) {
                throw new AppError(StatusCodes.UNAUTHORIZED, "You're not authorized!")
            }

            const {role} = decoded as JwtPayload;

            if( requiredRoles && !requiredRoles.includes(role)){
                throw new AppError(StatusCodes.UNAUTHORIZED, "You're not authorized!")
            }

            req.user = decoded as JwtPayload;
            next();
        })


    })
};

export default auth;