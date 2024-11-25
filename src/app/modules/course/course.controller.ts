import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CourseServices } from './course.service';


const createCourse = catchAsync(async (req, res) => {

    const result = await CourseServices.createCourse();

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Course is created successfully',
        data: result
    });

});

const getSingleCourse = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseServices.getSingleCourse(id);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Course is retrieved successfully',
        data: result,
    });
});

const getAllCourses = catchAsync(async (req, res) => {
    const result = await CourseServices.getAllCourses();

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Faculties are retrieved successfully',
        data: result,
    });
});

const updateCourse = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { course } = req.body;
    const result = await CourseServices.updateCourse(id, course);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Course is updated successfully',
        data: result,
    });
});

const deleteCourse = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseServices.deleteCourse(id);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Course is deleted successfully',
        data: result,
    });
});

export const CourseControllers = {
    createCourse,
    getAllCourses,
    getSingleCourse,
    deleteCourse,
    updateCourse,
};