import config from "../../config";
import { TStudent } from "../student/student.interface";
import { Student } from "../student/student.model";
import { TNewUser } from "./user.interface";
import { User } from "./user.model";



const createStudentIntoDB = async (password: string, studentData: TStudent) => {
    const user :TNewUser  = {};

    user.password = password || config.default_password as string

    user.role = "student";

    user.id = "2030100001"

    const result = await User.create(user);


if(Object.keys(result).length){
studentData.id = result.id;
studentData.user = result._id
}



    return result;
};


export const UserServices = {
    createStudentIntoDB
}