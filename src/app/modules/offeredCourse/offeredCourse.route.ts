import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { OfferedCourseControllers } from './offeredCourse.controller';
import { OfferedCourseValidations } from './offeredCourse.validation';
import auth from '../../middleware/auth';

const router = express.Router();

router.get('/', 
  auth('superAdmin', 'admin', 'faculty'),
  OfferedCourseControllers.getAllOfferedCourses);

router.get('/my-offered-courses', 
  auth('student'),
  OfferedCourseControllers.getMyOfferedCourses);

router.get('/:id',
  auth('superAdmin', 'admin', 'faculty', 'student'),
  OfferedCourseControllers.getSingleOfferedCourse);

router.post(
  '/create-offered-course',
  auth('superAdmin', 'admin'),
  validateRequest(OfferedCourseValidations.createOfferedCourseValidationSchema),
  OfferedCourseControllers.createOfferedCourse,
);

router.patch(
  '/:id',
  auth('superAdmin', 'admin'),
  validateRequest(OfferedCourseValidations.updateOfferedCourseValidationSchema),
  OfferedCourseControllers.updateOfferedCourse,
);

router.delete(
  '/:id',
  auth('superAdmin', 'admin'),
  OfferedCourseControllers.deleteOfferedCourse,
);

export const OfferedCourseRoutes = router;
