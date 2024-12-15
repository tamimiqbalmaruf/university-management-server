import bcrypt from 'bcrypt';


import { StatusCodes } from "http-status-codes";

import AppError from "../../errors/AppError";
import { TLoginUser } from "./auth.interface";
import { User } from "../user/user.model";


const loginUser = async (payload: TLoginUser) => {

    const isUserExists = await User.findOne({ id: payload?.id });

    if (!isUserExists) {
        throw new AppError(StatusCodes.NOT_FOUND, "The user is not found!")
    };

    if (isUserExists?.isDeleted === true) {
        throw new AppError(StatusCodes.FORBIDDEN, "The user is deleted!")
    };

    if (isUserExists?.status === "blocked") {
        throw new AppError(StatusCodes.FORBIDDEN, "The user is blocked!")
    };

    const isPasswordMatch = await bcrypt.compare(payload?.password, isUserExists?.password);

    if (!isPasswordMatch) {
        throw new AppError(StatusCodes.FORBIDDEN, "User password is not matched!")
    };
    // return result;
};

export const AuthServices = {
    loginUser
}