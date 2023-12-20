import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(1).max(255).refine(value => value.trim().length > 0, {
    message: "name must not be empty or contain only spaces",
  }),
});

export { categorySchema };
