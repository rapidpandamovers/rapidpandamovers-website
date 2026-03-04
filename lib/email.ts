import nodemailer from 'nodemailer';
import { render } from '@react-email/components';
import QuoteRequestEmail from '@/emails/QuoteRequestEmail';
import ReservationRequestEmail from '@/emails/ReservationRequestEmail';
import ClaimsRequestEmail from '@/emails/ClaimsRequestEmail';
import ContactFormEmail from '@/emails/ContactFormEmail';
import NewsletterSignupEmail from '@/emails/NewsletterSignupEmail';

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

interface EmailOptions {
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail({ subject, html, replyTo }: EmailOptions) {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: process.env.CONTACT_EMAIL,
    subject,
    html,
    replyTo,
  };

  return transporter.sendMail(mailOptions);
}

// Typed email sending functions using react-email templates

export async function sendQuoteNotification(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  movingFrom: string;
  movingTo: string;
  moveDate?: string;
  homeSize?: string;
  services?: string[];
  details?: string;
}) {
  const html = await render(QuoteRequestEmail(data));
  await sendEmail({
    subject: `New Quote Request from ${data.firstName} ${data.lastName}`,
    html,
    replyTo: data.email,
  });
}

export async function sendReservationNotification(data: {
  name: string;
  email: string;
  phone: string;
  reference?: string;
  pickupAddress: string;
  pickupApt?: string;
  pickupCity: string;
  pickupState: string;
  pickupZip: string;
  pickupStorage?: boolean;
  dropoffAddress: string;
  dropoffApt?: string;
  dropoffCity: string;
  dropoffState: string;
  dropoffZip: string;
  dropoffStorage?: boolean;
  moveDate: string;
  moveTime: string;
  moveSize: string;
  packing: string;
  additionalServices?: string[];
  specialItems?: string;
  hearAbout?: string;
}) {
  const html = await render(ReservationRequestEmail(data));
  await sendEmail({
    subject: `New Reservation: ${data.name} on ${data.moveDate}`,
    html,
    replyTo: data.email,
  });
}

export async function sendClaimsNotification(data: {
  name: string;
  email: string;
  phone: string;
  reference?: string;
  description: string;
}) {
  const html = await render(ClaimsRequestEmail(data));
  await sendEmail({
    subject: `New Claim: ${data.name}`,
    html,
    replyTo: data.email,
  });
}

export async function sendContactNotification(data: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}) {
  const html = await render(ContactFormEmail(data));
  await sendEmail({
    subject: `Contact Form: ${data.name}`,
    html,
    replyTo: data.email,
  });
}

export async function sendNewsletterNotification(data: { email: string }) {
  const html = await render(NewsletterSignupEmail(data));
  await sendEmail({
    subject: 'New Newsletter Subscription',
    html,
  });
}
