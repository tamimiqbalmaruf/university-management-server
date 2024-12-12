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


    const isDepartmentBelongToFaculty = await AcademicDepartment.findOne({
        _id: academicDepartment,
        academicFaculty,
    });


    if (!isDepartmentBelongToFaculty) {
        throw new AppError(StatusCodes.BAD_REQUEST, `This ${isAcademicDepartmentExits.name} is not  belong to this ${isAcademicFacultyExits.name}`);
    };


    const isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection = await OfferedCourse.findOne({ semesterRegistration, course, section });

    if (isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection) {
        throw new AppError(StatusCodes.BAD_REQUEST, `Offered course with same section is already exist!`)
    }


    const assignedSchedules = await OfferedCourse.find({semesterRegistration, faculty, days: {$in: days}}).select("days startTime endTime");

    const newSchedule = {
        days,
        startTime,
        endTime
    };


    assignedSchedules.forEach((schedule) => {
const existingStartTime = new Date(`1970-01-01T${schedule.startTime}`);
const existingEndTime = new Date(`1970-01-01T${schedule.endTime}`);
const newStartTime = new Date(`1970-01-01T${newSchedule.startTime}`);
const newEndTime = new Date(`1970-01-01T${newSchedule.endTime}`);


if(newStartTime < existingEndTime && newEndTime > existingStartTime)
    throw new AppError(StatusCodes.CONFLICT, `This faculty is not available at that time ! Choose other time or day`)
    })


    const result = await OfferedCourse.create({ ...payload, academicSemester });
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