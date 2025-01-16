import { StatusCodes } from "http-status-codes";

import AppError from "../../errors/AppError";
import { SemesterRegistration } from "./semesterRegistration.model";
import { TSemesterRegistration } from "./semesterRegistration.interface";
import { AcademicSemester } from "../academicSemester/academicSemester.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { RegistrationStatus } from "./semesterRegistration.constant";
import mongoose from "mongoose";
import { OfferedCourse } from "../offeredCourse/offeredCourse.model";


const createSemesterRegistration = async (payload: TSemesterRegistration) => {

    const isThereAnyUpcomingOrOngoingSemester = await SemesterRegistration.findOne({ $or: [{ status: RegistrationStatus.UPCOMING }, { status: RegistrationStatus.ONGOING }] });

    if (isThereAnyUpcomingOrOngoingSemester) {
        throw new AppError(StatusCodes.BAD_REQUEST, `There is already an ${isThereAnyUpcomingOrOngoingSemester.status} registered semester!`)
    }

    if (payload?.academicSemester) {
        const isAcademicSemesterExists = await AcademicSemester.findById(payload?.academicSemester);

        if (!isAcademicSemesterExists) {
            throw new AppError(StatusCodes.NOT_FOUND, "This academic semester is not found!")
        }
    };

    const isSemesterRegistrationExists = await SemesterRegistration.findOne({ academicSemester: payload?.academicSemester });

    if (isSemesterRegistrationExists) {
        throw new AppError(StatusCodes.CONFLICT, "This semester registration already exists!")
    }

    const result = await SemesterRegistration.create(payload);
    return result;
};


const getAllSemesterRegistrations = async (
    query: Record<string, unknown>,
  ) => {
    const semesterRegistrationQuery = new QueryBuilder(
      SemesterRegistration.find().populate('academicSemester'),
      query,
    )
      .filter()
      .sort()
      .paginate()
      .fields();
  
    const result = await semesterRegistrationQuery.modelQuery;
    const meta = await semesterRegistrationQuery.countTotal();
    return {
      result,
      meta,
    };
  };


const getSingleSemesterRegistration = async (id: string) => {
    const result = await SemesterRegistration.findById(id).populate("academicSemester")
    return result;
};


const updateSemesterRegistration = async (id: string, payload: Partial<TSemesterRegistration>) => {

    const requestedSemester = await SemesterRegistration.findById(id);

    if (!requestedSemester) {
        throw new AppError(StatusCodes.NOT_FOUND, "This semester is not found!")
    }

    if (requestedSemester?.status === RegistrationStatus.ENDED) {
        throw new AppError(StatusCodes.BAD_REQUEST, `This semester is already ${requestedSemester.status}!`)
    };


    if (requestedSemester?.status === RegistrationStatus.UPCOMING && payload?.status !== RegistrationStatus.ONGOING) {
        throw new AppError(StatusCodes.BAD_REQUEST, `You can't directly update status from UPCOMING to ENDED`)
    };

    if (requestedSemester?.status === RegistrationStatus.ONGOING && payload?.status !== RegistrationStatus.ENDED) {
        throw new AppError(StatusCodes.BAD_REQUEST, `You can't directly update status from ONGOING to UPCOMING`)
    };


    const result = await SemesterRegistration.findByIdAndUpdate(id, payload, { new: true, runValidators: true })
    return result;
};


const deleteSemesterRegistration = async (id: string) => {

    const requestedSemester = await SemesterRegistration.findById(id);

    if (!requestedSemester) {
        throw new AppError(StatusCodes.NOT_FOUND, "This semester is not found!")
    }

    if (requestedSemester?.status !== RegistrationStatus.UPCOMING) {
        throw new AppError(StatusCodes.BAD_REQUEST, `You can not delete this offered course as it is ${requestedSemester?.status}`)
    };


    const session = await mongoose.startSession();


    try {
        session.startTransaction();


        const deletedOfferedCourse = await OfferedCourse.deleteMany({ semesterRegistration: id }, { session });

        if (!deletedOfferedCourse) {
            throw new AppError(
                StatusCodes.BAD_REQUEST,
                'Failed to delete offered courses!',
            );
        }


        const deletedSemesterRegistration = await SemesterRegistration.findByIdAndDelete(id, { session, new: true });

        if (!deletedSemesterRegistration) {
            throw new AppError(
                StatusCodes.BAD_REQUEST,
                'Failed to delete semester registration!',
            );
        }


        await session.commitTransaction();
        await session.endSession();

        return null;

    } catch (error: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error(error);
    }




    const result = await SemesterRegistration.findByIdAndDelete(id);
    return result;
};


export const SemesterRegistrationServices = {
    createSemesterRegistration,
    getAllSemesterRegistrations,
    getSingleSemesterRegistration,
    updateSemesterRegistration,
    deleteSemesterRegistration
}