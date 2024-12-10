import sendResponse from "../../utils/sendResponse";
import {
  StatusCodes
} from 'http-status-codes';
import catchAsync from "../../utils/catchAsync";
import { OfferedCourseServices } from "./offeredCourse.service";



const createOfferedCourse = catchAsync(async (req, res) => {

  const result = await OfferedCourseServices.createOfferedCourse(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Offered Course is created successfully',
    data: result
  });

});


const getAllOfferedCourses = catchAsync(async (req, res) => {

  const result = await OfferedCourseServices.getAllOfferedCourses(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Offered Courses are retrieved successfully',
    data: result
  });

});

const getSingleOfferedCourse = catchAsync(async (req, res) => {

  const { id } = req.params;

  const result = await OfferedCourseServices.getSingleOfferedCourse(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Offered Course is retrieved successfully',
    data: result
  });

})

const updateOfferedCourse = catchAsync(async (req, res) => {

  const { id } = req.params;

  const result = await OfferedCourseServices.updateOfferedCourse(id, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Offered Course is updated successfully',
    data: result
  });

});

const deleteOfferedCourse = catchAsync(async (req, res) => {

  const { id } = req.params;

  const result = await OfferedCourseServices.deleteOfferedCourse(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Offered Course is deleted successfully',
    data: result
  });

});

export const OfferedCourseControllers = {
  createOfferedCourse,
  getAllOfferedCourses,
  getSingleOfferedCourse,
  updateOfferedCourse,
  deleteOfferedCourse
}