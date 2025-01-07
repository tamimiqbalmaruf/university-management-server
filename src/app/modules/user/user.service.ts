import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import config from "../../config";
import AppError from "../../errors/AppError";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";
import { AcademicDepartment } from "../academicDepartment/academicDepartment.model";
import { TAcademicSemester } from "../academicSemester/academicSemester.interface";
import { AcademicSemester } from "../academicSemester/academicSemester.model";
import { Admin } from "../admin/admin.model";
import { TFaculty } from "../faculty/faculty.interface";
import { Faculty } from "../faculty/faculty.model";
import { TStudent } from "../student/student.interface";
import { Student } from "../student/student.model";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import { generateAdminId, generateFacultyId, generateStudentId } from "./user.utils";


const createStudentIntoDB = async (file: any, password: string, payload: TStudent) => {
  const userData: Partial<TUser> = {};

  userData.password = password || config.default_password as string

  userData.role = "student";
  userData.email = payload?.email;

  const admissionSemester = await AcademicSemester.findById(payload.admissionSemester);

  if (!admissionSemester) {
    throw new AppError(400, 'Admission semester not found');
  }

  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment,
  );

  if (!academicDepartment) {
    throw new AppError(400, 'Academic department not found');
  };
  payload.academicFaculty = academicDepartment.academicFaculty;

  const session = await mongoose.startSession()


  try {
    session.startTransaction();

    userData.id = await generateStudentId(admissionSemester as TAcademicSemester);

    if (file) {
      const imageName = `${userData?.id}${payload.name.firstName}`;
      const path = file?.path;

      const { secure_url } = await sendImageToCloudinary(imageName, path) as any;

      payload.profileImg = secure_url as string;
    }



    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Failed to create user")
    };

    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;


    const newStudent = await Student.create([payload], { session });

    if (!newStudent.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Failed to create student")
    };


    await session.commitTransaction();
    await session.endSession()

    return newStudent;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error)
  }
};


const createFacultyIntoDB = async (file: any, password: string, payload: TFaculty) => {
  const userData: Partial<TUser> = {};

  userData.password = password || (config.default_password as string);

  userData.role = 'faculty';
  userData.email = payload?.email;

  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment,
  );

  if (!academicDepartment) {
    throw new AppError(400, 'Academic department not found');
  }

  payload.academicFaculty = academicDepartment.academicFaculty;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    userData.id = await generateFacultyId();

    if (file) {
      const imageName = `${userData?.id}${payload.name.firstName}`;
      const path = file?.path;

      const { secure_url } = await sendImageToCloudinary(imageName, path) as any;

      payload.profileImg = secure_url as string;
    }


    const newUser = await User.create([userData], { session }); // array

    if (!newUser.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create user');
    }

    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    const newFaculty = await Faculty.create([payload], { session });

    if (!newFaculty.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create faculty');
    }

    await session.commitTransaction();
    await session.endSession();

    return newFaculty;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};


const createAdminIntoDB = async (file: any, password: string, payload: TFaculty) => {
  const userData: Partial<TUser> = {};

  userData.password = password || (config.default_password as string);

  userData.role = 'admin';
  userData.email = payload?.email;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    userData.id = await generateAdminId();

    if (file) {
      const imageName = `${userData?.id}${payload.name.firstName}`;
      const path = file?.path;

      const { secure_url } = await sendImageToCloudinary(imageName, path) as any;

      payload.profileImg = secure_url as string;
    }


    const newUser = await User.create([userData], { session }); // array

    if (!newUser.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create user');
    }

    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    const newAdmin = await Admin.create([payload], { session });

    if (!newAdmin.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create admin');
    }

    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};


const getMe = async (userId: string, role: string) => {

  let result = null;

  if (role === 'admin') {
    result = await Admin.findOne({ id: userId }).populate('user');
  }

  if (role === 'faculty') {
    result = await Faculty.findOne({ id: userId }).populate('user');
  }
  if (role === 'student') {
    result = await Student.findOne({ id: userId }).populate('user');
  }

  return result;
};


const changeStatus = async (id: string, payload: { status: string }) => {
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};


export const UserServices = {
  createStudentIntoDB,
  createFacultyIntoDB,
  createAdminIntoDB,
  getMe,
  changeStatus
}