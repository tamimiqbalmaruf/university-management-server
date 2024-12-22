

import { StatusCodes } from "http-status-codes";

import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { TChangePassword, TLoginUser } from "./auth.interface";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import bcrypt from "bcrypt";
import { createToken } from "./auth.utils";
import { sendEmail } from "../../utils/sendEmail";


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
        userId: user?.id,
        role: user?.role
    };

    const accessToken = createToken(jwtPayload, config.jwt_access_secret as string, config.jwt_access_expires_in as string);

    const refreshToken = createToken(jwtPayload, config.jwt_refresh_secret as string, config.jwt_refresh_expires_in as string);

    return {
        accessToken,
        refreshToken,
        needsPasswordChange: user?.needsPasswordChange
    };
};


const changePassword = async (userData: JwtPayload, payload: TChangePassword) => {

    const user = await User.isUserExistsByCustomId(userData.userId);

    if (!user) {
        throw new AppError(StatusCodes.NOT_FOUND, "The user is not found!")
    };

    if (user?.isDeleted === true) {
        throw new AppError(StatusCodes.FORBIDDEN, "The user is deleted!")
    };

    if (user?.status === "blocked") {
        throw new AppError(StatusCodes.FORBIDDEN, "The user is blocked!")
    };

    if (!await User.isPasswordMatched(payload?.oldPassword, user?.password)) {
        throw new AppError(StatusCodes.FORBIDDEN, "User password is not matched!")
    };


    const newHashedPassword = await bcrypt.hash(
        payload.newPassword,
        Number(config.bcrypt_salt_rounds),
    );


    await User.findOneAndUpdate(
        {
            id: userData.userId,
            role: userData.role,
        },
        {
            password: newHashedPassword,
            needsPasswordChange: false,
            passwordChangedAt: new Date(),
        },
    );

    return null;
};


const refreshToken = async (token: string) => {

    const decoded = jwt.verify(token, config.jwt_refresh_secret as string)

    const { userId, iat } = decoded as JwtPayload;

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

    const jwtPayload = {
        userId: user.id,
        role: user.role,
    };

    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as string,
    );

    return {
        accessToken,
    };

};

const forgetPassword = async (id: string) => {

    const user = await User.isUserExistsByCustomId(id);

    if (!user) {
        throw new AppError(StatusCodes.NOT_FOUND, "The user is not found!")
    };

    if (user?.isDeleted === true) {
        throw new AppError(StatusCodes.FORBIDDEN, "The user is deleted!")
    };

    if (user?.status === "blocked") {
        throw new AppError(StatusCodes.FORBIDDEN, "The user is blocked!")
    };


    const jwtPayload = {
        userId: user.id,
        role: user.role,
    };

    const resetToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        '10m'
    );

    const resetUILink = `${config.reset_pass_ui_link}?id=${user?.id}&token=${resetToken}`;

    await sendEmail(user?.email, resetUILink);

};

export const AuthServices = {
    loginUser,
    changePassword,
    refreshToken,
    forgetPassword
}