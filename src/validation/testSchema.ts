import { z } from "zod";

export const testSchema = z.object({
  name: z.string({ message: "Name must be a string" }).min(2),
  age: z.number({ message: "Age must be a number" }).positive(),
});
