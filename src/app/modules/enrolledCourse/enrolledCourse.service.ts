/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from 'http-status-codes';
import { OfferedCourse } from '../offeredCourse/offeredCourse.model';
import { TEnrolledCourse } from './enrolledCourse.interface';
import AppError from '../../errors/AppError';
import EnrolledCourse from './enrolledCourse.model';
import { Student } from '../student/student.model';

const createEnrolledCourseIntoDB = async (
  userId: string,
  payload: TEnrolledCourse,
) => {

  const { offeredCourse } = payload;

  const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse);

  if (!isOfferedCourseExists) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Offered course not found !');
  };

  if (isOfferedCourseExists.maxCapacity <= 0) {
    throw new AppError(StatusCodes.BAD_GATEWAY, 'Room is full !');
  }

  const student = await Student.findOne({ id: userId }, { _id: 1 });

  if (!student) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Student not found !');
  }

  const isStudentAlreadyEnrolled = await EnrolledCourse.findOne({
    semesterRegistration: isOfferedCourseExists?.semesterRegistration,
    offeredCourse,
    student: student?._id
  });

  if (isStudentAlreadyEnrolled) {
    throw new AppError(StatusCodes.CONFLICT, 'Student is already enrolled !');
  }



};


export const EnrolledCourseServices = {
  createEnrolledCourseIntoDB,
};