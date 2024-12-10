import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";
import { TOfferedCourse } from "./offeredCourse.interface";
import { OfferedCourse } from "./offeredCourse.model";


const createOfferedCourse = async (payload: TOfferedCourse) => {

    const result = await OfferedCourse.create(payload);
    return result;
};

const getAllOfferedCourses = async (query: Record<string, unknown>) => {
    const result = await OfferedCourse.find();
    return result;
};

const getSingleOfferedCourse = async (id: string) => {
    const result = await OfferedCourse.findById(id)
    return result;
};

const updateOfferedCourse = async (id: string, payload: Partial<TOfferedCourse>) => {




    const result = await OfferedCourse.findByIdAndUpdate(id, payload)
    return result;
};

const deleteOfferedCourse = async (id: string) => {
    const result = await OfferedCourse.findByIdAndDelete(id)
    return result;
};


export const OfferedCourseServices = {
    createOfferedCourse,
    getAllOfferedCourses,
    getSingleOfferedCourse,
    updateOfferedCourse,
    deleteOfferedCourse
}