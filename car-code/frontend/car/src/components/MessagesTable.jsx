import { useState } from 'react';
import { Mail } from 'lucide-react';

export default function MessagesTable({ contactMessages, handleReplyToMessage }) {
  const [replyForm, setReplyForm] = useState({ messageId: null, reply: '' });

  const handleReplyChange = (e) => {
    setReplyForm({ ...replyForm, reply: e.target.value });
  };

  const handleReplySubmit = (e, messageId) => {
    e.preventDefault();
    if (!replyForm.reply.trim()) {
      alert('الرد لا يمكن أن يكون فارغاً');
      return;
    }
    handleReplyToMessage(messageId, replyForm.reply);
    setReplyForm({ messageId: null, reply: '' });
  };

  return (
    <div className="mt-6 bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-bold mb-4 flex items-center">
        <Mail size={24} className="ml-2" />
        رسائل التواصل
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-3 px-4 text-right">الاسم</th>
              <th className="py-3 px-4 text-right">البريد الإلكتروني</th>
              <th className="py-3 px-4 text-right">الرسالة</th>
              <th className="py-3 px-4 text-right">التاريخ</th>
              <th className="py-3 px-4 text-right">الحالة</th>
              <th className="py-3 px-4 text-right">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {contactMessages.map(message => (
              <tr key={message._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{message.name}</td>
                <td className="py-3 px-4">{message.email}</td>
                <td className="py-3 px-4">{message.message.substring(0, 50)}...</td>
                <td className="py-3 px-4">{new Date(message.createdAt).toLocaleDateString('ar-EG')}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${message.status === 'replied' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {message.status === 'replied' ? 'تم الرد' : 'معلق'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {message.status === 'pending' ? (
                    replyForm.messageId === message._id ? (
                      <form onSubmit={(e) => handleReplySubmit(e, message._id)} className="flex flex-col gap-2">
                        <textarea
                          value={replyForm.reply}
                          onChange={handleReplyChange}
                          className="border rounded p-2"
                          rows="3"
                          placeholder="اكتب ردك هنا..."
                          required
                        />
                        <div className="flex gap-2">
                          <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                            إرسال
                          </button>
                          <button
                            type="button"
                            onClick={() => setReplyForm({ messageId: null, reply: '' })}
                            className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400"
                          >
                            إلغاء
                          </button>
                        </div>
                      </form>
                    ) : (
                      <button
                        onClick={() => setReplyForm({ messageId: message._id, reply: '' })}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        رد
                      </button>
                    )
                  ) : (
                    <span className="text-gray-500">{message.reply.substring(0, 30)}...</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
