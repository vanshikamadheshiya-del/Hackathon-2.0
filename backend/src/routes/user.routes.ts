import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { isAuthenticated } from '../middlewares/auth.middleware';

const router = Router();

// Helper to wrap async route handlers and forward errors
const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

router.use(isAuthenticated);

router.post('/', asyncHandler(userController.create));
router.get('/', asyncHandler(userController.getAll));
router.get('/:id', asyncHandler(userController.getOne));
router.put('/:id', asyncHandler(userController.update));
router.delete('/:id', asyncHandler(userController.remove));

export default router; 