import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { AcademicFaculty } from '../academicFaculty/academicFaculty.model';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from './student.interface';
import { Student } from './student.model';



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
  const result = await Student.updateOne({ id }, { isDeleted: true });
  return result;
};

export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
};