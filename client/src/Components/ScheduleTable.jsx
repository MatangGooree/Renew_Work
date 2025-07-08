function ScheduleTable({ monthDetails, Workers, scheduleData }) {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200 border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th rowSpan="2" className="sticky left-0 bg-gray-300 px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider z-20 align-middle border-b border-gray-200">
              근무자
            </th>
            {monthDetails.map(({ date, isWeekend, isToday, Anniversary }) => (
              <th key={`date-${date}`} className={`px-4 py-2 text-center text-xs font-bold uppercase tracking-wider transition-colors duration-200 ${isWeekend || Anniversary.length > 0 ? 'bg-red-100 text-red-800' : 'bg-gray-200 text-gray-600'} `}>
                {/* {Anniversary.length>0?<span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-red-500 text-white">{date}</span> :date} */}
                {date}
              </th>
            ))}
          </tr>
          <tr>
            {monthDetails.map(({ date, dayLabel, isWeekend, isToday, Anniversary }) => (
              <th key={`day-${date}`} className={`px-4 py-2 text-center text-xs font-bold uppercase tracking-wider border-b border-gray-200 transition-colors duration-200 ${isWeekend || Anniversary.length > 0 ? 'bg-red-100 text-red-800' : 'bg-gray-200 text-gray-500'}`}>
                {dayLabel}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white ">
          {Workers.map((worker) => {
            if (worker.Roll == 'admin') {
              return null;
            }
            return (
              <tr key={worker.Worker_ID}>
                <td className="sticky left-0 bg-gray-200 px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900 z-10 border-r">{worker.Name}</td>
                {monthDetails.map(({ isWeekend, isToday, Anniversary }, index) => {
                  if (worker.Roll === 'manager') {
                    const shift = isWeekend ? 'XX' : '○';
                    return (
                      <td key={index}>
                        <div className={`w-full h-full flex items-center justify-center py-3 ${isWeekend || Anniversary.length > 0 ? 'bg-red-100' : 'bg-gray-100'}`}>{shift}</div>
                      </td>
                    );
                  } else {
                    return (
                      <td key={index}>
                        <div className={`w-full h-full flex items-center justify-center py-3 ${isWeekend || Anniversary.length > 0 ? 'bg-red-100' : 'bg-gray-100'}`}>{scheduleData[worker.Name][index]}</div>
                      </td>
                    );
                  }
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
export default ScheduleTable;

// function ScheduleTable({ monthDetails, Workers, scheduleData }) {
//   return (
//     <div className="overflow-x-auto bg-white rounded-lg shadow">
//       <table className="min-w-full divide-y divide-gray-200 border-collapse">
//         <thead className="bg-gray-100">
//           <tr>
//             <th rowSpan="2" className="sticky left-0 bg-gray-300 px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider z-20 align-middle border-b border-gray-200">
//               근무자
//             </th>
//             {monthDetails.map(({ date, isWeekend, isToday, Anniversary }) => (
//               <th key={`date-${date}`} className={`px-4 py-2 text-center text-xs font-bold uppercase tracking-wider transition-colors duration-200 ${isWeekend || Anniversary.length > 0 ? 'bg-red-100 text-red-800' : 'bg-gray-200 text-gray-600'} `}>
//                 {date}
//               </th>
//             ))}
//           </tr>
//           <tr>
//             {monthDetails.map(({ date, dayLabel, isWeekend, isToday, Anniversary }) => (
//               <th key={`day-${date}`} className={`px-4 py-2 text-center text-xs font-bold uppercase tracking-wider border-b border-gray-200 transition-colors duration-200 ${isWeekend || Anniversary.length > 0 ? 'bg-red-100 text-red-800' : 'bg-gray-200 text-gray-500'}`}>
//                 {dayLabel}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody className="bg-white ">
//           {Workers.map((worker) => {
//             if (worker.Roll == 'admin') {
//               return null;
//             }
//             return (
//               <tr key={worker.Worker_ID}>
//                 <td className="sticky left-0 bg-gray-200 px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900 z-10 border-r">{worker.Name}</td>
//                 {monthDetails.map(({ isWeekend, isToday, Anniversary }, index) => {
//                   if (worker.Roll === 'manager') {
//                     const shift = isWeekend ? 'XX' : '○';
//                     return (
//                       <td key={index}>
//                         {/* --- MODIFIED LINE --- */}
//                         <div className={`w-full h-full flex items-center justify-center py-3 ${isWeekend || Anniversary.length > 0 ? 'bg-red-100' : 'bg-gray-100'} transition-transform duration-200 ease-in-out hover:scale-125 hover:shadow-lg relative hover:z-10`}>{shift}</div>
//                       </td>
//                     );
//                   } else {
//                     return (
//                       <td key={index}>
//                         {/* --- MODIFIED LINE --- */}
//                         <div className={`w-full h-full flex items-center justify-center py-3 ${isWeekend || Anniversary.length > 0 ? 'bg-red-100' : 'bg-gray-100'} transition-transform duration-200 ease-in-out hover:scale-125 hover:shadow-lg relative hover:z-10`}>{scheduleData[worker.Name][index]}</div>
//                       </td>
//                     );
//                   }
//                 })}
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// }
// export default ScheduleTable;
