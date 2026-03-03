import { NextRequest, NextResponse, after } from 'next/server';
import { quoteSchema } from '@/lib/validation';
import { verifyTurnstile } from '@/lib/turnstile';
import { quoteRateLimit } from '@/lib/rate-limit';
import { sanitizeObject } from '@/lib/sanitize';
import { sendQuoteNotification } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    // 1. Rate limit
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown';
    const rateLimitResult = quoteRateLimit.check(ip);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a few minutes and try again.' },
        { status: 429, headers: { 'Retry-After': '900' } }
      );
    }

    // 2. Validate
    const body = await request.json();
    const parsed = quoteSchema.safeParse(body);
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
        await sendQuoteNotification(sanitized);
      } catch (err) {
        console.error('Failed to send quote email:', err);
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Quote submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit quote request' },
      { status: 500 }
    );
  }
}
