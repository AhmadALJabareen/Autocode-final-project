import { useState, useEffect } from 'react';
import { Bell, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';

export default function Notifications({ userId, setNotifications }) {
  const [notifications, setLocalNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const socket = io('http://localhost:4000', { withCredentials: true });

  console.log('Notifications component userId:', userId);

  useEffect(() => {
    if (!userId) {
      console.log('userId is undefined, cannot join socket');
      return;
    }

    socket.emit('join', userId);
    console.log('Emitted join for userId:', userId);

    socket.on('notification', (notification) => {
      console.log('Received notification:', notification);
      setLocalNotifications((prev) => [notification, ...prev]);
      setNotifications((prev) => prev + 1);
      toast.info(notification.message);
    });

    return () => {
      socket.disconnect();
      console.log('Socket disconnected');
    };
  }, [userId, setNotifications]);

  const markAsRead = (notificationId) => {
    setLocalNotifications((prev) =>
      prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
    );
    setNotifications((prev) => prev - 1);
    toast.success('تم تحديد الإشعار كمقروء');
  };

  return (
    <div className="relative">
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          console.log('Toggling isOpen:', !isOpen);
        }}
        className="relative focus:outline-none"
      >
        <Bell size={20} />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -left-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {notifications.filter((n) => !n.read).length}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="absolute top-8 left-0 bg-white shadow-lg rounded-lg w-64 max-h-96 overflow-y-auto z-[1000]">
          {notifications.length === 0 ? (
            <p className="p-4 text-gray-500">لا توجد إشعارات</p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-4 border-b ${notification.read ? 'bg-gray-50' : 'bg-white'}`}
              >
                <p className="text-sm">{notification.message}</p>
                <p className="text-xs text-gray-400">
                  {new Date(notification.createdAt).toLocaleString('ar-EG')}
                </p>
                {!notification.read && (
                  <button
                    onClick={() => markAsRead(notification._id)}
                    className="text-blue-600 text-xs mt-1"
                  >
                    <CheckCircle size={14} className="inline ml-1" />
                    تحديد كمقروء
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}