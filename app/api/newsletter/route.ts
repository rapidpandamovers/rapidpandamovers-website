import { NextRequest, NextResponse, after } from 'next/server';
import { newsletterSchema } from '@/lib/validation';
import { verifyTurnstile } from '@/lib/turnstile';
import { newsletterRateLimit } from '@/lib/rate-limit';
import { sanitizeObject } from '@/lib/sanitize';
import { sendNewsletterNotification } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    // 1. Rate limit
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown';
    const rateLimitResult = newsletterRateLimit.check(ip);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a few minutes and try again.' },
        { status: 429, headers: { 'Retry-After': '900' } }
      );
    }

    // 2. Validate
    const body = await request.json();
    const parsed = newsletterSchema.safeParse(body);
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
        await sendNewsletterNotification(sanitized);
      } catch (err) {
        console.error('Failed to send newsletter email:', err);
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter' },
      { status: 500 }
    );
  }
}
