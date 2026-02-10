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

export default function CompareTable({ 
  title = "Quick Comparison", 
  columns, 
  rows 
}: CompareTableProps) {
  return (
    <section className="py-16">
      <div className="container mx-auto">
        <div className="mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10 text-center">
            {title}
          </h2>
          <div className="overflow-x-auto rounded-4xl border border-black overflow-hidden bg-white">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-black">
                  <th className="p-5 text-left font-bold text-white text-sm uppercase tracking-wide">Option</th>
                  {columns.map((column, index) => (
                    <th key={index} className="p-5 text-left font-bold text-white text-sm uppercase tracking-wide">
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr 
                    key={rowIndex} 
                    className={`border-b border-gray-200 transition-colors ${
                      row.highlight 
                        ? 'bg-orange-50 hover:bg-orange-100' 
                        : rowIndex % 2 === 0 
                          ? 'bg-white hover:bg-gray-50' 
                          : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <td className={`p-5 ${row.highlight ? 'font-bold text-orange-600 text-base' : 'font-semibold text-gray-800 text-base'}`}>
                      {row.option}
                    </td>
                    {row.cells.map((cell, cellIndex) => (
                      <td key={cellIndex} className="p-5 text-gray-700 text-base leading-relaxed">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
