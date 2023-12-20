import { Router } from "express";
import { categorySchema } from "../schemas/categories.schema.js";
import { createCategory, deleteCategory, getAllCategories, getCategoryById, getProductsByCategory, updateCategory } from "../controllers/categories.controller.js";
import { validateSchema } from "../middlewares/validator.middlware.js";
import { Product } from "../models/products.js";


const router = Router();    

router.get('/categories', getAllCategories);

router.post('/categories', validateSchema(categorySchema), createCategory);

// Obtener una categoría por ID
router.get('/categories/:id', getCategoryById);

// Actualizar una categoría por ID
router.put('/categories/:id', validateSchema(categorySchema), updateCategory);

// Eliminar una categoría por ID
router.delete('/categories/:id', deleteCategory);

router.get('/productsbycategory/:id', getProductsByCategory);
export default router;