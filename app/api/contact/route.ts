import { NextRequest, NextResponse, after } from 'next/server';
import { contactSchema } from '@/lib/validation';
import { verifyTurnstile } from '@/lib/turnstile';
import { contactRateLimit } from '@/lib/rate-limit';
import { sanitizeObject } from '@/lib/sanitize';
import { sendContactNotification } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    // 1. Rate limit
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown';
    const rateLimitResult = contactRateLimit.check(ip);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a few minutes and try again.' },
        { status: 429, headers: { 'Retry-After': '900' } }
      );
    }

    // 2. Validate
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // 3. Verify Turnstile
    const { turnstileToken, ...formData } = parsed.data;
    const turnstileResult = await verifyTurnstile(turnstileToken, ip);
    if (!turnstileResult.success) {
      return NextResponse.json(
        { error: 'CAPTCHA verification failed' },
        { status: 403 }
      );
    }

    // 4. Sanitize
    const sanitized = sanitizeObject(formData);

    // 5. Send email after response (non-blocking)
    after(async () => {
      try {
        await sendContactNotification(sanitized);
      } catch (err) {
        console.error('Failed to send contact email:', err);
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
