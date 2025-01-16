import sendResponse from "../../utils/sendResponse";
import {
    StatusCodes
} from 'http-status-codes';
import catchAsync from "../../utils/catchAsync";
import { AcademicFacultyServices } from "./academicFaculty.service";


const createAcademicFaculty = catchAsync(async (req, res) => {

    const result = await AcademicFacultyServices.createAcademicFaculty(req.body);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Academic faculty is created successfully',
        data: result
    });

});


const getAllAcademicFaculties = catchAsync(async (req, res) => {

    const result = await AcademicFacultyServices.getAllAcademicFaculties(req.query);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Academic faculties are retrieved successfully',
        meta: result.meta,
        data: result.result,
    });

});

const getSingleAcademicFaculty = catchAsync(async (req, res) => {

    const { id } = req.params;

    const result = await AcademicFacultyServices.getSingleAcademicFaculty(id);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Academic faculty is retrieved successfully',
        data: result
    });

})

const updateAcademicFaculty = catchAsync(async (req, res) => {

    const { id } = req.params;

    const result = await AcademicFacultyServices.updateAcademicFaculty(id, req.body);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Academic faculty is updated successfully',
        data: result
    });

});

export const AcademicFacultyControllers = {
    createAcademicFaculty,
    getAllAcademicFaculties,
    getSingleAcademicFaculty,
    updateAcademicFaculty
}