

import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { SemesterRegistrationValidations } from './semesterRegistration.validation';
import { SemesterRegistrationControllers } from './semesterRegistration.controller';
import auth from '../../middleware/auth';

const router = express.Router();

router.post('/create-semester-registration', auth('superAdmin', 'admin'), validateRequest(SemesterRegistrationValidations.createSemesterRegistrationValidationSchema), SemesterRegistrationControllers.createSemesterRegistration);

router.get('/:id', auth('superAdmin', 'admin', 'faculty', 'student'), SemesterRegistrationControllers.getSingleSemesterRegistration);

router.patch('/:id', auth('superAdmin', 'admin'), validateRequest(SemesterRegistrationValidations.updateSemesterRegistrationValidationSchema), SemesterRegistrationControllers.updateSemesterRegistration);

router.get('/', auth('superAdmin', 'admin', 'faculty', 'student'), SemesterRegistrationControllers.getAllSemesterRegistrations);

router.delete('/:id', auth('superAdmin', 'admin'), SemesterRegistrationControllers.deleteSemesterRegistration);

export const SemesterRegistrationRoutes = router;