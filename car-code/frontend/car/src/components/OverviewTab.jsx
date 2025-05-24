import { Calendar, DollarSign, Star, CheckCircle, XCircle } from 'lucide-react';

export default function OverviewTab({ bookings, mechanic, handleBookingStatus }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">لوحة التحكم</h2>
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Calendar size={24} className="text-blue-600" />
            </div>
            <div className="text-left">
              <p className="text-gray-500">حجوزات اليوم</p>
              <h3 className="text-2xl font-bold">
                {bookings.filter(b => new Date(b.date).toDateString() === new Date().toDateString()).length}
              </h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <DollarSign size={24} className="text-green-600" />
            </div>
            <div className="text-left">
              <p className="text-gray-500">إيرادات هذا الشهر</p>
              <h3 className="text-2xl font-bold">{mechanic?.revenue || 0} ريال</h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <Star size={24} className="text-yellow-600" />
            </div>
            <div className="text-left">
              <p className="text-gray-500">متوسط التقييم</p>
              <h3 className="text-2xl font-bold">
                {mechanic?.ratings?.length
                  ? (mechanic.ratings.reduce((sum, r) => sum + r.rating, 0) / mechanic.ratings.length).toFixed(1)
                  : 'غير متاح'}
              </h3>
            </div>
          </div>
        </div>
      </div>
      {/* Upcoming Bookings */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="border-b p-4">
          <h3 className="text-lg font-bold">الحجوزات القادمة</h3>
        </div>
        <div className="p-4">
          <div className="md:hidden space-y-4">
            {bookings.slice(0, 3).map(booking => (
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
                      onClick={() => handleBookingStatus(booking._id, 'accepted')}
                      className="p-1 bg-green-100 text-green-600 rounded"
                    >
                      <CheckCircle size={16} />
                    </button>
                    <button
                      onClick={() => handleBookingStatus(booking._id, 'rejected')}
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
              {bookings.slice(0, 3).map(booking => (
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
                          onClick={() => handleBookingStatus(booking._id, 'accepted')}
                          className="p-1 bg-green-100 text-green-600 rounded"
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button
                          onClick={() => handleBookingStatus(booking._id, 'rejected')}
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
        </div>
      </div>
      {/* Recent Reviews */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b p-4">
          <h3 className="text-lg font-bold">آخر التقييمات</h3>
        </div>
        <div className="p-4">
          {mechanic?.ratings?.slice(0, 3).map(review => (
            <div key={review._id} className="border-b py-3 last:border-0">
              <div className="flex justify-between items-center mb-2">
                <div className="font-semibold">{review.user.name}</div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-1">{review.comment || 'لا يوجد تعليق'}</p>
              <p className="text-gray-400 text-sm">{new Date(review.createdAt).toLocaleDateString('ar-EG')}</p>
            </div>
          ))}
          {(!mechanic?.ratings || mechanic.ratings.length === 0) && (
            <p className="text-gray-500">لا توجد تقييمات بعد</p>
          )}
        </div>
      </div>
    </div>
  );
}