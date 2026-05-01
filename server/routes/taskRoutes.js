import express from 'express';
import { body, param, query } from 'express-validator';
import { createTask, deleteTask, getMyTasks, getTasksByProject, updateTask } from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/errorMiddleware.js';
import { requireProjectAdmin, requireProjectMember } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);

router.post(
  '/',
  [
    body('projectId').isMongoId().withMessage('Valid project id is required'),
    body('title').trim().isLength({ min: 2 }).withMessage('Task title must be at least 2 characters'),
    body('description').optional({ checkFalsy: true }).trim().isLength({ max: 1200 }).withMessage('Description must be 1200 characters or less'),
    body('assignedTo').optional({ checkFalsy: true }).isMongoId().withMessage('Assigned user is invalid'),
    body('assignees').optional().isArray({ min: 1 }).withMessage('At least one assignee is required'),
    body('assignees.*').optional().isMongoId().withMessage('Assignee is invalid'),
    body().custom((value) => {
      if (value.assignedTo || value.assignees?.length) return true;
      throw new Error('At least one assignee is required');
    }),
    body('dueDate').isISO8601().withMessage('Valid due date is required'),
    body('priority').isIn(['Low', 'Medium', 'High']).withMessage('Priority is invalid'),
    body('status').optional().isIn(['To Do', 'In Progress', 'Done']).withMessage('Status is invalid')
  ],
  validate,
  requireProjectAdmin,
  createTask
);
router.get('/mine', getMyTasks);
router.get(
  '/project/:projectId',
  [
    param('projectId').isMongoId().withMessage('Valid project id is required'),
    query('priority').optional().isIn(['All', 'Low', 'Medium', 'High']),
    query('status').optional().isIn(['All', 'To Do', 'In Progress', 'Done']),
    query('assignee').optional().custom((value) => value === 'All' || /^[0-9a-fA-F]{24}$/.test(value)),
    query('search').optional().trim().escape()
  ],
  validate,
  requireProjectMember,
  getTasksByProject
);
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Valid task id is required'),
    body('title').optional().trim().isLength({ min: 2 }).withMessage('Task title must be at least 2 characters'),
    body('description').optional({ checkFalsy: true }).trim().isLength({ max: 1200 }).withMessage('Description must be 1200 characters or less'),
    body('assignedTo').optional({ checkFalsy: true }).isMongoId().withMessage('Assigned user is invalid'),
    body('assignees').optional().isArray().withMessage('Assignees must be a list'),
    body('assignees.*').optional().isMongoId().withMessage('Assignee is invalid'),
    body('dueDate').optional().isISO8601().withMessage('Valid due date is required'),
    body('priority').optional().isIn(['Low', 'Medium', 'High']).withMessage('Priority is invalid'),
    body('status').optional().isIn(['To Do', 'In Progress', 'Done']).withMessage('Status is invalid')
  ],
  validate,
  updateTask
);
router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Valid task id is required')],
  validate,
  deleteTask
);

export default router;
