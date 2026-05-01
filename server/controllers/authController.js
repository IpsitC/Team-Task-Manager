import User from '../models/User.js';
import { ApiError, asyncHandler } from '../utils/apiError.js';
import generateToken from '../utils/generateToken.js';

const serializeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  designation: user.designation,
  isWorkspaceOwner: user.email === (process.env.WORKSPACE_OWNER_EMAIL || 'rajesh.kumar@taskflow.demo').toLowerCase(),
  createdAt: user.createdAt
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError('Email is already registered', 409);
  }

  const user = await User.create({ name, email, password });

  res.status(201).json({
    success: true,
    token: generateToken(user._id),
    user: serializeUser(user)
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError('Invalid email or password', 401);
  }

  res.json({
    success: true,
    token: generateToken(user._id),
    user: serializeUser(user)
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    user: serializeUser(req.user)
  });
});
