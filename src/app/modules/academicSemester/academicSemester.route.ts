

import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { AcademicSemesterValidations } from './academicSemester.validation';
import { AcademicSemesterControllers } from './academicSemester.controller';
import auth from '../../middleware/auth';


const router = express.Router();

router.post('/create-academic-semester', auth('superAdmin', 'admin'), validateRequest(AcademicSemesterValidations.createAcademicSemesterValidationSchema), AcademicSemesterControllers.createAcademicSemester);

router.get('/:semesterId', auth('superAdmin', 'admin', 'faculty', 'student'), AcademicSemesterControllers.getSingleAcademicSemester);

router.patch('/:semesterId', auth('superAdmin', 'admin'), validateRequest(AcademicSemesterValidations.updateAcademicSemesterValidationSchema), AcademicSemesterControllers.updateAcademicSemester);

router.get('/', auth('superAdmin', 'admin', 'faculty', 'student'), AcademicSemesterControllers.getAllAcademicSemester);

export const AcademicSemesterRoutes = router;