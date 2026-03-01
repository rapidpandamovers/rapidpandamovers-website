import { getMessages } from 'next-intl/server';
import { H2 } from '@/app/components/Heading';

interface CompareTableColumn {
  header: string;
}

interface CompareTableRow {
  option: string;
  cells: string[];
  highlight?: boolean;
}

interface CompareTableProps {
  title?: string;
  columns: CompareTableColumn[];
  rows: CompareTableRow[];
}

export default async function CompareTable({
  title = "Quick Comparison",
  columns,
  rows
}: CompareTableProps) {
  const { ui } = (await getMessages()) as any;
  return (
    <section className="pt-20">
      <div className="container mx-auto">
        <div className="mx-auto">
          <H2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10 text-center">
            {title}
          </H2>
          <div className="overflow-x-auto rounded-4xl border border-black overflow-hidden bg-black">
            <table className="w-full border-separate border-spacing-0">
              <thead>
                <tr>
                  <th className="p-5 text-left font-bold text-white text-sm uppercase tracking-wide bg-black">{ui.compare.optionHeader}</th>
                  {columns.map((column, index) => (
                    <th key={index} className="p-5 text-left font-bold text-white text-sm uppercase tracking-wide bg-black">
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIndex) => {
                  const bgClass = row.highlight
                    ? 'bg-orange-50 hover:bg-orange-100'
                    : rowIndex % 2 === 0
                      ? 'bg-white hover:bg-gray-50'
                      : 'bg-gray-50 hover:bg-gray-100'
                  const isFirst = rowIndex === 0
                  const isLast = rowIndex === rows.length - 1

                  return (
                    <tr key={rowIndex} className="transition-colors">
                      <td className={`p-5 ${bgClass} ${row.highlight ? 'font-bold text-orange-700 text-base' : 'font-semibold text-gray-800 text-base'} ${isFirst ? 'rounded-tl-2xl' : ''} ${isLast ? 'rounded-bl-2xl' : ''} ${!isLast ? 'border-b border-gray-200' : ''}`}>
                        {row.option}
                      </td>
                      {row.cells.map((cell, cellIndex) => {
                        const isLastCell = cellIndex === row.cells.length - 1
                        return (
                          <td key={cellIndex} className={`p-5 ${bgClass} text-gray-700 text-base leading-relaxed ${isFirst && isLastCell ? 'rounded-tr-2xl' : ''} ${isLast && isLastCell ? 'rounded-br-2xl' : ''} ${!isLast ? 'border-b border-gray-200' : ''}`}>
                            {cell}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
