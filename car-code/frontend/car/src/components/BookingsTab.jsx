import { Search } from 'lucide-react';

export default function BookingsTab({ bookings }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة الحجوزات</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 flex justify-between items-center border-b">
          <div className="flex items-center">
            <select className="border rounded p-2 ml-2">
              <option>كل الحالات</option>
              <option>معلق</option>
              <option>مقبول</option>
              <option>مرفوض</option>
              <option>مكتمل</option>
            </select>
          </div>
          
          <div className="flex items-center border rounded overflow-hidden">
            <input type="text" placeholder="بحث عن حجز..." className="px-3 py-2 outline-none" />
            <button className="bg-gray-100 px-3 py-2">
              <Search size={18} />
            </button>
          </div>
        </div>
        
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-3 px-4 text-right">العميل</th>
              <th className="py-3 px-4 text-right">الميكانيكي</th>
              <th className="py-3 px-4 text-right">نوع الخدمة</th>
              <th className="py-3 px-4 text-right">التاريخ</th>
              <th className="py-3 px-4 text-right">الحالة</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{booking.user?.name || 'غير معروف'}</td>
                <td className="py-3 px-4">{booking.mechanic?.workshopName|| 'غير معروف'}</td>
                <td className="py-3 px-4">{booking.serviceType === 'home' ? 'خدمة منزلية' : 'ورشة'}</td>
                <td className="py-3 px-4">{new Date(booking.date).toLocaleDateString('ar-EG')}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {booking.status === 'completed' ? 'مكتمل' :
                     booking.status === 'accepted' ? 'مقبول' :
                     booking.status === 'pending' ? 'معلق' : 'مرفوض'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="p-4 flex items-center justify-between border-t">
          <div>
            <p className="text-sm text-gray-500">عرض 1-10 من {bookings.length} حجز</p>
          </div>
          <div className="flex">
            <button className="border rounded mr-1 px-3 py-1 hover:bg-gray-100">السابق</button>
            <button className="border rounded bg-blue-500 text-white mr-1 px-3 py-1">1</button>
            <button className="border rounded mr-1 px-3 py-1 hover:bg-gray-100">2</button>
            <button className="border rounded px-3 py-1 hover:bg-gray-100">التالي</button>
          </div>
        </div>
      </div>
    </div>
  );
}