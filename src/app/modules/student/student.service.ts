import mongoose from 'mongoose';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { AcademicFaculty } from '../academicFaculty/academicFaculty.model';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from './student.interface';
import { Student } from './student.model';
import AppError from '../../errors/AppError';
import { StatusCodes } from 'http-status-codes';
import { User } from '../user/user.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { studentSearchableFields } from './student.constant';



const getAllStudentsFromDB = async (query: Record<string, unknown>) => {

  const studentQuery = new QueryBuilder(Student.find(), query)
    .search(studentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();


  const result = await studentQuery.modelQuery.populate({
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


const updateStudentFromDB = async (id: string, payload: Partial<TStudent>) => {

  const { name, guardian, localGuardian, ...remainingStudentData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = { ...remainingStudentData };


  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdatedData[`guardian.${key}`] = value;
    }
  }

  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdatedData[`localGuardian.${key}`] = value;
    }
  }



  const result = await Student.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
    runValidators: true
  });


  return result;

};



const deleteStudentFromDB = async (id: string) => {


  const isUserExists = await Student.isUserExists(id);

  if (!isUserExists) {
    throw new AppError(StatusCodes.BAD_REQUEST, "This user doesn't exist")
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();


    const deletedStudent = await Student.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session }
    );


    if (!deletedStudent) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Failed to delete student")
    };


    // get user _id from deletedStudent
    const userId = deletedStudent.user;

    const deletedUser = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, session }
    );


    if (!deletedUser) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Failed to delete user")
    };

    await session.commitTransaction();
    await session.endSession()

    return deletedStudent;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error)
  }

};

export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  updateStudentFromDB,
  deleteStudentFromDB,
};