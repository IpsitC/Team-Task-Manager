import express from 'express';
import { body, param } from 'express-validator';
import {
  addMember,
  createProject,
  deleteProject,
  getAvailableMembers,
  getDiscoverProjects,
  getMyProjects,
  getProjectById,
  joinProject,
  leaveProject,
  removeMember
} from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/errorMiddleware.js';
import { requireProjectAdmin, requireProjectAdminOrWorkspaceOwner } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);

router.post(
  '/',
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Project name must be at least 2 characters'),
    body('description').optional({ checkFalsy: true }).trim().isLength({ max: 600 })
  ],
  validate,
  createProject
);
router.get('/', getMyProjects);
router.get('/discover/all', getDiscoverProjects);
router.put(
  '/:id/join',
  [param('id').isMongoId().withMessage('Valid project id is required')],
  validate,
  joinProject
);
router.put(
  '/:id/leave',
  [param('id').isMongoId().withMessage('Valid project id is required')],
  validate,
  leaveProject
);
router.get(
  '/:id/available-members',
  [param('id').isMongoId().withMessage('Valid project id is required')],
  validate,
  requireProjectAdmin,
  getAvailableMembers
);
router.get('/:id', [param('id').isMongoId().withMessage('Valid project id is required')], validate, getProjectById);
router.put(
  '/:id/add-member',
  [
    param('id').isMongoId().withMessage('Valid project id is required'),
    body('email').isEmail().withMessage('Valid member email is required').normalizeEmail()
  ],
  validate,
  requireProjectAdmin,
  addMember
);
router.delete(
  '/:id/remove-member',
  [
    param('id').isMongoId().withMessage('Valid project id is required'),
    body('userId').isMongoId().withMessage('Valid user id is required')
  ],
  validate,
  requireProjectAdmin,
  removeMember
);
router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Valid project id is required')],
  validate,
  requireProjectAdminOrWorkspaceOwner,
  deleteProject
);

export default router;
