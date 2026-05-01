import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const router = express.Router();

const generateTokens = (id: string, role: string) => {
  const accessToken = jwt.sign({ id, role }, process.env.JWT_ACCESS_SECRET || 'secret', { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id, role }, process.env.JWT_REFRESH_SECRET || 'refresh_secret', { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

// @route   POST /api/v1/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, role, grade } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, data: null, error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      passwordHash,
      role,
      grade: role === 'student' ? grade : undefined
    });

    const tokens = generateTokens((user._id as unknown as string), user.role);

    res.status(201).json({
      success: true,
      data: {
        user: { id: user._id, name: user.name, email: user.email, role: user.role, grade: user.grade },
        ...tokens
      },
      error: null
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/v1/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, data: null, error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, data: null, error: 'Invalid credentials' });
    }

    const tokens = generateTokens((user._id as unknown as string), user.role);

    res.status(200).json({
      success: true,
      data: {
        user: { id: user._id, name: user.name, email: user.email, role: user.role, grade: user.grade },
        ...tokens
      },
      error: null
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/v1/auth/refresh
router.post('/refresh', (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ success: false, data: null, error: 'No refresh token provided' });
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refresh_secret', (err: any, decoded: any) => {
      if (err) {
        return res.status(403).json({ success: false, data: null, error: 'Invalid refresh token' });
      }

      const tokens = generateTokens(decoded.id, decoded.role);
      res.status(200).json({ success: true, data: tokens, error: null });
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/v1/auth/logout
router.post('/logout', (req, res) => {
  // Client should delete the refresh token
  res.status(200).json({ success: true, data: null, error: null });
});

export default router;
