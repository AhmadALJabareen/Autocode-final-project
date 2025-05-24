import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Wrench, FileText, Car } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

export default function DashboardTab({ users, mechanics, parts, articles, stats }) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">لوحة المعلومات</h1>
      
      {/* البطاقات الإحصائية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">إجمالي المستخدمين</p>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users size={24} className="text-blue-500" />
            </div>
          </div>
          <p className="text-green-500 text-sm mt-2">+12% منذ الشهر الماضي</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">الميكانيكيين النشطين</p>
              <p className="text-2xl font-bold">{mechanics.filter(m => m.available).length}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Wrench size={24} className="text-green-500" />
            </div>
          </div>
          <p className="text-green-500 text-sm mt-2">+5% منذ الأسبوع الماضي</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">إجمالي قطع الغيار</p>
              <p className="text-2xl font-bold">{parts.length}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Car size={24} className="text-purple-500" />
            </div>
          </div>
          <p className="text-green-500 text-sm mt-2">+15% منذ الشهر الماضي</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">عدد المقالات</p>
              <p className="text-2xl font-bold">{articles.length}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <FileText size={24} className="text-yellow-500" />
            </div>
          </div>
          <p className="text-green-500 text-sm mt-2">+8% منذ الأسبوع الماضي</p>
        </div>
      </div>
      
      {/* الرسوم البيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-bold mb-4">الحجوزات الشهرية</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.bookings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="عدد" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-bold mb-4">الإيرادات الشهرية</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.revenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="إيراد" stroke="#82ca9d" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* توزيع المستخدمين */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-bold mb-4">توزيع المستخدمين</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stats.userTypes}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="قيمة"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {stats.userTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* آخر المستخدمين */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-bold mb-4">آخر المستخدمين المسجلين</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-right">الاسم</th>
                  <th className="py-2 text-right">النوع</th>
                  <th className="py-2 text-right">التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 4).map(user => (
                  <tr key={user._id} className="border-b hover:bg-gray-50">
                    <td className="py-2">{user.name}</td>
                    <td className="py-2">{user.role === 'admin' ? 'مشرف' : user.role === 'mechanic' ? 'ميكانيكي' : 'عميل'}</td>
                    <td className="py-2">{new Date(user.createdAt).toLocaleDateString('ar-EG')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* آخر قطع الغيار المضافة */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-bold mb-4">آخر قطع الغيار المضافة</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-right">اسم القطعة</th>
                  <th className="py-2 text-right">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {parts.slice(0, 4).map(part => (
                  <tr key={part._id} className="border-b hover:bg-gray-50">
                    <td className="py-2">{part.name}</td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${part.state === 'approved' ? 'bg-green-100 text-green-800' : part.state === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {part.state === 'approved' ? 'مقبول' : part.state === 'pending' ? 'معلق' : 'مرفوض'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}