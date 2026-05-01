import Project from '../models/Project.js';
import { ApiError, asyncHandler } from '../utils/apiError.js';

const isWorkspaceOwner = (user) => user.email === (process.env.WORKSPACE_OWNER_EMAIL || 'rajesh.kumar@taskflow.demo').toLowerCase();

export const requireProjectMember = asyncHandler(async (req, _res, next) => {
  const projectId = req.params.projectId || req.params.id || req.body.projectId;
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError('Project not found', 404);
  }

  const membership = project.members.find((member) => member.user.equals(req.user._id));

  if (!membership) {
    throw new ApiError('You do not have access to this project', 403);
  }

  req.project = project;
  req.membership = membership;
  next();
});

export const requireProjectAdmin = asyncHandler(async (req, _res, next) => {
  const projectId = req.params.projectId || req.params.id || req.body.projectId;
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError('Project not found', 404);
  }

  const membership = project.members.find((member) => member.user.equals(req.user._id));

  if (!membership || membership.role !== 'admin') {
    throw new ApiError('Admin access required', 403);
  }

  req.project = project;
  req.membership = membership;
  next();
});

export const requireProjectAdminOrWorkspaceOwner = asyncHandler(async (req, _res, next) => {
  const projectId = req.params.projectId || req.params.id || req.body.projectId;
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError('Project not found', 404);
  }

  const membership = project.members.find((member) => member.user.equals(req.user._id));

  if (!isWorkspaceOwner(req.user) && (!membership || membership.role !== 'admin')) {
    throw new ApiError('Admin access required', 403);
  }

  req.project = project;
  req.membership = membership || { role: 'workspace-owner', user: req.user._id };
  next();
});
