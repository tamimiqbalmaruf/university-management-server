

import sendResponse from "../../utils/sendResponse";


import {
    StatusCodes
} from 'http-status-codes';
import catchAsync from "../../utils/catchAsync";
import { AuthServices } from "./auth.service";
import config from "../../config";


const loginUser = catchAsync(async (req, res) => {

    const result = await AuthServices.loginUser(req.body);

    const {accessToken, refreshToken, needsPasswordChange} = result;

    res.cookie('refreshToken', refreshToken, {
        secure: config.NODE_ENV === "production",
        httpOnly: true
    })

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'User is logged in successfully!',
        data: {
            accessToken,
            needsPasswordChange
        }
    });

});


const changePassword = catchAsync(async (req, res) => {
    const {...passwordData} = req.body;
    const result = await AuthServices.changePassword(req.user, passwordData);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'User password changed successfully!',
        data: result
    });

});


export const AuthControllers = {
    loginUser,
    changePassword
}