import { StatusCodes } from "http-status-codes";

import AppError from "../../errors/AppError";
import { SemesterRegistration } from "./semesterRegistration.model";
import { TSemesterRegistration } from "./semesterRegistration.interface";
import { AcademicSemester } from "../academicSemester/academicSemester.model";


const createSemesterRegistration = async (payload: TSemesterRegistration) => {

    if(payload?.academicSemester){
        const isAcademicSemesterExists = await AcademicSemester.findById(payload?.academicSemester);

        if(!isAcademicSemesterExists){
            throw new AppError(StatusCodes.NOT_FOUND, "This academic semester not found!")
        }
    };

    const isSemesterRegistrationExists = await SemesterRegistration.findOne({academicSemester: payload?.academicSemester});

    if(isSemesterRegistrationExists){
        throw new AppError(StatusCodes.CONFLICT, "This semester registration already exists!")
    }

    const result = await SemesterRegistration.create(payload);
    return result;
};

const getAllSemesterRegistration = async () => {
    const result = await SemesterRegistration.find();
    return result;
};

const getSingleSemesterRegistration = async (id: string) => {
    const result = await SemesterRegistration.findById(id)
    return result;
};

const updateSemesterRegistration = async (id: string, payload: Partial<TSemesterRegistration>) => {



    

    const result = await SemesterRegistration.findByIdAndUpdate(id, payload)
    return result;
};


export const SemesterRegistrationServices = {
    createSemesterRegistration,
    getAllSemesterRegistration,
    getSingleSemesterRegistration,
    updateSemesterRegistration
}