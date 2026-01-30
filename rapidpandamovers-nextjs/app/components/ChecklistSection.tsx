import Link from 'next/link';
import { ClipboardList, ArrowRight, CheckCircle } from 'lucide-react';

interface ChecklistSectionProps {
  className?: string;
}

export default function ChecklistSection({ className = "" }: ChecklistSectionProps) {
  const sampleTasks = [
    'Create a moving timeline and budget',
    'Research and hire a reputable moving company',
    'Declutter and donate unwanted items',
    'Gather packing supplies',
  ];

  return (
    <section className={`py-16 bg-gray-50 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ClipboardList className="w-8 h-8 text-orange-500" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Moving Checklist
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Stay organized with our comprehensive moving checklist. From weeks before your move to moving day, we've got you covered with every task you need to complete.
          </p>

          {/* Sample Tasks Preview */}
          <div className="bg-white rounded-lg shadow p-6 mb-8 text-left max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Preview:</h3>
            <div className="space-y-3">
              {sampleTasks.map((task, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{task}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-4 italic">...and many more tasks organized by timeline</p>
          </div>

          <Link
            href="/moving-checklist"
            className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            View Full Checklist
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}
