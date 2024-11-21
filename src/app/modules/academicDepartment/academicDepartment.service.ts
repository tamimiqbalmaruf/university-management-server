import { AcademicFaculty } from "../academicFaculty/academicFaculty.model";
import { TAcademicDepartment } from "./academicDepartment.interface";
import { AcademicDepartment } from "./academicDepartment.model";





const createAcademicDepartment = async (payload: TAcademicDepartment) => {
    const result = await AcademicDepartment.create(payload);
    return result;
};









const getAllAcademicDepartments = async () => {
    const result = await AcademicDepartment.find().populate({
        path: "academicFaculty",
        model: AcademicFaculty
    });
    return result;
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