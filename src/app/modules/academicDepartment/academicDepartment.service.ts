import QueryBuilder from "../../builder/QueryBuilder";
import { AcademicFaculty } from "../academicFaculty/academicFaculty.model";
import { TAcademicDepartment } from "./academicDepartment.interface";
import { AcademicDepartment } from "./academicDepartment.model";
import { AcademicDepartmentSearchableFields } from "./academicDepartmets.constant";

const createAcademicDepartment = async (payload: TAcademicDepartment) => {
    const result = await AcademicDepartment.create(payload);
    return result;
};

const getAllAcademicDepartments = async (
    query: Record<string, unknown>,
  ) => {
    const academicDepartmentQuery = new QueryBuilder(
      AcademicDepartment.find().populate('academicFaculty'),
      query,
    )
      .search(AcademicDepartmentSearchableFields)
      .filter()
      .sort()
      .paginate()
      .fields();
  
    const result = await academicDepartmentQuery.modelQuery;
    const meta = await academicDepartmentQuery.countTotal();
  
    return {
      meta,
      result,
    };
  };

const getSingleAcademicDepartment = async (id: string) => {
    const result = await AcademicDepartment.findById(id).populate({
        path: "academicFaculty",
        model: AcademicFaculty
    });
    return result;
};

const updateAcademicDepartment = async (id: string, payload: Partial<TAcademicDepartment>) => {



    const result = await AcademicDepartment.findByIdAndUpdate(id, payload)
    return result;
};


export const AcademicDepartmentServices = {
    createAcademicDepartment,
    getAllAcademicDepartments,
    getSingleAcademicDepartment,
    updateAcademicDepartment
};