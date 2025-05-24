import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function PartsTab({ handlePartState }) {
  const [parts, setParts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchParts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:4000/api/admin/parts', {
        params: { page, limit: 10, search, state: stateFilter },
        withCredentials: true,
      });
      setParts(response.data.parts);
      setTotalPages(response.data.pages);
    } catch (error) {
      console.error('Error fetching parts:', error);
      toast.error(error.response?.data?.message || 'فشل جلب القطع');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParts();
  }, [page, search, stateFilter]);

  const handleDelete = async (partId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه القطعة؟')) return;
    try {
      await axios.delete(`http://localhost:4000/api/admin/parts/${partId}/soft-delete`, {
        withCredentials: true,
      });
      setParts(parts.filter(part => part._id !== partId));
      toast.success('تم حذف القطعة بنجاح');
    } catch (error) {
      console.error('Error deleting part:', error);
      toast.error(error.response?.data?.message || 'فشل حذف القطعة');
    }
  };

  const handleStateChange = async (partId, newState) => {
    try {
      await handlePartState(partId, newState);
      // تحديث الـ state محليًا
      setParts(parts.map(part => 
        part._id === partId ? { ...part, state: newState } : part
      ));
      // toast.success(`تم ${newState === 'approved' ? 'الموافقة على' : 'رفض'} القطعة`);
    } catch (error) {
      console.error('Error updating part state:', error);
      toast.error(error.response?.data?.message || 'فشل تحديث حالة القطعة');
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleStateFilter = (e) => {
    setStateFilter(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة قطع الغيار</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 flex justify-between items-center border-b">
          <div className="flex items-center">
            <select 
              value={stateFilter} 
              onChange={handleStateFilter} 
              className="border rounded p-2 ml-2"
            >
              <option value="">كل الحالات</option>
              <option value="pending">معلق</option>
              <option value="approved">مقبول</option>
              <option value="rejected">مرفوض</option>
            </select>
          </div>
          
          <div className="flex items-center border rounded overflow-hidden">
            <input 
              type="text" 
              placeholder="بحث عن قطعة..." 
              value={search}
              onChange={handleSearch}
              className="px-3 py-2 outline-none" 
            />
            <button className="bg-gray-100 px-3 py-2">
              <Search size={18} />
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="p-4 text-center">جارٍ التحميل...</div>
        ) : (
          <>
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-3 px-4 text-right">اسم القطعة</th>
                  <th className="py-3 px-4 text-right">السعر</th>
                  <th className="py-3 px-4 text-right">الحالة</th>
                  <th className="py-3 px-4 text-right">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {parts.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-3 px-4 text-center">لا توجد قطع</td>
                  </tr>
                ) : (
                  parts.map(part => (
                    <tr key={part._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{part.name}</td>
                      <td className="py-3 px-4">{part.price} دينار</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${part.state === 'approved' ? 'bg-green-100 text-green-800' : part.state === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                          {part.state === 'approved' ? 'مقبول' : part.state === 'pending' ? 'معلق' : 'مرفوض'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          {part.state === 'pending' ? (
                            <>
                              <button
                                onClick={() => handleStateChange(part._id, 'approved')}
                                className="text-green-500 hover:text-green-700"
                              >
                                موافقة
                              </button>
                              <button
                                onClick={() => handleStateChange(part._id, 'rejected')}
                                className="text-red-500 hover:text-red-700 mr-2"
                              >
                                رفض
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleStateChange(part._id, part.state === 'approved' ? 'rejected' : 'approved')}
                              className={`mr-2 ${part.state === 'approved' ? 'text-red-500 hover:text-red-700' : 'text-green-500 hover:text-green-700'}`}
                            >
                              {part.state === 'approved' ? 'رفض' : 'موافقة'}
                            </button>
                          )}
                  
                          <button
                            onClick={() => handleDelete(part._id)}
                            className="text-red-500 hover:text-red-700 mr-2"
                          >
                            حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            
            <div className="p-4 flex items-center justify-between border-t">
              <div>
                <p className="text-sm text-gray-500">
                  عرض {(page - 1) * 10 + 1} إلى {Math.min(page * 10, parts.length)} من {parts.length} قطعة
                </p>
              </div>
              <div className="flex">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="border rounded mr-1 px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
                >
                  السابق
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`border rounded mr-1 px-3 py-1 ${page === pageNum ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
                  >
                    {pageNum}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="border rounded px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
                >
                  التالي
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}