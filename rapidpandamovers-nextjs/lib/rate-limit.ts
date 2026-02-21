interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimitOptions {
  windowMs: number;
  max: number;
}

function createRateLimit(opts: RateLimitOptions) {
  const store = new Map<string, RateLimitEntry>();

  // Purge expired entries every 60s
  if (typeof setInterval !== 'undefined') {
    setInterval(() => {
      const now = Date.now();
      store.forEach((entry, key) => {
        if (now > entry.resetAt) {
          store.delete(key);
        }
      });
    }, 60_000);
  }

  return {
    check(ip: string): { success: boolean; remaining: number } {
      const now = Date.now();
      const entry = store.get(ip);

      if (!entry || now > entry.resetAt) {
        store.set(ip, { count: 1, resetAt: now + opts.windowMs });
        return { success: true, remaining: opts.max - 1 };
      }

      if (entry.count >= opts.max) {
        return { success: false, remaining: 0 };
      }

      entry.count++;
      return { success: true, remaining: opts.max - entry.count };
    },
  };
}

export const contactRateLimit = createRateLimit({ windowMs: 15 * 60 * 1000, max: 10 });
export const quoteRateLimit = createRateLimit({ windowMs: 15 * 60 * 1000, max: 5 });
export const reservationRateLimit = createRateLimit({ windowMs: 15 * 60 * 1000, max: 5 });
export const newsletterRateLimit = createRateLimit({ windowMs: 15 * 60 * 1000, max: 3 });
