import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function MechanicsTab({ mechanics }) {
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // State for search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredMechanics, setFilteredMechanics] = useState(mechanics);

  // Apply filters and search
  useEffect(() => {
    let result = mechanics;
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(mechanic => 
        statusFilter === 'active' ? mechanic.available : !mechanic.available
      );
    }
    
    // Apply search
    if (searchTerm) {
      result = result.filter(mechanic => 
        mechanic.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mechanic.user?.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredMechanics(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [mechanics, statusFilter, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredMechanics.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMechanics.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  return (
    <div className="text-right" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">إدارة الميكانيكيين والورش</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <div className="p-4 flex justify-between items-center border-b border-gray-200">
          <div className="flex items-center">
            <select 
              className="border border-gray-300 rounded p-2 ml-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">كل الحالات</option>
              <option value="active">نشط</option>
              <option value="inactive">غير نشط</option>
            </select>
          </div>
          
          <div className="flex items-center border border-gray-300 rounded overflow-hidden bg-white">
            <input 
              type="text" 
              placeholder="بحث عن ميكانيكي..." 
              className="px-3 py-2 outline-none bg-transparent text-gray-800 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="px-3 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200">
              <Search size={18} />
            </button>
          </div>
        </div>
        
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 text-right text-gray-800 font-semibold">الاسم</th>
              <th className="py-3 px-4 text-right text-gray-800 font-semibold">الموقع</th>
              <th className="py-3 px-4 text-right text-gray-800 font-semibold">تاريخ التسجيل</th>
              <th className="py-3 px-4 text-right text-gray-800 font-semibold">الحالة</th>
              <th className="py-3 px-4 text-right text-gray-800 font-semibold">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map(mechanic => (
                <tr key={mechanic._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-800">{mechanic.user?.name || 'غير معروف'}</td>
                  <td className="py-3 px-4 text-gray-800">{mechanic.user?.location || 'غير محدد'}</td>
                  <td className="py-3 px-4 text-gray-800">{new Date(mechanic.createdAt).toLocaleDateString('ar-EG')}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      mechanic.available ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {mechanic.available ? 'نشط' : 'غير نشط'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button className="text-[#081840] hover:text-blue-800">تعديل</button>
                      <button className="text-red-600 hover:text-red-800 mr-2">حظر</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-4 text-center text-gray-600">
                  لا يوجد ميكانيكيين متطابقين مع معايير البحث
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        <div className="p-4 flex items-center justify-between border-t border-gray-200">
          <div>
            <p className="text-sm text-gray-600">
              عرض {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredMechanics.length)} من {filteredMechanics.length} ميكانيكي
            </p>
          </div>
          <div className="flex">
            <button 
              onClick={prevPage}
              disabled={currentPage === 1}
              className="border border-gray-300 rounded mr-1 px-3 py-1 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              السابق
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => paginate(pageNum)}
                  className={`border rounded mr-1 px-3 py-1 ${
                    currentPage === pageNum 
                      ? 'bg-[#081840] text-white border-blue-600' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button 
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="border border-gray-300 rounded px-3 py-1 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              التالي
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}