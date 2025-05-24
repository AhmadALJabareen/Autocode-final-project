import { Menu, X } from 'lucide-react';
import Notifications from '../components/Notifications';

export default function Header({ mechanic, isSidebarOpen, toggleSidebar, userId, setNotificationsCount }) {
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="md:hidden mr-4 text-gray-600">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <h2 className="text-xl font-semibold">{mechanic?.user?.name || 'مرحباً، الميكانيكي'}</h2>
        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mr-2">متاح</span>
      </div>
      <div className="flex items-center">
        <Notifications userId={userId} setNotificationsCount={setNotificationsCount} />
        <div className="h-8 w-8 rounded-full overflow-hidden mr-4">
          <img
            src={`http://localhost:4000${mechanic.user.image}`}
            alt="Profile"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}