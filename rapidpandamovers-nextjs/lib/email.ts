import nodemailer from 'nodemailer';

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

// Email templates
export function formatQuoteEmail(data: {
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
  return `
    <h2>New Quote Request</h2>
    <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Name</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.firstName} ${data.lastName}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email</td>
        <td style="padding: 8px; border: 1px solid #ddd;"><a href="mailto:${data.email}">${data.email}</a></td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Phone</td>
        <td style="padding: 8px; border: 1px solid #ddd;"><a href="tel:${data.phone}">${data.phone}</a></td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Moving From</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.movingFrom}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Moving To</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.movingTo}</td>
      </tr>
      ${data.moveDate ? `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Move Date</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.moveDate}</td>
      </tr>
      ` : ''}
      ${data.homeSize ? `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Home Size</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.homeSize}</td>
      </tr>
      ` : ''}
      ${data.services && data.services.length > 0 ? `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Services</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.services.join(', ')}</td>
      </tr>
      ` : ''}
      ${data.details ? `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Additional Details</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.details}</td>
      </tr>
      ` : ''}
    </table>
  `;
}

export function formatReservationEmail(data: {
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
  const pickupFull = `${data.pickupAddress}${data.pickupApt ? ` ${data.pickupApt}` : ''}, ${data.pickupCity}, ${data.pickupState} ${data.pickupZip}`;
  const dropoffFull = `${data.dropoffAddress}${data.dropoffApt ? ` ${data.dropoffApt}` : ''}, ${data.dropoffCity}, ${data.dropoffState} ${data.dropoffZip}`;

  return `
    <h2>New Reservation Request</h2>

    <h3>Contact Information</h3>
    <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Name</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.name}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email</td>
        <td style="padding: 8px; border: 1px solid #ddd;"><a href="mailto:${data.email}">${data.email}</a></td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Phone</td>
        <td style="padding: 8px; border: 1px solid #ddd;"><a href="tel:${data.phone}">${data.phone}</a></td>
      </tr>
      ${data.reference ? `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Reference #</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.reference}</td>
      </tr>
      ` : ''}
    </table>

    <h3>Moving Details</h3>
    <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Pick-up Address</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${pickupFull}${data.pickupStorage ? ' (Storage Facility)' : ''}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Drop-off Address</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${dropoffFull}${data.dropoffStorage ? ' (Storage Facility)' : ''}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Move Date</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.moveDate}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Preferred Time</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.moveTime}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Move Size</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.moveSize}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Packing Service</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.packing}</td>
      </tr>
      ${data.additionalServices && data.additionalServices.length > 0 ? `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Additional Services</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.additionalServices.join(', ')}</td>
      </tr>
      ` : ''}
      ${data.specialItems ? `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Special Items/Notes</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.specialItems}</td>
      </tr>
      ` : ''}
      ${data.hearAbout ? `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">How They Found Us</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.hearAbout}</td>
      </tr>
      ` : ''}
    </table>
  `;
}

export function formatNewsletterEmail(data: { email: string }) {
  return `
    <h2>New Newsletter Subscription</h2>
    <p>A new user has subscribed to the newsletter:</p>
    <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
  `;
}

export function formatContactEmail(data: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}) {
  return `
    <h2>New Contact Form Submission</h2>
    <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Name</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.name}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email</td>
        <td style="padding: 8px; border: 1px solid #ddd;"><a href="mailto:${data.email}">${data.email}</a></td>
      </tr>
      ${data.phone ? `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Phone</td>
        <td style="padding: 8px; border: 1px solid #ddd;"><a href="tel:${data.phone}">${data.phone}</a></td>
      </tr>
      ` : ''}
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Message</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.message.replace(/\n/g, '<br>')}</td>
      </tr>
    </table>
  `;
}
