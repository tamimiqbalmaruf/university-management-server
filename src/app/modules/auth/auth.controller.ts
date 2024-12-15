

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


export const AuthControllers = {
    loginUser
}