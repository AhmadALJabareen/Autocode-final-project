import { Bell } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';  

export default function Header({ admin, showNotifications, setShowNotifications, notifications }) {
  const navigate = useNavigate();
  
  const handleNotificationClick = (type) => {
    setShowNotifications(false);
    navigate('/admin', { state: { activeTab: type === 'part' ? 'parts' : 'messages' } });
  };
  
  return (
    <header className="bg-[#081840] border-b flex items-center justify-between px-6 py-3 shadow-sm" dir="rtl">
      {/* Left side - Admin Profile */}
      <div className="flex items-center">
        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#5D1D5F] to-[#4A4215] flex items-center justify-center text-white font-bold overflow-hidden shadow-md border-2 border-[#FCDE59]">
          {admin?.image ? (
            <img src={`http://localhost:4000${admin.image}`} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span className="text-lg">{admin?.name?.[0] || 'أ'}</span>
          )}
        </div>
        <div className="mr-3 text-right">
          <p className="font-bold text-[#FCDE59]">{admin?.name || 'أحمد المشرف'}</p>
          <p className="text-sm text-gray-300">مشرف نظام</p>
        </div>
      </div>
      
      {/* Right side - Notifications */}
      <div className="flex items-center">
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full hover:bg-[#5D1D5F] transition-colors duration-200 relative"
          >
            <Bell size={22} className="text-[#FCDE59]" />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium border-2 border-[#081840] transform -translate-y-1 translate-x-1">
                {notifications.length}
              </span>
            )}
          </button>
          
          {showNotifications && (
            <div className="absolute left-0 mt-2 w-72 bg-white rounded-lg shadow-xl z-10 border border-[#4A4215] overflow-hidden transform transition-all duration-200">
              <div className="px-4 py-3 bg-gradient-to-r from-[#5D1D5F] to-[#4A4215] text-[#FCDE59]">
                <h3 className="font-bold">الإشعارات</h3>
              </div>
              
              {notifications.length === 0 ? (
                <div className="p-4 text-gray-500 text-center">
                  <Bell size={24} className="mx-auto mb-2 text-gray-400" />
                  <p>لا توجد إشعارات جديدة</p>
                </div>
              ) : (
                <ul className="max-h-64 overflow-y-auto">
                  {notifications.map(notification => (
                    <li
                      key={notification.id}
                      className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 cursor-pointer transition-colors duration-150"
                      onClick={() => handleNotificationClick(notification.type)}
                    >
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-medium text-gray-800">{notification.message}</p>
                        <span className="text-xs bg-[#081840] text-[#FCDE59] px-2 py-1 rounded-full mt-1 mr-2">
                          {notification.type === 'part' ? 'قطع غيار' : 'رسائل'}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 block mt-1">
                        {new Date(notification.createdAt).toLocaleTimeString('ar-SA', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              
              {notifications.length > 0 && (
                <div className="p-2 bg-gray-50 border-t text-center">
                  <button 
                    className="text-sm text-[#5D1D5F] hover:text-[#4A4215] font-medium"
                    onClick={() => setShowNotifications(false)}
                  >
                    إغلاق الإشعارات
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}