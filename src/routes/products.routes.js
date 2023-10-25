import { Router } from "express";
import { getProducts, createProduct, deleteProduct, updateProduct } from "../controllers/products.controller.js";
import { authRequired, checkUserRole } from "../middlewares/validateToken.js";
import { createProductSchema } from "../schemas/products.schema.js";
import { validateSchema } from "../middlewares/validator.middlware.js";
const router = Router();

router.get('/products', authRequired, getProducts);


router.post('/products', authRequired, checkUserRole('administrador'), validateSchema(createProductSchema), createProduct);
// Reemplazar checkUserRole('administrador') por algo similar a checkUserRole(STRING_ROL_ADMIN)
router.delete('/products/:id',authRequired, deleteProduct);

router.put('/products/:id',authRequired, updateProduct);

export default router;
