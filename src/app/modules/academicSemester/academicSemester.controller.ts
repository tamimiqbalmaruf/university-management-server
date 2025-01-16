
import sendResponse from "../../utils/sendResponse";


import {
  StatusCodes
} from 'http-status-codes';
import catchAsync from "../../utils/catchAsync";
import { AcademicSemesterServices } from "./academicSemester.service";


const createAcademicSemester = catchAsync(async (req, res) => {

  const result = await AcademicSemesterServices.createAcademicSemester(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Academic semester is created successfully',
    data: result
  });

});


const getAllAcademicSemester = catchAsync(async (req, res) => {

  const result = await AcademicSemesterServices.getAllAcademicSemester(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Academic semesters are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });

});

const getSingleAcademicSemester = catchAsync(async (req, res) => {

  const { semesterId } = req.params;

  const result = await AcademicSemesterServices.getSingleAcademicSemester(semesterId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Academic semester is retrieved successfully',
    data: result
  });

})

const updateAcademicSemester = catchAsync(async (req, res) => {

  const { semesterId } = req.params;

  const result = await AcademicSemesterServices.updateAcademicSemester(semesterId, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Academic semester is updated successfully',
    data: result
  });

});

export const AcademicSemesterControllers = {
  createAcademicSemester,
  getAllAcademicSemester,
  getSingleAcademicSemester,
  updateAcademicSemester
}