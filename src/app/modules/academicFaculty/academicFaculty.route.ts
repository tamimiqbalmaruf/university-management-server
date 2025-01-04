import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { AcademicFacultyValidations } from './academicFaculty.validation';
import { AcademicFacultyControllers } from './academicFaculty.controller';
import auth from '../../middleware/auth';



const router = express.Router();

router.post('/create-academic-faculty',
    auth('superAdmin', 'admin'),
    validateRequest(AcademicFacultyValidations.createAcademicFacultyValidationSchema), AcademicFacultyControllers.createAcademicFaculty);

router.get('/:id', AcademicFacultyControllers.getSingleAcademicFaculty);

router.patch('/:id', validateRequest(AcademicFacultyValidations.updateAcademicFacultyValidationSchema), AcademicFacultyControllers.updateAcademicFaculty);

router.get('/', AcademicFacultyControllers.getAllAcademicFaculties);

export const AcademicFacultyRoutes = router;