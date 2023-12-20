    import {Router} from 'express'
    import { login, logout, register, updateProfile, verifyToken } from '../controllers/auth.controller.js';
    import { loginSchema, registerSchema } from '../schemas/auth.js';
    import { validateSchema } from '../middlewares/validator.middlware.js';
    import { authRequired } from '../middlewares/validateToken.js';
    const router = Router ();

    router.post('/register', validateSchema(registerSchema), register);
    router.post('/login', validateSchema(loginSchema), login);
    router.post('/logout', authRequired, logout); 
    router.get('/verify',verifyToken);
    router.put('/update-profile/:userId', authRequired, updateProfile);


    export default router;