"use client";
import React, { useState } from 'react';
import { useNews } from '../context/NewsContext'; // Veritabanımızı çektik
import { LayoutDashboard, FileText, Trash2, Edit, Plus, X, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const { articles, deleteArticle, toggleStatus, addArticle } = useNews();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({ title: '', category: 'Gündem', image: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Resim girilmediyse varsayılan bir resim ata
    const imageToUse = formData.image || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1000";
    
    addArticle({ ...formData, image: imageToUse });
    setShowModal(false);
    setFormData({ title: '', category: 'Gündem', image: '' });
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col fixed h-full">
        <div className="p-6 border-b border-gray-800 font-bold text-xl tracking-wide flex items-center gap-2">
           <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">N</div>
           NEXUS
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <div className="flex items-center gap-3 bg-red-600 text-white p-3 rounded-lg cursor-pointer">
            <LayoutDashboard size={20} /> Kontrol Paneli
          </div>
        </nav>
        <div className="p-4">
            <button onClick={() => router.push('/')} className="text-gray-400 hover:text-white text-sm mb-4 block w-full text-left">← Siteye Dön</button>
            <button onClick={() => router.push('/login')} className="flex items-center gap-2 text-red-400 hover:text-red-300 w-full p-2">
                <LogOut size={16} /> Çıkış Yap
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Haber Yönetimi</h1>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition"
          >
            <Plus size={18} /> Yeni Haber Ekle
          </button>
        </div>

        {/* Haber Tablosu */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-900 font-semibold border-b border-gray-200">
              <tr>
                <th className="p-4">Görsel</th>
                <th className="p-4">Başlık</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Durum</th>
                <th className="p-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {articles.map((news) => (
                <tr key={news.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <img src={news.image} alt="" className="w-12 h-12 rounded object-cover" />
                  </td>
                  <td className="p-4 font-medium text-gray-900">{news.title}</td>
                  <td className="p-4"><span className="px-2 py-1 bg-gray-100 rounded text-xs">{news.category}</span></td>
                  <td className="p-4">
                    <button 
                      onClick={() => toggleStatus(news.id)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${news.status === 'Yayında' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
                    >
                      {news.status}
                    </button>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => deleteArticle(news.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {articles.length === 0 && <div className="p-8 text-center text-gray-500">Henüz hiç haber yok.</div>}
        </div>
      </main>

      {/* Haber Ekleme Modalı */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24}/></button>
            <h2 className="text-xl font-bold mb-6">Yeni Haber Ekle</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Haber Başlığı</label>
                <input 
                  required
                  type="text" 
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                 <select 
                   className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                   value={formData.category}
                   onChange={(e) => setFormData({...formData, category: e.target.value})}
                 >
                   <option>Gündem</option>
                   <option>Ekonomi</option>
                   <option>Spor</option>
                   <option>Teknoloji</option>
                   <option>Yaşam</option>
                 </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resim URL (Link)</label>
                <input 
                  type="text" 
                  placeholder="https://..."
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                />
                <p className="text-xs text-gray-400 mt-1">*Boş bırakırsan rastgele resim atanır.</p>
              </div>
              <button type="submit" className="w-full bg-red-600 text-white py-2.5 rounded-lg font-bold hover:bg-red-700 transition">Haberi Yayınla</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}