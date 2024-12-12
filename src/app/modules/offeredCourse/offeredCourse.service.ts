import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";
import { TOfferedCourse } from "./offeredCourse.interface";
import { OfferedCourse } from "./offeredCourse.model";
import { SemesterRegistration } from "../semesterRegistration/semesterRegistration.model";
import { AcademicFaculty } from "../academicFaculty/academicFaculty.model";
import { AcademicDepartment } from "../academicDepartment/academicDepartment.model";
import { Course } from "../course/course.model";
import { Faculty } from "../faculty/faculty.model";
import { hasTimeConflict } from "./offeredCourse.utils";


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

    const isSemesterRegistrationExists = await SemesterRegistration.findById(semesterRegistration);

    if (!isSemesterRegistrationExists) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Semester registration not found!")
    }

    const academicSemester = isSemesterRegistrationExists.academicSemester;

    const isAcademicFacultyExists =
        await AcademicFaculty.findById(academicFaculty);

    if (!isAcademicFacultyExists) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Academic Faculty not found !');
    }

    const isAcademicDepartmentExists =
        await AcademicDepartment.findById(academicDepartment);

    if (!isAcademicDepartmentExists) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Academic Department not found !');
    }

    const isCourseExists = await Course.findById(course);

    if (!isCourseExists) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Course not found !');
    }

    const isFacultyExists = await Faculty.findById(faculty);

    if (!isFacultyExists) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Faculty not found !');
    }


    const isDepartmentBelongToFaculty = await AcademicDepartment.findOne({
        _id: academicDepartment,
        academicFaculty,
    });


    if (!isDepartmentBelongToFaculty) {
        throw new AppError(StatusCodes.BAD_REQUEST, `This ${isAcademicDepartmentExists.name} is not  belong to this ${isAcademicFacultyExists.name}`);
    };


    const isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection = await OfferedCourse.findOne({ semesterRegistration, course, section });

    if (isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection) {
        throw new AppError(StatusCodes.BAD_REQUEST, `Offered course with same section is already exist!`)
    }


    const assignedSchedules = await OfferedCourse.find({ semesterRegistration, faculty, days: { $in: days } }).select("days startTime endTime");

    const newSchedule = {
        days,
        startTime,
        endTime
    };


    if (hasTimeConflict(assignedSchedules, newSchedule)) {
        throw new AppError(
            StatusCodes.CONFLICT,
            `This faculty is not available at that time ! Choose other time or day`,
        );
    }



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

const updateOfferedCourse = async (id: string, payload: Pick<TOfferedCourse, "faculty" | "days" | "startTime" | "endTime">) => {

    const {
        faculty,
        days,
        startTime,
        endTime,
    } = payload;

    const isOfferedCourseExists = await OfferedCourse.findById(id);

    if (!isOfferedCourseExists) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Offered course is not found!');
    }

    const isFacultyExists = await Faculty.findById(faculty);

    if (!isFacultyExists) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Faculty is not found!');
    }

    const semesterRegistration = isOfferedCourseExists.semesterRegistration;


    const semesterRegistrationStatus = await SemesterRegistration.findById(semesterRegistration);

    if (semesterRegistrationStatus?.status !== 'UPCOMING') {
        throw new AppError(
            StatusCodes.BAD_REQUEST,
            `You can not update this offered course as it is ${semesterRegistrationStatus?.status}`,
        );
    }


    const assignedSchedules = await OfferedCourse.find({ semesterRegistration, faculty, days: { $in: days } }).select("days startTime endTime");

    const newSchedule = {
        days,
        startTime,
        endTime
    };

    if (hasTimeConflict(assignedSchedules, newSchedule)) {
        throw new AppError(
            StatusCodes.CONFLICT,
            `This faculty is not available at that time ! Choose other time or day`,
        );
    }


    const result = await OfferedCourse.findByIdAndUpdate(id, payload, { new: true })
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