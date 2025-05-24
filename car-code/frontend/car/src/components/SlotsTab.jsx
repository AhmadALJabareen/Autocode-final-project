import { XCircle } from 'lucide-react';

export default function SlotsTab({ slots, setSlots, addSlot, removeSlot }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">إدارة المواعيد المتاحة</h2>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-bold mb-4">إضافة موعد جديد</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const date = e.target.date.value;
            const time = e.target.time.value;
            addSlot(date, time);
            e.target.reset();
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-500 mb-1">التاريخ</label>
              <input
                type="date"
                name="date"
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2"
                required
              />
            </div>
            <div>
              <label className="block text-gray-500 mb-1">الوقت</label>
              <input
                type="time"
                name="time"
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            إضافة الموعد
          </button>
        </form>
      </div>
      <div className="bg-white rounded-lg shadow">
        <div className="border-b p-4">
          <h3 className="text-lg font-bold">المواعيد المتاحة</h3>
        </div>
        <div className="p-4">
          <div className="md:hidden space-y-4">
            {slots.map(slot => (
              <div key={slot._id} className="bg-white rounded-lg shadow p-4">
                <p><strong>التاريخ:</strong> {new Date(slot.date).toLocaleDateString('ar-EG')}</p>
                <p><strong>الوقت:</strong> {slot.time}</p>
                <button
                  onClick={() => removeSlot(slot._id)}
                  className="p-1 bg-red-100 text-red-600 rounded mt-2"
                >
                  <XCircle size={16} />
                </button>
              </div>
            ))}
          </div>
          <table className="w-full hidden md:table">
            <thead>
              <tr className="text-right">
                <th className="pb-2">التاريخ</th>
                <th className="pb-2">الوقت</th>
                <th className="pb-2">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {slots.map(slot => (
                <tr key={slot._id} className="border-t">
                  <td className="py-3">{new Date(slot.date).toLocaleDateString('ar-EG')}</td>
                  <td className="py-3">{slot.time}</td>
                  <td className="py-3">
                    <button
                      onClick={() => removeSlot(slot._id)}
                      className="p-1 bg-red-100 text-red-600 rounded"
                    >
                      <XCircle size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}