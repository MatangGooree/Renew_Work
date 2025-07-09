function HolidayTable({ Workers }) {
  console.log(Workers);
  const tableData = Workers.slice(1, 6);

  const colHeader = ['주', '야', '주대', '야대'];

  return (
    <div style={{ width: '30%', height: '20%', float: 'right' }}>
      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200 border-collapse">
          <thead className="bg-green-100">
            <tr>
              <th className="px-2 py-1 text-center text-xs font-bold text-green-800 uppercase tracking-wider">근무자</th>
              {colHeader.map((header, index) => (
                <th key={`header-${index}`} className="px-2 py-1 text-center text-xs font-bold text-green-800 uppercase tracking-wider w-1/6">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {tableData.map((worker, rowIndex) => (
              <tr key={`row-${rowIndex}`}>
                <td className="px-2 py-1 text-center whitespace-nowrap text-sm font-semibold text-blue-800 bg-blue-100 border">{worker.Name}</td>
                <td key={`cell-${rowIndex}-0`} className="px-2 py-1 text-center whitespace-nowrap text-sm font-semibold text-gray-900 border w-1/6">
                  {worker.remain_Day}
                </td>
                <td key={`cell-${rowIndex}-1`} className="px-2 py-1 text-center whitespace-nowrap text-sm font-semibold text-gray-900 border w-1/6">
                  {worker.remain_Night}
                </td>
                <td key={`cell-${rowIndex}-2`} className="px-2 py-1 text-center whitespace-nowrap text-sm font-semibold text-gray-900 border w-1/6">
                  {12 - worker.remain_Day}
                </td>
                <td key={`cell-${rowIndex}-3`} className="px-2 py-1 text-center whitespace-nowrap text-sm font-semibold text-gray-900 border w-1/6">
                  {12 - worker.remain_Night}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HolidayTable;
