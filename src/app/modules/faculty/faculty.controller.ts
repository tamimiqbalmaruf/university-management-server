import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { FacultyServices } from './faculty.service';

const getSingleFaculty = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await FacultyServices.getSingleFaculty(id);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Faculty is retrieved successfully',
        data: result,
    });
});

const getAllFaculties = catchAsync(async (req, res) => {
    const result = await FacultyServices.getAllFaculties(req.query);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Faculties are retrieved successfully',
        meta: result.meta,
    data: result.result,
    });
});

const updateFaculty = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { faculty } = req.body;
    const result = await FacultyServices.updateFaculty(id, faculty);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Faculty is updated successfully',
        data: result,
    });
});

const deleteFaculty = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await FacultyServices.deleteFaculty(id);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Faculty is deleted successfully',
        data: result,
    });
});

export const FacultyControllers = {
    getAllFaculties,
    getSingleFaculty,
    deleteFaculty,
    updateFaculty,
};