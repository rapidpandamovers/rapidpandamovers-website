import { ExternalLink } from 'lucide-react';
import { getMessages } from 'next-intl/server';
import { H2 } from '@/app/components/Heading';

interface OverviewSectionProps {
  title: React.ReactNode;
  name?: string;
  website?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export default async function OverviewSection({
  title,
  name,
  website,
  icon,
  children,
  className = '',
}: OverviewSectionProps) {
  const { ui } = (await getMessages()) as any;
  return (
    <section className={`pt-20 ${className}`}>
      <div className="container mx-auto">
        <div className="bg-gray-50 rounded-4xl p-6 md:p-8">
          <div className={icon ? 'flex items-center gap-12' : ''}>
            <div className="flex-1">
              <div className="mb-6">
                <H2 className="text-3xl md:text-4xl font-bold text-gray-800">
                  {title}
                </H2>
                {website && (
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-700 hover:text-orange-800 inline-flex items-center text-sm mt-3"
                  >
                    {ui.buttons.visitWebsite}
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                )}
              </div>
              {children}
            </div>
            {icon && (
              <div className="hidden md:block flex-shrink-0">
                {icon}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
