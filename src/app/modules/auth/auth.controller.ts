

import sendResponse from "../../utils/sendResponse";


import {
    StatusCodes
} from 'http-status-codes';
import catchAsync from "../../utils/catchAsync";
import { AuthServices } from "./auth.service";


const loginUser = catchAsync(async (req, res) => {

    const result = await AuthServices.loginUser(req.body);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'User is logged in successfully!',
        data: result
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