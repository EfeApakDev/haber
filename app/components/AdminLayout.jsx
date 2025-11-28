"use client";
import React from 'react';
import { LayoutDashboard, FileText, Settings, Puzzle, LogOut, Tag } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children, activeView, setActiveView, handleLogout }) {
  
  const menuItems = [
    { id: 'dashboard', label: 'Kontrol Paneli', icon: LayoutDashboard },
    { id: 'list', label: 'Haber Listesi', icon: FileText },
    { id: 'categories', label: 'Kategoriler', icon: Tag },
    { id: 'settings', label: 'Site Ayarları', icon: Settings },
    { id: 'integrations', label: 'Entegrasyonlar', icon: Puzzle },
  ];

  return (
    <div className="min-h-screen bg-[#F4F7F6] font-sans flex text-gray-800">
      
      {/* SOL SIDEBAR */}
      <aside className="w-64 bg-[#212529] text-white fixed h-full z-20 hidden md:flex flex-col shadow-xl">
        <div className="p-6 border-b border-gray-700 flex items-center gap-2">
           <div className="w-3 h-3 rounded-full bg-red-500"></div>
           <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
           <h2 className="text-xl font-black tracking-tighter ml-2">APAK<span className="text-red-600">PANEL</span></h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => {
                // Fonksiyonun varlığını kontrol et ve çalıştır
                if (typeof setActiveView === 'function') {
                  setActiveView(item.id);
                } else {
                  console.error("setActiveView bir fonksiyon değil!", setActiveView);
                }
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all ${
                activeView === item.id 
                  ? 'bg-red-600 text-white shadow-lg translate-x-1' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white hover:translate-x-1'
              }`}
            >
              <item.icon size={20} /> {item.label}
            </button>
          ))}

          <div className="pt-6 pb-2 px-4 text-[10px] font-black text-gray-500 uppercase tracking-wider">Hızlı Erişim</div>
          <Link href="/" target="_blank" className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg font-bold transition hover:translate-x-1">
            <FileText size={20} /> Siteyi Görüntüle
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/20 rounded-lg font-bold transition hover:translate-x-1">
            <LogOut size={20} /> Çıkış Yap
          </button>
        </div>
      </aside>

      {/* ANA İÇERİK */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-x-hidden">
        {/* Üst Bar */}
        <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-500 flex items-center gap-2 uppercase text-sm tracking-wide">
            {/* Aktif menü öğesini bul ve ikonunu göster */}
            {menuItems.find(i => i.id === activeView)?.icon && React.createElement(menuItems.find(i => i.id === activeView).icon, { size: 18 })}
            {menuItems.find(i => i.id === activeView)?.label || 'Panel'}
          </h2>
          <div className="flex items-center gap-3">
             <div className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-black">v3.5 Pro</div>
             <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold">A</div>
          </div>
        </div>

        {/* ÇOCUK BİLEŞENLERİN RENDER EDİLDİĞİ YER */}
        <div className="min-h-[500px]">
           {children}
        </div>
        
      </main>
    </div>
  );
}