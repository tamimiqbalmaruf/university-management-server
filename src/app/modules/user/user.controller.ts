import { Request, Response } from "express";
import { UserValidations } from "./user.validation";
import { UserServices } from "./user.service";


const createStudent = async (req: Request, res: Response) => {
  try {
    const { student: studentData } = req.body;
    const zodParsedData = UserValidations.userValidationSchema.parse(studentData);

    const result = await UserServices.createStudentIntoDB(zodParsedData);

    res.status(200).json({
      success: true,
      message: 'Student is created successfully',
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'something went wrong',
      error: err,
    });
  }
};

const UserControllers = {
  createStudent
}