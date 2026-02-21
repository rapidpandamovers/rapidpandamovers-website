import { Text } from '@react-email/components';
import * as React from 'react';

interface EmailFieldProps {
  label: string;
  value: string | undefined;
}

export default function EmailField({ label, value }: EmailFieldProps) {
  if (!value) return null;

  return (
    <tr>
      <td style={labelStyle}>{label}</td>
      <td style={valueStyle}>{value}</td>
    </tr>
  );
}

export function EmailSectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Text style={sectionTitle}>{children}</Text>
  );
}

const labelStyle: React.CSSProperties = {
  padding: '10px 12px',
  borderBottom: '1px solid #f3f4f6',
  fontWeight: 600,
  color: '#374151',
  fontSize: '14px',
  verticalAlign: 'top',
  width: '40%',
};

const valueStyle: React.CSSProperties = {
  padding: '10px 12px',
  borderBottom: '1px solid #f3f4f6',
  color: '#1f2937',
  fontSize: '14px',
  verticalAlign: 'top',
};

const sectionTitle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 700,
  color: '#f97316',
  marginTop: '24px',
  marginBottom: '8px',
};
