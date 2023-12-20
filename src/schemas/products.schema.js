import {z} from 'zod';

export const createProductSchema = z.object({
    name: z.string({
        required_error: 'Nombre is required'
    }),
    description: z.string({
        required_error: 'Description must be a string'
    }),
    price: z.number({
        required_error: 'Precio must number a string'
    }),
   urlImage: z.string({
        required_error: 'urlImagen must be a string'
    }),
})