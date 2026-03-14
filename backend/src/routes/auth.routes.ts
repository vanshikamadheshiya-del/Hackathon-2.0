import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import passport from 'passport';
import { isAuthenticated } from '../middlewares/auth.middleware';
import { IUser } from '../types';
import { activeUsersGauge, loginFailureTotal, loginSuccessTotal } from '../middlewares/monitoring';

const router = Router();

// Helper to wrap async route handlers and forward errors
const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

router.post('/register', asyncHandler(authController.register));

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err: any, user: IUser, info: any) => {
      if (err) return next(err);
      if (!user) {
        loginFailureTotal.inc();
        return res.status(401).json({ message: info?.message || 'Login failed' });
      }
      req.logIn(user, (err) => {
        if (err) return next(err);
        loginSuccessTotal.inc();
        activeUsersGauge.inc();
        // Remove password before sending user data
        const userResponse = user.toObject?.() || user;
        delete userResponse.password;
        return res.status(200).json({
          message: "Login successful",
          user: userResponse,
        });
      });
    })(req, res, next);
  });

router.post('/logout', isAuthenticated, asyncHandler(authController.logout));

export default router; 