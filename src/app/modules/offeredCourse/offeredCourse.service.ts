import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";
import { TOfferedCourse } from "./offeredCourse.interface";
import { OfferedCourse } from "./offeredCourse.model";
import { SemesterRegistration } from "../semesterRegistration/semesterRegistration.model";
import { AcademicFaculty } from "../academicFaculty/academicFaculty.model";
import { AcademicDepartment } from "../academicDepartment/academicDepartment.model";
import { Course } from "../course/course.model";
import { Faculty } from "../faculty/faculty.model";


const createOfferedCourse = async (payload: TOfferedCourse) => {
    const {
        semesterRegistration,
        academicFaculty,
        academicDepartment,
        course,
        section,
        faculty,
        days,
        startTime,
        endTime,
    } = payload;

    const isSemesterRegistrationExits = await SemesterRegistration.findById(semesterRegistration);

    if (!isSemesterRegistrationExits) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Semester registration not found!")
    }

    const academicSemester = isSemesterRegistrationExits.academicSemester;

    const isAcademicFacultyExits =
        await AcademicFaculty.findById(academicFaculty);

    if (!isAcademicFacultyExits) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Academic Faculty not found !');
    }

    const isAcademicDepartmentExits =
        await AcademicDepartment.findById(academicDepartment);

    if (!isAcademicDepartmentExits) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Academic Department not found !');
    }

    const isCourseExits = await Course.findById(course);

    if (!isCourseExits) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Course not found !');
    }

    const isFacultyExits = await Faculty.findById(faculty);

    if (!isFacultyExits) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Faculty not found !');
    }





    const result = await OfferedCourse.create({...payload, academicSemester});
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