interface TurnstileVerifyResponse {
  success: boolean;
  'error-codes'?: string[];
}

export async function verifyTurnstile(
  token: string,
  remoteIp?: string
): Promise<{ success: boolean; errorCodes?: string[] }> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.error('TURNSTILE_SECRET_KEY is not set');
    return { success: false, errorCodes: ['missing-secret-key'] };
  }

  const body: Record<string, string> = {
    secret,
    response: token,
  };
  if (remoteIp) {
    body.remoteip = remoteIp;
  }

  const response = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(body),
    }
  );

  const data: TurnstileVerifyResponse = await response.json();

  return {
    success: data.success,
    errorCodes: data['error-codes'],
  };
}
