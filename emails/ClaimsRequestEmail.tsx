import { Text } from '@react-email/components';
import * as React from 'react';
import EmailLayout from './components/EmailLayout';
import EmailField, { EmailSectionTitle } from './components/EmailField';

interface ClaimsRequestEmailProps {
  name: string;
  email: string;
  phone: string;
  reference?: string;
  description: string;
}

export default function ClaimsRequestEmail(props: ClaimsRequestEmailProps) {
  return (
    <EmailLayout preview={`New Claim: ${props.name}`}>
      <Text style={heading}>New Claim Submitted</Text>

      <EmailSectionTitle>Contact Information</EmailSectionTitle>
      <table style={table}>
        <tbody>
          <EmailField label="Name" value={props.name} />
          <EmailField label="Email" value={props.email} />
          <EmailField label="Phone" value={props.phone} />
          <EmailField label="Reference #" value={props.reference} />
        </tbody>
      </table>

      <EmailSectionTitle>Claim Details</EmailSectionTitle>
      <table style={table}>
        <tbody>
          <EmailField label="Description" value={props.description} />
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
