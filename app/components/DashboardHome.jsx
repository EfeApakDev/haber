"use client";
import React from 'react';
import { Cloud, Sun, RefreshCw, Moon, ArrowUp, ArrowDown, Users, FileText, MessageSquare, Bell, AlertCircle, X } from 'lucide-react';

export default function DashboardHome({ articles, rates, weather, prayerTimes, fetchDashboardData, apiStatus, siteSettings }) {
  
  // İstatistik Kartları
  const stats = [
    { title: 'Reklam', value: '9', color: 'text-white', bg: 'bg-[#FF004D]', icon: AlertCircle },
    { title: 'Haber', value: articles?.length > 0 ? articles.length : '1247', color: 'text-white', bg: 'bg-[#6F42C1]', icon: FileText },
    { title: 'Yorum', value: '120', color: 'text-white', bg: 'bg-[#FFC107]', icon: MessageSquare },
    { title: 'İleti', value: '12', color: 'text-white', bg: 'bg-[#343A40]', icon: Bell },
    { title: 'Üye', value: '9', color: 'text-white', bg: 'bg-[#00C292]', icon: Users },
  ];

  // Tarih Formatlama
  const today = new Date();
  const dateString = today.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });
  const dayName = today.toLocaleDateString('tr-TR', { weekday: 'long' });
  const timeString = today.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans text-gray-700">
      
      {/* Hoşgeldiniz Alanı */}
      <div className="bg-white p-10 rounded-sm shadow-sm text-center border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF004D] via-[#6F42C1] to-[#00C292]"></div>
        <h2 className="text-2xl text-gray-700 font-light mb-2">
          {siteSettings?.siteName || "TE"} İçerik Yönetim Sistemine Hoşgeldiniz v3.6
        </h2>
        <p className="text-gray-400 text-sm font-light italic">Aç kal, budala kal</p>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className={`${stat.bg} rounded-sm shadow-sm transform hover:scale-105 transition-transform duration-300 flex flex-col items-center justify-center h-32 relative overflow-hidden group cursor-pointer`}>
            <h3 className={`text-5xl font-light mb-0 ${stat.color}`}>{stat.value}</h3>
            <p className={`font-medium text-sm ${stat.color} opacity-90 mt-1`}>{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Widgetlar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Hava Durumu */}
        <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 h-80 flex flex-col justify-between relative group">
          <div className="flex justify-between items-start border-b border-gray-50 pb-2">
            <div>
               <h4 className="font-bold text-gray-600 text-sm">Hava Durumu</h4>
               <span className="text-xs text-gray-400">{weather?.city || 'İstanbul'}</span>
            </div>
            <div className="flex gap-2">
               <button onClick={() => fetchDashboardData && fetchDashboardData()} title="Yenile">
                 <RefreshCw size={14} className={`text-gray-300 hover:text-blue-500 ${apiStatus === 'loading' ? 'animate-spin' : ''}`}/>
               </button>
               <X size={14} className="text-gray-300 cursor-pointer hover:text-red-500"/>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-2">
             <div>
                <h2 className="text-4xl font-light text-gray-700">{dayName}</h2>
                <p className="text-xs text-gray-400 mt-1">{dateString} {timeString}</p>
             </div>
             <div className="text-right">
                <div className="flex items-center justify-end gap-2">
                   {weather?.desc?.includes('Bulut') ? <Cloud size={48} className="text-orange-400" /> : <Sun size={48} className="text-orange-400" />}
                   <span className="text-6xl font-light text-gray-700">{weather?.temp || 14}°C</span>
                </div>
                <p className="text-xs text-gray-400 mt-1 text-right">{weather?.desc || 'Az Bulutlu'}</p>
             </div>
          </div>

          <div className="grid grid-cols-4 gap-2 mt-4 text-center border-t border-gray-50 pt-4">
             {['Pzt', 'Sal', 'Çrş', 'Prş'].map((day, idx) => (
               <div key={day} className="flex flex-col items-center">
                  <span className="text-xs text-gray-500 mb-1">{day}</span>
                  <Sun size={20} className="text-orange-400 mb-1" />
                  <span className="text-lg font-light text-gray-700">{(weather?.temp || 14) + idx}°</span>
                  <span className="text-[9px] text-gray-400">Az Bulutlu</span>
               </div>
             ))}
          </div>
        </div>

        {/* Piyasalar */}
        <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 h-80 relative">
           <div className="flex justify-between items-center mb-4 border-b border-gray-50 pb-2">
             <h4 className="font-bold text-gray-600 text-sm">Piyasalar</h4>
             <div className="flex gap-2">
                <button onClick={() => fetchDashboardData && fetchDashboardData()}>
                  <RefreshCw size={14} className={`text-gray-300 hover:text-blue-500 ${apiStatus === 'loading' ? 'animate-spin' : ''}`}/>
                </button>
                <X size={14} className="text-gray-300 cursor-pointer hover:text-red-500"/>
             </div>
           </div>
           
           <div className="grid grid-cols-3 gap-y-6 gap-x-2 text-center">
              <div>
                 <div className="text-gray-400 font-serif font-bold text-xl mb-1">$</div>
                 <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">DOLAR</div>
                 <div className="text-xl font-light text-gray-600">{rates?.dollar || '14,69'}</div>
                 <div className="text-green-500 text-[10px] font-bold flex items-center justify-center gap-1">0.10% <ArrowUp size={8}/></div>
              </div>
              <div>
                 <div className="text-gray-400 font-serif font-bold text-xl mb-1">€</div>
                 <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">EURO</div>
                 <div className="text-xl font-light text-gray-600">{rates?.euro || '16,23'}</div>
                 <div className="text-red-500 text-[10px] font-bold flex items-center justify-center gap-1">-0.13% <ArrowDown size={8}/></div>
              </div>
              <div>
                 <div className="text-gray-400 font-serif font-bold text-xl mb-1">£</div>
                 <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">STERLİN</div>
                 <div className="text-xl font-light text-gray-600">19.29</div>
                 <div className="text-red-500 text-[10px] font-bold flex items-center justify-center gap-1">-0.02% <ArrowDown size={8}/></div>
              </div>
              <div>
                 <div className="text-gray-400 font-serif font-bold text-xl mb-1">❖</div>
                 <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">ALTIN</div>
                 <div className="text-xl font-light text-gray-600">909.14</div>
                 <div className="text-red-500 text-[10px] font-bold flex items-center justify-center gap-1">-0.50% <ArrowDown size={8}/></div>
              </div>
              <div>
                 <div className="text-gray-400 font-serif font-bold text-xl mb-1">📊</div>
                 <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">BORSA</div>
                 <div className="text-xl font-light text-gray-600">2.251,68</div>
                 <div className="text-green-500 text-[10px] font-bold flex items-center justify-center gap-1">0.82% <ArrowUp size={8}/></div>
              </div>
              <div>
                 <div className="text-gray-400 font-serif font-bold text-xl mb-1">₿</div>
                 <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">BITCOIN</div>
                 <div className="text-xl font-light text-gray-600">46.393</div>
                 <div className="text-red-500 text-[10px] font-bold flex items-center justify-center gap-1">-0.8% <ArrowDown size={8}/></div>
              </div>
           </div>
        </div>

        {/* Namaz Vakti */}
        <div className="bg-[#00C292] p-6 rounded-sm shadow-sm text-white h-80 flex flex-col justify-between relative overflow-hidden group">
            <div className="flex justify-between items-start z-10">
               <h4 className="font-bold text-sm">Namaz Vakti</h4>
               <span className="text-xs opacity-80">{weather?.city || 'İstanbul'}</span>
            </div>
            {prayerTimes ? (
              <div className="grid grid-cols-3 gap-y-8 gap-x-4 text-center z-10 mt-4">
                <div><div className="text-2xl mb-1">☁️</div><div className="text-[10px] uppercase opacity-80 font-bold mb-1">İmsak</div><div className="font-light text-xl">{prayerTimes.Imsak}</div></div>
                <div><div className="text-2xl mb-1">🌅</div><div className="text-[10px] uppercase opacity-80 font-bold mb-1">Güneş</div><div className="font-light text-xl">{prayerTimes.Sunrise}</div></div>
                <div><div className="text-2xl mb-1">☀️</div><div className="text-[10px] uppercase opacity-80 font-bold mb-1">Öğle</div><div className="font-light text-xl">{prayerTimes.Dhuhr}</div></div>
                <div><div className="text-2xl mb-1">⛅</div><div className="text-[10px] uppercase opacity-80 font-bold mb-1">İkindi</div><div className="font-light text-xl">{prayerTimes.Asr}</div></div>
                <div><div className="text-2xl mb-1">🌇</div><div className="text-[10px] uppercase opacity-80 font-bold mb-1">Akşam</div><div className="font-light text-xl">{prayerTimes.Maghrib}</div></div>
                <div><div className="text-2xl mb-1">🌙</div><div className="text-[10px] uppercase opacity-80 font-bold mb-1">Yatsı</div><div className="font-light text-xl">{prayerTimes.Isha}</div></div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full font-bold opacity-80">Vakitler Yükleniyor...</div>
            )}
            <div className="text-right text-[9px] opacity-50 mt-2 absolute bottom-4 right-4">Kaynak: Diyanet İşleri Başkanlığı, Turkey</div>
        </div>

      </div>
    </div>
  );
}