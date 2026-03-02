import { Text } from '@react-email/components';
import * as React from 'react';
import EmailLayout from './components/EmailLayout';
import EmailField from './components/EmailField';

interface ContactFormEmailProps {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export default function ContactFormEmail(props: ContactFormEmailProps) {
  return (
    <EmailLayout preview={`Contact Form: ${props.name}`}>
      <Text style={heading}>New Contact Form Submission</Text>
      <table style={table}>
        <tbody>
          <EmailField label="Name" value={props.name} />
          <EmailField label="Email" value={props.email} />
          <EmailField label="Phone" value={props.phone} />
        </tbody>
      </table>
      <Text style={messageLabel}>Message</Text>
      <Text style={messageBody}>{props.message}</Text>
    </EmailLayout>
  );
}

const heading: React.CSSProperties = {
  fontSize: '22px',
  fontWeight: 700,
  color: '#1f2937',
  marginBottom: '16px',
};

const table: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse' as const,
};

const messageLabel: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 600,
  color: '#374151',
  marginTop: '20px',
  marginBottom: '4px',
};

const messageBody: React.CSSProperties = {
  fontSize: '14px',
  color: '#1f2937',
  backgroundColor: '#f9fafb',
  padding: '16px',
  borderRadius: '8px',
  lineHeight: '22px',
  whiteSpace: 'pre-wrap',
};
