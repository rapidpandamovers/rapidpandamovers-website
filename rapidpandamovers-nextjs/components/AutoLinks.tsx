'use client';
import Link from 'next/link';

export default function AutoLinks({ blocks }: { blocks: { title: string; items: { href: string; label: string }[] }[] }) {
  if (!blocks.length) return null;
  return (
    <div className="my-8 space-y-8">
      {blocks.map((b, i) => (
        <section key={i}>
          <h2 className="text-xl font-semibold">{b.title}</h2>
          <ul className="mt-2 grid gap-2 sm:grid-cols-2">
            {b.items.map((it, j) => (
              <li key={j}>
                <Link href={it.href} className="underline hover:text-blue-600">
                  {it.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
