import { CheckCircle, XCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import { useState, useEffect } from 'react';

export default function BookingsTab({ bookings, setBookings, handleBookingStatus, fetchData }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const confirmAction = async (bookingId, status) => {
    const action = status === 'accepted' ? 'قبول' : 'رفض';
    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: `هل تريد ${action} هذا الحجز؟`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'نعم',
      cancelButtonText: 'لا',
      reverseButtons: true
    });
    
    if (result.isConfirmed) {
  setBookings(prev =>
    prev.map(booking =>
      booking._id === bookingId ? { ...booking, status } : booking
    )
  );

  // إرسال التحديث إلى الخادم
  await handleBookingStatus(bookingId, status);
}

  };

  // Filter bookings based on status and category
  const filteredBookings = bookings.filter(booking => {
    const statusMatch = filterStatus === 'all' || booking.status === filterStatus;
    const categoryMatch = filterCategory === 'all' || booking.serviceType === filterCategory;
    return statusMatch && categoryMatch;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, filterCategory]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">إدارة الحجوزات</h2>
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h3 className="text-lg font-bold">قائمة الحجوزات</h3>
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2"
            >
              <option value="all">جميع الحالات</option>
              <option value="pending">قيد الانتظار</option>
              <option value="accepted">مؤكدة</option>
              <option value="completed">مكتملة</option>
              <option value="rejected">مرفوضة</option>
            </select>
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2"
            >
              <option value="all">جميع الفئات</option>
              <option value="home">خدمة منزلية</option>
              <option value="workshop">ورشة</option>
            </select>
          </div>
        </div>
        
        <div className="p-4">
          <div className="md:hidden space-y-4">
            {currentBookings.map(booking => (
              <div key={booking._id} className="bg-white rounded-lg shadow p-4">
                <p><strong>العميل:</strong> {booking.user.name}</p>
                <p><strong>الخدمة:</strong> {booking.serviceType === 'home' ? 'خدمة منزلية' : 'ورشة'}</p>
                <p><strong>الموقع:</strong> {booking.location}</p>
                <p><strong>التاريخ:</strong> {new Date(booking.date).toLocaleDateString('ar-EG')}</p>
                <p><strong>الوقت:</strong> {booking.time}</p>
                <p>
                  <strong>الحالة:</strong>{' '}
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      booking.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {booking.status === 'accepted' ? 'مؤكد' :
                     booking.status === 'pending' ? 'قيد الانتظار' :
                     booking.status === 'rejected' ? 'مرفوض' : 'مكتمل'}
                  </span>
                </p>
                {booking.status === 'pending' && (
                  <div className="flex space-x-2 mt-2">
                    <button
                      onClick={() => confirmAction(booking._id, 'accepted')}
                      className="p-1 bg-green-100 text-green-600 rounded"
                    >
                      <CheckCircle size={16} />
                    </button>
                    <button
                      onClick={() => confirmAction(booking._id, 'rejected')}
                      className="p-1 bg-red-100 text-red-600 rounded"
                    >
                      <XCircle size={16} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <table className="w-full hidden md:table">
            <thead>
              <tr className="text-right">
                <th className="pb-2">العميل</th>
                <th className="pb-2">الخدمة</th>
                <th className="pb-2">الموقع</th>
                <th className="pb-2">التاريخ</th>
                <th className="pb-2">الوقت</th>
                <th className="pb-2">الحالة</th>
                <th className="pb-2">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {currentBookings.map(booking => (
                <tr key={booking._id} className="border-t">
                  <td className="py-3">{booking.user.name}</td>
                  <td className="py-3">{booking.serviceType === 'home' ? 'خدمة منزلية' : 'ورشة'}</td>
                  <td className="py-3">{booking.location}</td>
                  <td className="py-3">{new Date(booking.date).toLocaleDateString('ar-EG')}</td>
                  <td className="py-3">{booking.time}</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        booking.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {booking.status === 'accepted' ? 'مؤكد' :
                       booking.status === 'pending' ? 'قيد الانتظار' :
                       booking.status === 'rejected' ? 'مرفوض' : 'مكتمل'}
                    </span>
                  </td>
                  <td className="py-3">
                    {booking.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => confirmAction(booking._id, 'accepted')}
                          className="p-1 bg-green-100 text-green-600 rounded"
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button
                          onClick={() => confirmAction(booking._id, 'rejected')}
                          className="p-1 bg-red-100 text-red-600 rounded mr-2"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Pagination */}
          {filteredBookings.length > itemsPerPage && (
            <div className="flex justify-center mt-6">
              <nav className="inline-flex rounded-md shadow">
                <button
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  السابق
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`px-3 py-1 border-t border-b border-gray-300 ${currentPage === number ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                  >
                    {number}
                  </button>
                ))}
                
                <button
                  onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  التالي
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}