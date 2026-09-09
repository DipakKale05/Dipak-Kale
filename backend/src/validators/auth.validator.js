import { z } from 'zod';
import { ROLES } from '../constants/roles.js';

export const registerSchema = z
  .object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email('Must be a valid email address')
      .max(255, 'Email cannot exceed 255 characters'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
      .regex(/[\d\W]/, 'Password must contain at least one number or special character'),
    name: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name cannot exceed 100 characters'),
    phone: z.string().trim().optional(),
    role: z.enum([ROLES.PATIENT, ROLES.PHARMACIST, ROLES.TRUST_OFFICER]).default(ROLES.PATIENT),
    dob: z.string().optional(),
    deliveryAddress: z.string().optional(),
    pharmacyName: z.string().trim().optional(),
    licenseNumber: z.string().trim().optional(),
    hipaaConsented: z.boolean().refine((val) => val === true, {
      message: 'HIPAA consent must be explicitly accepted',
    }),
  })
  .superRefine((data, ctx) => {
    if (data.role === ROLES.PHARMACIST) {
      if (!data.pharmacyName || data.pharmacyName.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Pharmacy name is required for pharmacist registration',
          path: ['pharmacyName'],
        });
      }
      if (!data.licenseNumber || data.licenseNumber.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'State pharmacist license number is required',
          path: ['licenseNumber'],
        });
      }
    }
  });

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Must be a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const otpSendSchema = z.object({
  phone: z.string().trim().min(5, 'Valid phone number is required'),
});

export const otpVerifySchema = z.object({
  phone: z.string().trim().min(5, 'Valid phone number is required'),
  code: z.string().regex(/^\d{4}$/, 'OTP code must be exactly 4 digits'),
});

export const passkeyVerifySchema = z.object({
  role: z.enum([ROLES.PATIENT, ROLES.PHARMACIST, ROLES.TRUST_OFFICER]),
  tenantSchema: z.string().optional(),
  email: z.string().email().optional(),
});
