import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const uploadContentSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  subject: z.string().min(1, 'Subject is required'),
  description: z.string().optional(),
  file: z
    .instanceof(File)
    .refine((file) => ['image/jpeg', 'image/png', 'image/gif'].includes(file.type), {
      message: 'File must be JPG, PNG, or GIF',
    })
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: 'File size must be less than 10MB',
    }),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  rotationDuration: z.number().optional(),
}).refine((data) => new Date(data.endTime) > new Date(data.startTime), {
  message: 'End time must be after start time',
  path: ['endTime'],
});

export const rejectionSchema = z.object({
  reason: z.string().min(5, 'Rejection reason must be at least 5 characters'),
});