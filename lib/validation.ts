import * as z from 'zod';

export const registerStep1Schema = z.object({
  email: z.string().email(),
  firstname: z.string().min(3),
  lastname: z.string().min(3),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
});

export const registerStep2Schema = z.object({
  email_password: z.string().min(6),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
