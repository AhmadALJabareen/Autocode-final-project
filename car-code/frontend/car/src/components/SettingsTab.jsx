export default function SettingsTab({ admin, handleProfilePicUpload, handlePasswordChange }) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">الإعدادات</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">إعدادات النظام</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">الصورة الشخصية</h3>
            <div className="flex items-center space-x-4">
              <div className="h-20 w-20 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold overflow-hidden">
                {admin?.image ? (
                  <img src={`http://localhost:4000${admin.image}`} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span>{admin?.name?.[0] || 'أ'}</span>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePicUpload}
                className="border rounded p-2"
              />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">تغيير كلمة المرور</h3>
            <form onSubmit={handlePasswordChange}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">كلمة المرور الحالية</label>
                  <input
                    type="password"
                    name="currentPassword"
                    className="mt-1 block w-full border rounded p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">كلمة المرور الجديدة</label>
                  <input
                    type="password"
                    name="newPassword"
                    className="mt-1 block w-full border rounded p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">تأكيد كلمة المرور</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="mt-1 block w-full border rounded p-2"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="mt-4 bg-[#081840] text-white px-6 py-2 rounded hover:bg-blue-800"
              >
                تغيير كلمة المرور
              </button>
            </form>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">إعدادات الإشعارات</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="ml-2" defaultChecked />
                <span>إرسال إشعارات إضافة قطع الغيار</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="ml-2" defaultChecked />
                <span>إرسال إشعارات تسجيل المستخدمين</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="ml-2" />
                <span>إرسال تقارير الإيرادات الأسبوعية</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}