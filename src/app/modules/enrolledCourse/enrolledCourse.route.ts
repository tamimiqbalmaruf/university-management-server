import express from 'express';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { EnrolledCourseControllers } from './enrolledCourse.controller';
import { EnrolledCourseValidations } from './enrolledCourse.validation';

const router = express.Router();

router.post(
  '/create-enrolled-course',
  auth('student'),
  validateRequest(
    EnrolledCourseValidations.createEnrolledCourseValidationZodSchema,
  ),
  EnrolledCourseControllers.createEnrolledCourse,
);

// router.patch(
//   '/update-enrolled-course-marks',
//   auth('faculty'),
//   validateRequest(
//     EnrolledCourseValidations.updateEnrolledCourseMarksValidationZodSchema,
//   ),
//   EnrolledCourseControllers.updateEnrolledCourseMarks,
// );

export const EnrolledCourseRoutes = router;