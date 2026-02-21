import { Text } from '@react-email/components';
import * as React from 'react';
import EmailLayout from './components/EmailLayout';
import EmailField from './components/EmailField';

interface NewsletterSignupEmailProps {
  email: string;
}

export default function NewsletterSignupEmail(props: NewsletterSignupEmailProps) {
  return (
    <EmailLayout preview="New Newsletter Subscription">
      <Text style={heading}>New Newsletter Subscription</Text>
      <Text style={description}>A new user has subscribed to the newsletter:</Text>
      <table style={table}>
        <tbody>
          <EmailField label="Email" value={props.email} />
        </tbody>
      </table>
    </EmailLayout>
  );
}

const heading: React.CSSProperties = {
  fontSize: '22px',
  fontWeight: 700,
  color: '#1f2937',
  marginBottom: '8px',
};

const description: React.CSSProperties = {
  fontSize: '14px',
  color: '#6b7280',
  marginBottom: '16px',
};

const table: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse' as const,
};
