import { ExternalLink } from 'lucide-react';
import { getMessages } from 'next-intl/server';
import { H2 } from '@/app/components/Heading';

interface OverviewSectionProps {
  title: React.ReactNode;
  name?: string;
  website?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export default async function OverviewSection({
  title,
  name,
  website,
  icon,
  children,
}: OverviewSectionProps) {
  const { ui } = (await getMessages()) as any;
  return (
    <section className="pt-20">
      <div className="container mx-auto">
        <div className="bg-gray-50 rounded-4xl p-8">
          <div className={icon ? 'flex items-center gap-12' : ''}>
            <div className="flex-1">
              <div className={`flex items-center ${website ? 'justify-between' : ''} mb-6`}>
                <H2 className="text-4xl font-bold text-gray-800">
                  {title}
                </H2>
                {website && (
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-700 hover:text-orange-800 flex items-center text-sm"
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
