import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  email: z.string().trim().email('Invalid email address').max(320),
  phone: z.string().trim().max(30).optional(),
  message: z.string().trim().min(1, 'Message is required').max(5000),
  turnstileToken: z.string().min(1, 'CAPTCHA verification is required'),
});

export const quoteSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(100),
  lastName: z.string().trim().min(1, 'Last name is required').max(100),
  email: z.string().trim().email('Invalid email address').max(320),
  phone: z.string().trim().min(1, 'Phone is required').max(30),
  movingFrom: z.string().trim().min(1, 'Moving from is required').max(500),
  movingTo: z.string().trim().min(1, 'Moving to is required').max(500),
  moveDate: z.string().trim().max(20).optional(),
  homeSize: z.string().trim().max(100).optional(),
  services: z.array(z.string().max(200)).max(20).optional(),
  details: z.string().trim().max(5000).optional(),
  turnstileToken: z.string().min(1, 'CAPTCHA verification is required'),
});

export const reservationSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  email: z.string().trim().email('Invalid email address').max(320),
  phone: z.string().trim().min(1, 'Phone is required').max(30),
  reference: z.string().trim().max(100).optional(),
  pickupAddress: z.string().trim().min(1, 'Pickup address is required').max(500),
  pickupApt: z.string().trim().max(50).optional(),
  pickupCity: z.string().trim().min(1, 'Pickup city is required').max(200),
  pickupState: z.string().trim().min(1, 'Pickup state is required').max(50),
  pickupZip: z.string().trim().min(1, 'Pickup zip is required').max(20),
  pickupStorage: z.boolean().optional(),
  dropoffAddress: z.string().trim().min(1, 'Dropoff address is required').max(500),
  dropoffApt: z.string().trim().max(50).optional(),
  dropoffCity: z.string().trim().min(1, 'Dropoff city is required').max(200),
  dropoffState: z.string().trim().min(1, 'Dropoff state is required').max(50),
  dropoffZip: z.string().trim().min(1, 'Dropoff zip is required').max(20),
  dropoffStorage: z.boolean().optional(),
  moveDate: z.string().trim().min(1, 'Move date is required').max(20),
  moveTime: z.string().trim().min(1, 'Move time is required').max(50),
  moveSize: z.string().trim().min(1, 'Move size is required').max(100),
  packing: z.string().trim().min(1, 'Packing selection is required').max(100),
  additionalServices: z.array(z.string().max(200)).max(20).optional(),
  specialItems: z.string().trim().max(5000).optional(),
  hearAbout: z.string().trim().max(200).optional(),
  turnstileToken: z.string().min(1, 'CAPTCHA verification is required'),
});

export const newsletterSchema = z.object({
  email: z.string().trim().email('Invalid email address').max(320),
  turnstileToken: z.string().min(1, 'CAPTCHA verification is required'),
});

export type ContactData = z.infer<typeof contactSchema>;
export type QuoteData = z.infer<typeof quoteSchema>;
export type ReservationData = z.infer<typeof reservationSchema>;
export type NewsletterData = z.infer<typeof newsletterSchema>;
