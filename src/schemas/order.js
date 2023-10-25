import { z } from "zod";

const orderSchema = z.object({
  
  product_data: z.array(
    z.object({
      idProducto: z.number().int().positive().refine(value => value > 0, {
        message: "idProducto must be a positive integer",
      }),
      quantity: z.number().int().positive().refine(value => value > 0, {
        message: "quantity must be a positive integer",
      }),
    })
  ),
});

export { orderSchema };

