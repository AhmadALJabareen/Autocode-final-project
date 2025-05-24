import { Star, Upload } from 'lucide-react';
import { toast } from 'react-toastify';
import { useState } from 'react';

export default function ProfileTab({ mechanic, updateProfile }) {
  const [imagePreview, setImagePreview] = useState(mechanic?.user?.image || '');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">الملف الشخصي</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="relative h-24 w-24 mx-auto mb-4">
              <img
                src={imagePreview || '/default-avatar.png'}
                alt="Profile"
                className="h-full w-full rounded-full object-cover"
              />
              <label
                htmlFor="image-upload"
                className="absolute bottom-0 left-0 bg-blue-600 text-white p-1 rounded-full cursor-pointer"
              >
                <Upload size={16} />
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>
            <h3 className="text-xl font-bold mb-1">{mechanic?.user?.name}</h3>
            <p className="text-gray-500 mb-4">فني ميكانيكا سيارات</p>
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={
                    i < Math.round(
                      mechanic?.ratings?.length
                        ? mechanic.ratings.reduce((sum, r) => sum + r.rating, 0) / mechanic.ratings.length
                        : 0
                    )
                      ? 'text-yellow-500 fill-yellow-500'
                      : 'text-gray-300'
                  }
                />
              ))}
              <span className="mr-1 text-sm text-gray-600">
                {mechanic?.ratings?.length
                  ? (mechanic.ratings.reduce((sum, r) => sum + r.rating, 0) / mechanic.ratings.length).toFixed(1)
                  : 'غير متاح'} ({mechanic?.ratings?.length || 0} تقييم)
              </span>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 mt-4">
            <h3 className="text-lg font-bold mb-4">ساعات العمل</h3>
            <div className="space-y-2">
              {mechanic?.workSchedule?.map((schedule, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span>{schedule.day}</span>
                  <span>{schedule.from} - {schedule.to}</span>
                </div>
              ))}
            </div>
            <button
              className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg w-full mt-4"
              onClick={() => {
                toast.info('ميزة تحرير ساعات العمل قيد التطوير');
              }}
            >
              تعديل ساعات العمل
            </button>
          </div>
        </div>
        <div className="col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold mb-4">المعلومات الشخصية</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData();
                formData.append('workshopName', e.target.workshopName.value);
                formData.append('user[name]', e.target.name.value);
                formData.append('user[email]', e.target.email.value);
                formData.append('user[phone]', e.target.phone.value);
                formData.append('user[location]', e.target.location.value);
                if (e.target.image.files[0]) {
                  formData.append('image', e.target.image.files[0]);
                }
                updateProfile(formData);
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-500 mb-1">الاسم الكامل</label>
                  <input
                    type="text"
                    name="name"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2"
                    defaultValue={mechanic?.user?.name}
                  />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    name="email"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2"
                    defaultValue={mechanic?.user?.email}
                  />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">رقم الهاتف</label>
                  <input
                    type="tel"
                    name="phone"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2"
                    defaultValue={mechanic?.user?.phone}
                  />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">اسم الورشة</label>
                  <input
                    type="text"
                    name="workshopName"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2"
                    defaultValue={mechanic?.workshopName}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-gray-500 mb-1">العنوان</label>
                  <input
                    type="text"
                    name="location"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2"
                    defaultValue={mechanic?.user?.location}
                  />
                </div>
                <input type="file" name="image" className="hidden" id="image-upload" />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded-lg mt-4 hover:bg-blue-700"
              >
                حفظ التغييرات
              </button>
            </form>
          </div>
          <div className="bg-white rounded-lg shadow p-6 mt-4">
            <h3 className="text-lg font-bold mb-4">التقييمات ({mechanic?.ratings?.length || 0})</h3>
            <div className="space-y-4">
              {mechanic?.ratings?.map(review => (
                <div key={review._id} className="border-b pb-4 last:border-0">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-semibold">{review.user.name}</div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-1">{review.comment || 'لا يوجد تعليق'}</p>
                  <p className="text-gray-400 text-sm">{new Date(review.createdAt).toLocaleDateString('ar-SA')}</p>
                </div>
              ))}
              {(!mechanic?.ratings || mechanic.ratings.length === 0) && (
                <p className="text-gray-500">لا توجد تقييمات بعد</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}