import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { studentValidations } from '../student/student.validation';
import { UserControllers } from './user.controller';

const router = express.Router();

router.post('/create-user', validateRequest(studentValidations.createStudentValidationSchema), UserControllers.createStudent);

export const UserRoutes = router;
