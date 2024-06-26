import { z } from 'zod';

export const usernameValidation = z
  .string()
  .min(3, 'Username must be of atleast 3 characters')
  .max(20, 'Username must be of no more than 20 characters')

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: 'Invaild Email' }),
  password: z
    .string()
    .min(6, { message: 'Password must be atleast 6 characters' }),
});
