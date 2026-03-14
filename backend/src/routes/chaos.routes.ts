import { Router } from 'express';
import * as chaosController from '../controllers/chaos.controller';

const router = Router();

// Helper to wrap async route handlers
const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Chaos endpoints (No auth required for these specifically to make load testing easier)
router.get('/delay', asyncHandler(chaosController.delay));
router.get('/error', asyncHandler(chaosController.randomError));
router.get('/heavy', asyncHandler(chaosController.heavyQuery));
router.get('/payload', asyncHandler(chaosController.largePayload));

export default router;
