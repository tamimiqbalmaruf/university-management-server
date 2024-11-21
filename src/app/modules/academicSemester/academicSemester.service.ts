import { StatusCodes } from "http-status-codes";
import { academicSemesterNameCodeMapper } from "./academicSemester.constant";
import { TAcademicSemester } from "./academicSemester.interface";
import { AcademicSemester } from "./academicSemester.model";
import AppError from "../../errors/AppError";


const createAcademicSemester = async (payload: TAcademicSemester) => {

    if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
        throw new AppError(StatusCodes.BAD_REQUEST,"Invalid Semester Code")
    }


    const result = await AcademicSemester.create(payload);
    return result;
};

const getAllAcademicSemester = async () => {
    const result = await AcademicSemester.find();
    return result;
};

const getSingleAcademicSemester = async (id: string) => {
    const result = await AcademicSemester.findById(id)
    return result;
};

const updateAcademicSemester = async (id: string, payload: Partial<TAcademicSemester>) => {

    if (payload.name && payload.code && academicSemesterNameCodeMapper[payload.name] !== payload.code) {
        throw new AppError(StatusCodes.BAD_REQUEST,"Invalid Semester Code");
    };

    

    const result = await AcademicSemester.findByIdAndUpdate(id, payload)
    return result;
};


export const AcademicSemesterServices = {
    createAcademicSemester,
    getAllAcademicSemester,
    getSingleAcademicSemester,
    updateAcademicSemester
}