import config from "../../config";
import { TStudent } from "../student/student.interface";
import { Student } from "../student/student.model";
import { AcademicSemester } from "./academicSemester.model";



const createAcademicSemester = async (data) => {

    const result = await AcademicSemester.create(data);

    return result

};


export const AcademicSemesterServices = {
    createAcademicSemester
}