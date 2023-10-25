import { Router } from "express";
import { createRole, deleteRole, getRoleForId, getRoles, updateRole } from "../controllers/role.controller.js";

const router = Router();


router.get('/role', getRoles);

router.get('/role/:id', getRoleForId);

router.post('/role', createRole); 

 router.delete('/role/:id', deleteRole);  

router.put('/role/:id', updateRole); 

export default router;