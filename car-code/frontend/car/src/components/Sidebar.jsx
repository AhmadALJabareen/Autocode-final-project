import { Home, Calendar, Clock, Users, DollarSign, Settings, LogOut, X } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, handleLogout, isSidebarOpen, toggleSidebar }) {
  const menuItems = [
    { tab: 'overview', label: 'الرئيسية', icon: Home },
    { tab: 'bookings', label: 'الحجوزات', icon: Calendar },
    { tab: 'slots', label: 'المواعيد المتاحة', icon: Clock },
    { tab: 'profile', label: 'الملف الشخصي', icon: Users },
    { tab: 'earnings', label: 'الإيرادات', icon: DollarSign },
    { tab: 'settings', label: 'الإعدادات', icon: Settings },
  ];

  return (
    <>
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={toggleSidebar}></div>
      )}
      <div
        className={`fixed inset-y-0 right-0 w-64 bg-blue-900 text-white p-4 transform ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        } md:translate-x-0 md:static md:flex md:w-64 transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="flex-1">
          <div className="flex items-center justify-right mb-8">
            <h1 className="text-xl font-bold mr-2">بوابة الميكانيكي</h1>
          </div>
          <nav className="space-y-2">
            {menuItems.map(({ tab, label, icon: Icon }) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  toggleSidebar();
                }}
                className={`flex items-center w-full p-3 rounded-lg text-right ${
                  activeTab === tab ? 'bg-blue-800' : 'hover:bg-blue-800'
                }`}
              >
                <Icon size={18} className="ml-2" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
          <div className="absolute bottom-4 left-4 right-4">
            <button
              onClick={handleLogout}
              className="flex items-center w-full p-3 rounded-lg text-right hover:bg-blue-800"
            >
              <LogOut size={18} className="ml-2" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}