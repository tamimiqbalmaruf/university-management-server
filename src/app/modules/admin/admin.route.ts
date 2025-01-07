import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { AdminControllers } from './admin.controller';
import { updateAdminValidationSchema } from './admin.validation';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.get('/', auth(USER_ROLE.superAdmin, USER_ROLE.admin), AdminControllers.getAllAdmins);

router.get('/:id', auth(USER_ROLE.superAdmin, USER_ROLE.admin), AdminControllers.getSingleAdmin);

router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(updateAdminValidationSchema),
  AdminControllers.updateAdmin,
);

router.delete('/:id', auth(USER_ROLE.superAdmin, USER_ROLE.admin), AdminControllers.deleteAdmin);

export const AdminRoutes = router;