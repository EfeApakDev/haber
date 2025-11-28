"use client";
import React, { useState, useEffect } from 'react';
import { Tag, Trash2 } from 'lucide-react';

// Başlangıç Kategorileri (Eğer localStorage boşsa)
const DEFAULT_CATEGORIES = ['GÜNDEM', 'EKONOMİ', 'SPOR', 'DÜNYA', 'TEKNOLOJİ', 'KÜLTÜR', 'YAŞAM', 'YAZARLAR', 'MAGAZİN'];

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');

  // 1. Yükleme: LocalStorage'dan kategorileri çek
  useEffect(() => {
    const savedCats = localStorage.getItem('nexus_categories');
    if (savedCats) {
      setCategories(JSON.parse(savedCats));
    } else {
      setCategories(DEFAULT_CATEGORIES);
    }
  }, []);

  // 2. Kaydetme Fonksiyonu
  const saveCategories = (updatedCats) => {
    setCategories(updatedCats);
    localStorage.setItem('nexus_categories', JSON.stringify(updatedCats));
  };

  // Kategori Ekleme
  const addCategory = () => {
    if (!newCategory.trim()) return alert("Kategori adı boş olamaz.");
    
    const upperCat = newCategory.trim().toUpperCase();
    
    if (categories.includes(upperCat)) {
      return alert("Bu kategori zaten mevcut.");
    }

    const updatedCats = [...categories, upperCat];
    saveCategories(updatedCats);
    setNewCategory('');
    alert('Kategori başarıyla eklendi!');
  };

  // Kategori Silme
  const deleteCategory = (cat) => {
    if (confirm(`${cat} kategorisini silmek istediğinize emin misiniz?`)) {
      const updatedCats = categories.filter(c => c !== cat);
      saveCategories(updatedCats);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-gray-800 flex items-center gap-2">
          <Tag className="text-red-600" /> Kategori Yönetimi
        </h1>
        <span className="text-sm font-bold text-gray-500 bg-white px-3 py-1 rounded border">
          Toplam: {categories.length}
        </span>
      </div>

      {/* Ekleme Alanı */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Yeni Kategori Ekle</label>
        <div className="flex gap-4">
          <input 
            type="text" 
            placeholder="Örn: SAĞLIK" 
            className="flex-1 border-2 border-gray-200 p-3 rounded-xl font-bold uppercase focus:border-black outline-none transition-colors" 
            value={newCategory} 
            onChange={e => setNewCategory(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && addCategory()}
          />
          <button 
            onClick={addCategory} 
            className="bg-green-600 text-white px-8 py-3 rounded-xl font-black hover:bg-green-700 shadow-lg hover:shadow-xl transition-all active:scale-95"
          >
            EKLE
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 font-medium">
          * Kategoriler otomatik olarak büyük harfe çevrilir. Eklediğiniz kategoriler haber ekleme formunda görünecektir.
        </p>
      </div>

      {/* Kategori Listesi */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat, index) => (
          <div key={index} className="bg-white p-4 rounded-xl border border-gray-200 flex justify-between items-center shadow-sm hover:shadow-md hover:border-gray-300 transition-all group">
            <span className="font-black text-gray-700 text-sm tracking-wide">{cat}</span>
            <button 
              onClick={() => deleteCategory(cat)} 
              className="text-gray-300 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
              title="Kategoriyi Sil"
            >
              <Trash2 size={18}/>
            </button>
          </div>
        ))}
        
        {categories.length === 0 && (
          <div className="col-span-full text-center py-10 text-gray-400 font-medium italic">
            Henüz hiç kategori eklenmemiş.
          </div>
        )}
      </div>
    </div>
  );
}