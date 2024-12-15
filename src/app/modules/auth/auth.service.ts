

import { StatusCodes } from "http-status-codes";

import AppError from "../../errors/AppError";
import { TLoginUser } from "./auth.interface";
import { User } from "../user/user.model";


const loginUser = async (payload: TLoginUser) => {

    const isUserExists = await User.findOne({id: payload.id});

    if(isUserExists){
        throw new AppError(StatusCodes.NOT_FOUND, "The user is not found!")
    };

    
    // return result;
};

export const AuthServices = {
    loginUser
}