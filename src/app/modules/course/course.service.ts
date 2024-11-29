import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import { courseSearchableFields } from "./course.constant";
import { TCourse } from "./course.interface";
import { Course } from "./course.model"
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";

const createCourse = async () => {
    const result = await Course.create();
    return result;
};

const getAllCourses = async (query: Record<string, unknown>) => {
    const courseQuery = new QueryBuilder(Course.find().populate('preRequisiteCourses.course'), query)
        .search(courseSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = await courseQuery.modelQuery;
    return result;
}

const getSingleCourse = async (id: string) => {
    const result = await Course.findById(id).populate('preRequisiteCourses.course');
    return result;
}

const updateCourse = async (id: string, payload: Partial<TCourse>) => {
    const { preRequisiteCourses, ...courseRemainingData } = payload;

    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        //step1: basic course info update
        const updatedBasicCourseInfo = await Course.findByIdAndUpdate(
            id,
            courseRemainingData,
            {
                new: true,
                runValidators: true,
                session,
            },
        );

        if (!updatedBasicCourseInfo) {
            throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to update course!');
        }

        // check if there is any pre requisite courses to update
        if (preRequisiteCourses && preRequisiteCourses.length > 0) {
            // filter out the deleted fields
            const deletedPreRequisites = preRequisiteCourses
                .filter((el) => el.course && el.isDeleted)
                .map((el) => el.course);

            const deletedPreRequisiteCourses = await Course.findByIdAndUpdate(
                id,
                {
                    $pull: {
                        preRequisiteCourses: { course: { $in: deletedPreRequisites } },
                    },
                },
                {
                    new: true,
                    runValidators: true,
                    session,
                },
            );

            if (!deletedPreRequisiteCourses) {
                throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to update course!');
            }

            // filter out the new course fields
            const newPreRequisites = preRequisiteCourses?.filter(
                (el) => el.course && !el.isDeleted,
            );

            const newPreRequisiteCourses = await Course.findByIdAndUpdate(
                id,
                {
                    $addToSet: { preRequisiteCourses: { $each: newPreRequisites } },
                },
                {
                    new: true,
                    runValidators: true,
                    session,
                },
            );

            if (!newPreRequisiteCourses) {
                throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to update course!');
            }
        }

        await session.commitTransaction();
        await session.endSession();

        const result = await Course.findById(id).populate(
            'preRequisiteCourses.course',
        );

        return result;
    } catch (err) {
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to update course');
    }
};

const deleteCourse = async (id: string) => {
    const result = await Course.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    return result;
}

export const CourseServices = {
    createCourse,
    getAllCourses,
    getSingleCourse,
    updateCourse,
    deleteCourse
};