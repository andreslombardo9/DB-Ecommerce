//Validaciónes

import { z } from 'zod';
//Validacion de registro.
export const registerSchema = z.object({
    name: z.string({
        required_error: 'El nombres es requerido'
    }),
    last_name: z.string({
        required_error: 'El apellido es requerido'
    }),
    email: z.string({
        required_error: 'El mail es requerido'
    }).email({
        message: 'El formato de Email es invalido'
    }),
    password: z.string({
        required_error: 'Password is required'
    }).min(6, {
        message: 'La Contraseña debe tener al menos 6 caracteres.'
    })
});
//Validacion de login.
export const loginSchema = z.object({
    email: z.string({
        required_error: 'El email es requerido',
    }).email({
        message: 'El email es invalido',
    }),
    password: z.string({
        required_error: 'La contraseña es requerida'
    }).min(6, {
        message: 'La contraseña debe tener al menos 6 caracteres'
    })
});