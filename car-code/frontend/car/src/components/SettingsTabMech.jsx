import { toast } from 'react-toastify';
import { useState } from 'react';
import axios from 'axios';

export default function SettingsTab() {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('كلمة المرور الجديدة غير متطابقة');
      return;
    }

    try {
      await axios.post(
        'http://localhost:4000/api/auth/change-password',
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        { withCredentials: true }
      );
      toast.success('تم تغيير كلمة المرور بنجاح');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل تغيير كلمة المرور');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">الإعدادات</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-bold mb-4">إعدادات التوفر</h3>
            <div className="space-y-4">
              <label className="flex items-center">
                <input type="checkbox" className="ml-2" defaultChecked />
                <span>إظهار حالة "متاح" للعملاء</span>
              </label>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">إعدادات الحساب</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-500 mb-1">لغة التطبيق</label>
                <select className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2">
                  <option>العربية</option>
                  <option>English</option>
                </select>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">تغيير كلمة المرور</h3>
            <form onSubmit={handlePasswordChange}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-500 mb-1">كلمة المرور الحالية</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, currentPassword: e.target.value })
                    }
                    placeholder="أدخل كلمة المرور الحالية"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">كلمة المرور الجديدة</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, newPassword: e.target.value })
                    }
                    placeholder="أدخل كلمة المرور الجديدة"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">تأكيد كلمة المرور الجديدة</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                    }
                    placeholder="تأكيد كلمة المرور الجديدة"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-6 rounded-lg mt-4 hover:bg-blue-700"
              >
                حفظ التغييرات
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}