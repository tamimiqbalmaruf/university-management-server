import { TAcademicFaculty } from "./academicFaculty.interface";
import { AcademicFaculty } from "./academicFaculty.model";





const createAcademicFaculty = async (payload: TAcademicFaculty) => {
    const result = await AcademicFaculty.create(payload);
    return result;
};









const getAllAcademicFaculties = async () => {
    const result = await AcademicFaculty.find();
    return result;
};

const getSingleAcademicFaculty = async (id: string) => {
    const result = await AcademicFaculty.findById(id)
    return result;
};

const updateAcademicFaculty = async (id: string, payload: Partial<TAcademicFaculty>) => {



    const result = await AcademicFaculty.findByIdAndUpdate(id, payload)
    return result;
};


export const AcademicFacultyServices = {
    createAcademicFaculty,
    getAllAcademicFaculties,
    getSingleAcademicFaculty,
    updateAcademicFaculty
}