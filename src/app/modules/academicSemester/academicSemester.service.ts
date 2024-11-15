import { TAcademicSemester } from "./academicSemester.interface";
import { AcademicSemester } from "./academicSemester.model";



const createAcademicSemester = async (payload: TAcademicSemester) => {
    const result = await AcademicSemester.create(payload);
    return result;
};


export const AcademicSemesterServices = {
    createAcademicSemester
}