import { Text } from '@react-email/components';
import * as React from 'react';
import EmailLayout from './components/EmailLayout';
import EmailField, { EmailSectionTitle } from './components/EmailField';

interface QuoteRequestEmailProps {
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
}

export default function QuoteRequestEmail(props: QuoteRequestEmailProps) {
  return (
    <EmailLayout preview={`New Quote Request from ${props.firstName} ${props.lastName}`}>
      <Text style={heading}>New Quote Request</Text>
      <table style={table}>
        <tbody>
          <EmailField label="Name" value={`${props.firstName} ${props.lastName}`} />
          <EmailField label="Email" value={props.email} />
          <EmailField label="Phone" value={props.phone} />
          <EmailField label="Moving From" value={props.movingFrom} />
          <EmailField label="Moving To" value={props.movingTo} />
          <EmailField label="Move Date" value={props.moveDate} />
          <EmailField label="Home Size" value={props.homeSize} />
          <EmailField label="Services" value={props.services?.join(', ')} />
          <EmailField label="Additional Details" value={props.details} />
        </tbody>
      </table>
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
