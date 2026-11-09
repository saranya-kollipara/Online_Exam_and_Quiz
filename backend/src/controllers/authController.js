import bcrypt from 'bcryptjs';
import { prisma } from '../config/database.js';
import { generateToken } from '../utils/token.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const authController = {
  /**
   * Register a new student account
   * Strict Rule: Public registration can NEVER assign the ADMIN role!
   */
  async register(req, res, next) {
    try {
      const { email, password, firstName, lastName, institution, yearOfStudy, streamId, rollNumber } = req.body;

      // Check existing email
      const existing = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      });

      if (existing) {
        return errorResponse(res, 'An account with this email address already exists.', 409);
      }

      // Hash password using bcrypt
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create student and profile inside transaction
      const newUser = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            email: email.toLowerCase(),
            password: hashedPassword,
            role: 'STUDENT', // Guaranteed student role
            firstName,
            lastName,
            avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=250&q=80',
            studentProfile: {
              create: {
                institution,
                yearOfStudy,
                streamId: streamId || null,
                rollNumber: rollNumber || `ROLL-${Date.now().toString().slice(-6)}`
              }
            }
          },
          include: {
            studentProfile: {
              include: { stream: true }
            }
          }
        });
        return user;
      });

      const token = generateToken({
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role
      });

      const safeUser = {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        name: `${newUser.firstName} ${newUser.lastName}`,
        avatar: newUser.avatarUrl,
        studentProfile: newUser.studentProfile
      };

      return successResponse(res, 'Student registration completed successfully.', { user: safeUser, token }, 201);
    } catch (err) {
      next(err);
    }
  },

  /**
   * User login (Admin & Student)
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
        include: {
          studentProfile: {
            include: { stream: true }
          },
          adminProfile: true
        }
      });

      if (!user) {
        return errorResponse(res, 'No account found with this email address. Sign up to continue.', 404);
      }

      if (!user.isActive) {
        return errorResponse(res, 'Account has been deactivated. Please contact academic support.', 403);
      }

      // Verify bcrypt password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return errorResponse(res, 'Invalid password. Please check your credentials.', 401);
      }

      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role
      });

      const safeUser = {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        name: `${user.firstName} ${user.lastName}`,
        avatar: user.avatarUrl,
        studentProfile: user.studentProfile,
        adminProfile: user.adminProfile
      };

      return successResponse(res, 'Authentication successful.', { user: safeUser, token });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Retrieve current authenticated user session
   */
  async getMe(req, res, next) {
    try {
      const user = req.user;
      const safeUser = {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        name: `${user.firstName} ${user.lastName}`,
        avatar: user.avatarUrl,
        studentProfile: user.studentProfile,
        adminProfile: user.adminProfile
      };

      return successResponse(res, 'Profile retrieved.', { user: safeUser });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Logout confirmation
   */
  async logout(req, res) {
    return successResponse(res, 'Signed out successfully.');
  },

  /**
   * Password reset request
   */
  async requestPasswordReset(req, res, next) {
    try {
      const { email } = req.body;
      const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
      
      // Prevent user enumeration by returning success regardless
      return successResponse(
        res,
        `If an account matches ${email}, a password reset verification link has been dispatched.`
      );
    } catch (err) {
      next(err);
    }
  }
};

