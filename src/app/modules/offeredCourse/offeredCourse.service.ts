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
import QueryBuilder from "../../builder/QueryBuilder";
import { Student } from "../student/student.model";


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
    const offeredCourseQuery = new QueryBuilder(OfferedCourse.find(), query)
        .filter()
        .sort()
        .paginate()
        .fields();

    const meta = await offeredCourseQuery.countTotal();
    const result = await offeredCourseQuery.modelQuery;
    return {
        meta,
        result
    };
};

const getMyOfferedCourses = async (
    userId: string,
    query: Record<string, unknown>,
) => {
    //pagination setup

    const page = Number(query?.page) || 1;
    const limit = Number(query?.limit) || 10;
    const skip = (page - 1) * limit;

    const student = await Student.findOne({ id: userId });
    // find the student
    if (!student) {
        throw new AppError(StatusCodes.NOT_FOUND, 'User is not found');
    }

    //find current ongoing semester
    const currentOngoingRegistrationSemester = await SemesterRegistration.findOne(
        {
            status: 'ONGOING',
        },
    );

    if (!currentOngoingRegistrationSemester) {
        throw new AppError(
            StatusCodes.NOT_FOUND,
            'There is no ongoing semester registration!',
        );
    }

    const aggregationQuery = [
        {
            $match: {
                semesterRegistration: currentOngoingRegistrationSemester?._id,
                academicFaculty: student.academicFaculty,
                academicDepartment: student.academicDepartment,
            },
        },
        {
            $lookup: {
                from: 'courses',
                localField: 'course',
                foreignField: '_id',
                as: 'course',
            },
        },
        {
            $unwind: '$course',
        },
        {
            $lookup: {
                from: 'enrolledcourses',
                let: {
                    currentOngoingRegistrationSemester:
                        currentOngoingRegistrationSemester._id,
                    currentStudent: student._id,
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: [
                                            '$semesterRegistration',
                                            '$$currentOngoingRegistrationSemester',
                                        ],
                                    },
                                    {
                                        $eq: ['$student', '$$currentStudent'],
                                    },
                                    {
                                        $eq: ['$isEnrolled', true],
                                    },
                                ],
                            },
                        },
                    },
                ],
                as: 'enrolledCourses',
            },
        },
        {
            $lookup: {
                from: 'enrolledcourses',
                let: {
                    currentStudent: student._id,
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: ['$student', '$$currentStudent'],
                                    },
                                    {
                                        $eq: ['$isCompleted', true],
                                    },
                                ],
                            },
                        },
                    },
                ],
                as: 'completedCourses',
            },
        },
        {
            $addFields: {
                completedCourseIds: {
                    $map: {
                        input: '$completedCourses',
                        as: 'completed',
                        in: '$$completed.course',
                    },
                },
            },
        },
        {
            $addFields: {
                isPreRequisitesFulFilled: {
                    $or: [
                        { $eq: ['$course.preRequisiteCourses', []] },
                        {
                            $setIsSubset: [
                                '$course.preRequisiteCourses.course',
                                '$completedCourseIds',
                            ],
                        },
                    ],
                },

                isAlreadyEnrolled: {
                    $in: [
                        '$course._id',
                        {
                            $map: {
                                input: '$enrolledCourses',
                                as: 'enroll',
                                in: '$$enroll.course',
                            },
                        },
                    ],
                },
            },
        },
        {
            $match: {
                isAlreadyEnrolled: false,
                isPreRequisitesFulFilled: true,
            },
        },
    ];

    const paginationQuery = [
        {
            $skip: skip,
        },
        {
            $limit: limit,
        },
    ];

    const result = await OfferedCourse.aggregate([
        ...aggregationQuery,
        ...paginationQuery,
    ]);

    const total = (await OfferedCourse.aggregate(aggregationQuery)).length;

    const totalPage = Math.ceil(result.length / limit);

    return {
        meta: {
            page,
            limit,
            total,
            totalPage,
        },
        result,
    };
};


const getSingleOfferedCourse = async (id: string) => {
    const offeredCourse = await OfferedCourse.findById(id);

    if (!offeredCourse) {
        throw new AppError(404, 'Offered Course not found');
    }

    return offeredCourse;
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

    const isOfferedCourseExists = await OfferedCourse.findById(id);

    if (!isOfferedCourseExists) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Offered Course not found');
    }

    const semesterRegistration = isOfferedCourseExists.semesterRegistration;

    const semesterRegistrationStatus =
        await SemesterRegistration.findById(semesterRegistration).select('status');

    if (semesterRegistrationStatus?.status !== 'UPCOMING') {
        throw new AppError(
            StatusCodes.BAD_REQUEST,
            `Offered course can not update ! because the semester ${semesterRegistrationStatus}`,
        );
    }

    const result = await OfferedCourse.findByIdAndDelete(id)
    return result;
};


export const OfferedCourseServices = {
    createOfferedCourse,
    getAllOfferedCourses,
    getMyOfferedCourses,
    getSingleOfferedCourse,
    updateOfferedCourse,
    deleteOfferedCourse
}