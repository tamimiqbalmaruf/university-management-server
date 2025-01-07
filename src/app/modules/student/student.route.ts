import express from 'express';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { StudentControllers } from './student.controller';
import { studentValidations } from './student.validation';

const router = express.Router();


router.get('/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
    StudentControllers.getSingleStudent);

router.patch('/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(studentValidations.updateStudentValidationSchema), StudentControllers.updateStudent);

router.delete('/:id',
     auth(USER_ROLE.superAdmin, USER_ROLE.admin),
      StudentControllers.deleteStudent);

router.get('/', auth(USER_ROLE.superAdmin, USER_ROLE.admin), StudentControllers.getAllStudents);


export const StudentRoutes = router;