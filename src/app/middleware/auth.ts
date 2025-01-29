import { NextFunction, Request, Response } from "express"
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/AppError";
import { StatusCodes } from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { TUserRole } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

const auth = (...requiredRoles: TUserRole[]) => {

    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {

        const token = req.headers.authorization;

        if (!token) {
            throw new AppError(StatusCodes.UNAUTHORIZED, "You're not authorized!")
        };

        let decoded;
        
        try {
             decoded = jwt.verify(token, config.jwt_access_secret as string)
        } catch (error) {
            throw new AppError(StatusCodes.UNAUTHORIZED, "You're not authorized!") 
        }

        const { userId, role, iat } = decoded as JwtPayload;

        const user = await User.isUserExistsByCustomId(userId);

        if (!user) {
            throw new AppError(StatusCodes.NOT_FOUND, "The user is not found!")
        };

        if (user?.isDeleted === true) {
            throw new AppError(StatusCodes.FORBIDDEN, "The user is deleted!")
        };

        if (user?.status === "blocked") {
            throw new AppError(StatusCodes.FORBIDDEN, "The user is blocked!")
        };


        if (user?.passwordChangedAt && User.isJWTIssuedBeforePasswordChanged(user?.passwordChangedAt, iat as number)) {
            throw new AppError(StatusCodes.UNAUTHORIZED, "You're not authorized!")
        }


        if (requiredRoles && !requiredRoles.includes(role)) {
            throw new AppError(StatusCodes.UNAUTHORIZED, "You're not authorized!")
        }

        req.user = decoded as JwtPayload;
        next();

    })
};

export default auth;