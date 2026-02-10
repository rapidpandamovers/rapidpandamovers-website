import { ExternalLink } from 'lucide-react';

interface OverviewSectionProps {
  title: React.ReactNode;
  name?: string;
  website?: string;
  children: React.ReactNode;
}

export default function OverviewSection({
  title,
  name,
  website,
  children,
}: OverviewSectionProps) {
  return (
    <div className="bg-gray-50 rounded-4xl p-8 mb-12">
      <div className={`flex items-center ${website ? 'justify-between' : ''} mb-6`}>
        <h2 className="text-2xl font-bold text-gray-800">
          {title}
        </h2>
        {website && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-500 hover:text-orange-600 flex items-center text-sm"
          >
            Visit Website
            <ExternalLink className="w-4 h-4 ml-1" />
          </a>
        )}
      </div>
      {children}
    </div>
  );
}
