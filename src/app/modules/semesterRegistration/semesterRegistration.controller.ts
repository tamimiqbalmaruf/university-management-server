import sendResponse from "../../utils/sendResponse";
import {
  StatusCodes
} from 'http-status-codes';
import catchAsync from "../../utils/catchAsync";
import { SemesterRegistrationServices } from "./semesterRegistration.service";


const createSemesterRegistration = catchAsync(async (req, res) => {

  const result = await SemesterRegistrationServices.createSemesterRegistration(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Semester Registration is created successfully',
    data: result
  });

});


const getAllSemesterRegistration = catchAsync(async (req, res) => {

  const result = await SemesterRegistrationServices.getAllSemesterRegistration();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Semester Registrations are retrieved successfully',
    data: result
  });

});

const getSingleSemesterRegistration = catchAsync(async (req, res) => {

  const { semesterId } = req.params;

  const result = await SemesterRegistrationServices.getSingleSemesterRegistration(semesterId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Semester Registration is retrieved successfully',
    data: result
  });

})

const updateSemesterRegistration = catchAsync(async (req, res) => {

  const { semesterId } = req.params;

  const result = await SemesterRegistrationServices.updateSemesterRegistration(semesterId, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Semester Registration is updated successfully',
    data: result
  });

});

export const SemesterRegistrationControllers = {
  createSemesterRegistration,
  getAllSemesterRegistration,
  getSingleSemesterRegistration,
  updateSemesterRegistration
}