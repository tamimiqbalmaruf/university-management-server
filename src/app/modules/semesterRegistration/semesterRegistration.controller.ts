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


const getAllSemesterRegistrations = catchAsync(async (req, res) => {

  const result = await SemesterRegistrationServices.getAllSemesterRegistrations(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Semester Registrations are retrieved successfully',
    meta: result.meta,
      data: result.result,
  });

});

const getSingleSemesterRegistration = catchAsync(async (req, res) => {

  const { id } = req.params;

  const result = await SemesterRegistrationServices.getSingleSemesterRegistration(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Semester Registration is retrieved successfully',
    data: result
  });

})

const updateSemesterRegistration = catchAsync(async (req, res) => {

  const { id } = req.params;

  const result = await SemesterRegistrationServices.updateSemesterRegistration(id, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Semester Registration is updated successfully',
    data: result
  });

});


const deleteSemesterRegistration = catchAsync(async (req, res) => {

  const { id } = req.params;

  const result = await SemesterRegistrationServices.deleteSemesterRegistration(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Semester Registration is deleted successfully',
    data: result
  });

});

export const SemesterRegistrationControllers = {
  createSemesterRegistration,
  getAllSemesterRegistrations,
  getSingleSemesterRegistration,
  updateSemesterRegistration,
  deleteSemesterRegistration
}