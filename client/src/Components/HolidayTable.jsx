function HolidayTable() {
  const tableData = Array.from({ length: 5 }, () => Array(5).fill(null));

  const colHeader = ['주', '야', '주대', '야대'];

  return (
    <div style={{ width: '30%', height: '20%', float: 'right' }}>
      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200 border-collapse">
          <thead className="bg-green-100">
            <tr>
              <th className="px-2 py-1 text-center text-xs font-bold text-green-800 uppercase tracking-wider"></th>
              {Array.from({ length: 4 }).map((_, index) => (
                <th key={`header-${index}`} className="px-2 py-1 text-center text-xs font-bold text-green-800 uppercase tracking-wider w-1/6">
                  {colHeader[index]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {tableData.map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`}>
                <td className="px-2 py-1 text-center whitespace-nowrap text-sm font-semibold text-blue-800 bg-blue-100 border">{}</td>
                {row.slice(1).map((_, colIndex) => (
                  <td key={`cell-${rowIndex}-${colIndex}`} className="px-2 py-1 text-center whitespace-nowrap text-sm font-semibold text-gray-900 border w-1/6">
                    Cell
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HolidayTable;
