import { z } from 'zod';
import { signUpSchema } from './signUpSchema';

export const signInSchema = z.object({
  identifiers: z.string(),
  password: z.string(),
});
