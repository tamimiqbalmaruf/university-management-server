import { StatusCodes } from "http-status-codes";
import { academicSemesterNameCodeMapper, AcademicSemesterSearchableFields } from "./academicSemester.constant";
import { TAcademicSemester } from "./academicSemester.interface";
import { AcademicSemester } from "./academicSemester.model";
import AppError from "../../errors/AppError";
import QueryBuilder from "../../builder/QueryBuilder";


const createAcademicSemester = async (payload: TAcademicSemester) => {

    if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
        throw new AppError(StatusCodes.BAD_REQUEST,"Invalid Semester Code")
    }


    const result = await AcademicSemester.create(payload);
    return result;
};

const getAllAcademicSemester = async (
    query: Record<string, unknown>,
  ) => {
    const academicSemesterQuery = new QueryBuilder(AcademicSemester.find(), query)
      .search(AcademicSemesterSearchableFields)
      .filter()
      .sort()
      .paginate()
      .fields();
  
    const result = await academicSemesterQuery.modelQuery;
    const meta = await academicSemesterQuery.countTotal();
  
    return {
      meta,
      result,
    };
  };

const getSingleAcademicSemester = async (id: string) => {
    const result = await AcademicSemester.findById(id)
    return result;
};

const updateAcademicSemester = async (id: string, payload: Partial<TAcademicSemester>) => {

    if (payload.name && payload.code && academicSemesterNameCodeMapper[payload.name] !== payload.code) {
        throw new AppError(StatusCodes.BAD_REQUEST,"Invalid Semester Code");
    };

    

    const result = await AcademicSemester.findByIdAndUpdate(id, payload)
    return result;
};


export const AcademicSemesterServices = {
    createAcademicSemester,
    getAllAcademicSemester,
    getSingleAcademicSemester,
    updateAcademicSemester
}