import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, formatReservationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    const requiredFields = [
      'name', 'email', 'phone',
      'pickupAddress', 'pickupCity', 'pickupState', 'pickupZip',
      'dropoffAddress', 'dropoffCity', 'dropoffState', 'dropoffZip',
      'moveDate', 'moveTime', 'moveSize', 'packing'
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Send email
    await sendEmail({
      subject: `New Reservation Request from ${data.name}`,
      html: formatReservationEmail(data),
      replyTo: data.email,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Reservation submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit reservation request' },
      { status: 500 }
    );
  }
}
