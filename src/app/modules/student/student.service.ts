import mongoose from 'mongoose';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { AcademicFaculty } from '../academicFaculty/academicFaculty.model';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from './student.interface';
import { Student } from './student.model';
import AppError from '../../errors/AppError';
import { StatusCodes } from 'http-status-codes';
import { User } from '../user/user.model';



const getAllStudentsFromDB = async () => {
  const result = await Student.find().populate({
    path: "academicSemester",
    model: AcademicSemester
  }).populate({
    path: "academicDepartment",
    model: AcademicDepartment,
    populate: ({
      path: "academicFaculty",
      model: AcademicFaculty
    })
  });
  return result;
};

const getSingleStudentFromDB = async (id: string) => {
  const result = await Student.findById(id).populate({
    path: "academicSemester",
    model: AcademicSemester
  }).populate({
    path: "academicDepartment",
    model: AcademicDepartment,
    populate: ({
      path: "academicFaculty",
      model: AcademicFaculty
    })
  });
  return result;
};

const deleteStudentFromDB = async (id: string) => {


  const isUserExists = await Student.isUserExists(id);

  if(!isUserExists){
    throw new AppError(StatusCodes.BAD_REQUEST, "This user doesn't exist")
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();


    const deletedStudent = await Student.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session }
    );


    if (!deletedStudent) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Failed to delete student")
    };


    const deletedUser = await User.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session }
    );


    if (!deletedUser) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Failed to delete user")
    };

    await session.commitTransaction();
    await session.endSession()

    return deletedStudent;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
  }



};

export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
};