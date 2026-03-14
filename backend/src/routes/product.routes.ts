import { Router } from 'express';
import * as productController from '../controllers/product.controller';
import { isAuthenticated } from '../middlewares/auth.middleware';
import { uploadProductImage } from '../middlewares/upload.middleware';

const router = Router();
const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// All product APIs require only authentication now (no role/permission system)
router.use(isAuthenticated);

router.post('/', uploadProductImage, asyncHandler(productController.createProduct));
router.get('/', asyncHandler(productController.getProducts));
router.get('/:id', asyncHandler(productController.getProductById));
router.put('/:id', uploadProductImage, asyncHandler(productController.updateProduct));
router.delete('/:id', asyncHandler(productController.deleteProduct));

export default router;
