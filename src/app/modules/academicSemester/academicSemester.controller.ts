
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

export const AcademicSemesterControllers = {
    createAcademicSemester
}