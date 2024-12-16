

import { StatusCodes } from "http-status-codes";

import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { TLoginUser } from "./auth.interface";
import jwt from "jsonwebtoken";
import config from "../../config";


const loginUser = async (payload: TLoginUser) => {

    const user = await User.isUserExistsByCustomId(payload.id);

    if (!user) {
        throw new AppError(StatusCodes.NOT_FOUND, "The user is not found!")
    };

    if (user?.isDeleted === true) {
        throw new AppError(StatusCodes.FORBIDDEN, "The user is deleted!")
    };

    if (user?.status === "blocked") {
        throw new AppError(StatusCodes.FORBIDDEN, "The user is blocked!")
    };

    if (!await User.isPasswordMatched(payload?.password, user?.password)) {
        throw new AppError(StatusCodes.FORBIDDEN, "User password is not matched!")
    };

    const jwtPayload = {
        userId: user.id,
        role: user.role
    };

    const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, { expiresIn: "10d" });

    return {
        accessToken,
        needsPasswordChange: user?.needsPasswordChange
    };
};

export const AuthServices = {
    loginUser
}