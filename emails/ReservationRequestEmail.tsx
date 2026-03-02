import { Text } from '@react-email/components';
import * as React from 'react';
import EmailLayout from './components/EmailLayout';
import EmailField, { EmailSectionTitle } from './components/EmailField';

interface ReservationRequestEmailProps {
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
}

export default function ReservationRequestEmail(props: ReservationRequestEmailProps) {
  const pickupFull = `${props.pickupAddress}${props.pickupApt ? ` ${props.pickupApt}` : ''}, ${props.pickupCity}, ${props.pickupState} ${props.pickupZip}${props.pickupStorage ? ' (Storage Facility)' : ''}`;
  const dropoffFull = `${props.dropoffAddress}${props.dropoffApt ? ` ${props.dropoffApt}` : ''}, ${props.dropoffCity}, ${props.dropoffState} ${props.dropoffZip}${props.dropoffStorage ? ' (Storage Facility)' : ''}`;

  return (
    <EmailLayout preview={`New Reservation: ${props.name} on ${props.moveDate}`}>
      <Text style={heading}>New Reservation Request</Text>

      <EmailSectionTitle>Contact Information</EmailSectionTitle>
      <table style={table}>
        <tbody>
          <EmailField label="Name" value={props.name} />
          <EmailField label="Email" value={props.email} />
          <EmailField label="Phone" value={props.phone} />
          <EmailField label="Reference #" value={props.reference} />
        </tbody>
      </table>

      <EmailSectionTitle>Moving Details</EmailSectionTitle>
      <table style={table}>
        <tbody>
          <EmailField label="Pick-up Address" value={pickupFull} />
          <EmailField label="Drop-off Address" value={dropoffFull} />
          <EmailField label="Move Date" value={props.moveDate} />
          <EmailField label="Preferred Time" value={props.moveTime} />
          <EmailField label="Move Size" value={props.moveSize} />
          <EmailField label="Packing Service" value={props.packing} />
          <EmailField label="Additional Services" value={props.additionalServices?.join(', ')} />
          <EmailField label="Special Items/Notes" value={props.specialItems} />
          <EmailField label="How They Found Us" value={props.hearAbout} />
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
