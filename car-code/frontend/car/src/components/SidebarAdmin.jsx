
import { Home, Users, Wrench, FileText, Car, Calendar, Settings, LogOut, Mail } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, handleLogout }) {
  const tabs = [
    { id: 'dashboard', label: 'لوحة المعلومات', icon: <Home size={20} /> },
    { id: 'users', label: 'المستخدمون', icon: <Users size={20} /> },
    { id: 'mechanics', label: 'الميكانيكيون', icon: <Wrench size={20} /> },
    { id: 'articles', label: 'المقالات', icon: <FileText size={20} /> },
    { id: 'parts', label: 'قطع الغيار', icon: <Car size={20} /> },
    { id: 'bookings', label: 'الحجوزات', icon: <Calendar size={20} /> },
    { id: 'messages', label: 'الرسائل', icon: <Mail size={20} /> },
    { id: 'settings', label: 'الإعدادات', icon: <Settings size={20} /> },
  ];
  
  return (
    <div className="w-64 bg-white shadow-lg flex flex-col h-screen rounded-tr-lg" dir="rtl">
      <div className="p-5 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-[#081840]">لوحة التحكم</h1>
      </div>
      
      <nav className="flex-1 py-6 px-4 overflow-y-auto">
        <ul className="space-y-1">
          {tabs.map(tab => (
            <li key={tab.id}>
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-right transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-[#5D1D5F] text-white font-medium shadow-md'
                    : 'text-gray-600 hover:bg-purple-50 hover:text-[#5D1D5F]'
                }`}
              >
                <span className={activeTab === tab.id ? 'text-white' : 'text-[#5D1D5F]'}>
                  {tab.icon}
                </span>
                <span className="text-sm">{tab.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-100 mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200"
        >
          <LogOut size={20} className="text-red-500" />
          <span className="text-sm font-medium">تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );
}