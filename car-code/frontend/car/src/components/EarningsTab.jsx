export default function EarningsTab({ bookings, mechanic, earnings }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">الإيرادات وأداء الخدمات</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-bold mb-4">ملخص الإيرادات</h3>
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-gray-500">إيرادات هذا الشهر</p>
              <h4 className="text-2xl font-bold">{mechanic?.revenue || 0} دينار</h4>
            </div>
            <div>
              <p className="text-gray-500">إيرادات هذا العام</p>
              <h4 className="text-2xl font-bold">{(mechanic?.revenue || 0) * 12} دينار</h4>
            </div>
          </div>
          <div className="h-64 w-full">
            <div className="h-full w-full bg-gray-50 rounded flex">
              {['يناير', 'فبراير', 'مارس', 'أبريل'].map((month, index) => (
                <div key={index} className="flex-1 flex flex-col justify-end p-2 text-center">
                  <div
                    className="bg-blue-500 rounded-t"
                    style={{ height: `${((mechanic?.revenue || 0) / 16000) * 100}%` }}
                  ></div>
                  <p className="text-xs mt-1">{month}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-bold mb-4">أداء الخدمات</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <p>خدمة منزلية</p>
                <p className="text-sm">
                  {bookings.length
                    ? (
                        (bookings.filter(b => b.serviceType === 'home').length / bookings.length) * 100
                      ).toFixed(0)
                    : 0}
                  %
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: `${
                      bookings.length
                        ? (bookings.filter(b => b.serviceType === 'home').length / bookings.length) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <p>خدمة ورشة</p>
                <p className="text-sm">
                  {bookings.length
                    ? (
                        (bookings.filter(b => b.serviceType === 'workshop').length / bookings.length) * 100
                      ).toFixed(0)
                    : 0}
                  %
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: `${
                      bookings.length
                        ? (bookings.filter(b => b.serviceType === 'workshop').length / bookings.length) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow">
        <div className="border-b p-4">
          <h3 className="text-lg font-bold">سجل الإيرادات</h3>
        </div>
        <div className="p-4">
          <div className="md:hidden space-y-4">
            {earnings.map((transaction, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-4">
                <p><strong>التاريخ:</strong> {new Date(transaction.date).toLocaleDateString('ar-EG')}</p>
                <p><strong>العميل:</strong> {transaction.customer}</p>
                <p><strong>الخدمة:</strong> {transaction.service}</p>
                <p><strong>المبلغ:</strong> {transaction.amount} ريال</p>
                <p><strong>طريقة الدفع:</strong> {transaction.paymentMethod}</p>
              </div>
            ))}
          </div>
          <table className="w-full hidden md:table">
            <thead>
              <tr className="text-right">
                <th className="pb-2">التاريخ</th>
                <th className="pb-2">العميل</th>
                <th className="pb-2">الخدمة</th>
                <th className="pb-2">المبلغ</th>
                <th className="pb-2">طريقة الدفع</th>
              </tr>
            </thead>
            <tbody>
              {earnings.map((transaction, index) => (
                <tr key={index} className="border-t">
                  <td className="py-3">{new Date(transaction.date).toLocaleDateString('ar-EG')}</td>
                  <td className="py-3">{transaction.customer}</td>
                  <td className="py-3">{transaction.service}</td>
                  <td className="py-3">{transaction.amount}دينار</td>
                  <td className="py-3">{transaction.paymentMethod}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}