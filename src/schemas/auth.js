//Validaciónes

import { z } from 'zod';
//Validacion de registro.
export const registerSchema = z.object({
    name: z.string({
        required_error: 'Name is required'
    }),
    last_name: z.string({
        required_error: 'Username is required'
    }),
    email: z.string({
        required_error: 'Username is required'
    }).email({
        message: 'Email is not valid'
    }),
    password: z.string({
        required_error: 'Password is required'
    }).min(6, {
        message: 'password must be at least 6 characters long.'
    })
});
//Validacion de login.
export const loginSchema = z.object({
    email: z.string({
        required_error: 'Email is required',
    }).email({
        message: 'Email is not valid'
    }),
    password: z.string({
        required_error: 'Password is required'
    }).min(6, {
        message: 'must have a minimum of six characteres'
    })
});