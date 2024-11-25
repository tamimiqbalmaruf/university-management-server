

import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { AcademicSemesterValidations } from './academicSemester.validation';
import { AcademicSemesterControllers } from './academicSemester.controller';


const router = express.Router();

router.post('/create-academic-semester', validateRequest(AcademicSemesterValidations.createAcademicSemesterValidationSchema), AcademicSemesterControllers.createAcademicSemester);

router.get('/:semesterId', AcademicSemesterControllers.getSingleAcademicSemester);

router.patch('/:semesterId', validateRequest(AcademicSemesterValidations.updateAcademicSemesterValidationSchema), AcademicSemesterControllers.updateAcademicSemester);

router.get('/', AcademicSemesterControllers.getAllAcademicSemester);

export const AcademicSemesterRoutes = router;