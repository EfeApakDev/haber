"use client";
import React, { useState, useEffect } from 'react';
import { useNews } from '../context/NewsContext'; // Context'i dahil ettik
import { Search, Clock, Sun, Cloud, CloudRain, TrendingUp, TrendingDown } from 'lucide-react';
import Link from 'next/link';

export default function Header({ searchTerm, setSearchTerm }) {
  // categories verisine güvenli erişim için (categories || []) kullanıldı.
  const { siteSettings, articles, categories } = useNews(); 
  const [time, setTime] = useState('');
  const [city, setCity] = useState('İstanbul'); 
  const [weather, setWeather] = useState({ temp: 0, desc: 'Açık' });
  const [rates, setRates] = useState({ usd: '...', eur: '...' });

  // Ticker (Son Dakika) Haberlerini Filtrele
  const tickerNews = articles?.filter(news => news.isTicker) || [];

  
  useEffect(() => {
    if (siteSettings?.weatherCity) {
      setCity(siteSettings.weatherCity);
      fetchWeather(siteSettings.weatherCity);
    }
  }, [siteSettings]);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch('https://finans.truncgil.com/v4/today.json');
        const data = await res.json();
        if(data) setRates({ usd: data.USD?.Selling, eur: data.EUR?.Selling });
      } catch(e){}
    };
    fetchRates();
    const interval = setInterval(fetchRates, 300000); 
    return () => clearInterval(interval);
  }, []);

  const fetchWeather = async (cityName) => {
    try {
        const normalizeCity = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ı/g, "i").replace(/İ/g, "I").replace(/ğ/g, "g").replace(/Ğ/g, "G").replace(/ü/g, "u").replace(/Ü/g, "U").replace(/ş/g, "s").replace(/Ş/g, "S").replace(/ö/g, "o").replace(/Ö/g, "O").replace(/ç/g, "c").replace(/Ç/g, "C");
        const apiCity = normalizeCity(cityName);
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${apiCity}&count=1&language=tr&format=json`);
        const geoData = await geoRes.json();
        if (geoData.results) {
          const { latitude, longitude } = geoData.results[0];
          const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
          const weatherData = await weatherRes.json();
          setWeather({ temp: Math.round(weatherData.current_weather.temperature), desc: 'Açık' });
        }
    } catch (e) {}
  };

  const getWeatherDesc = (code) => {
    if (code === 0) return "Açık";
    if (code >= 1 && code <= 3) return "Parçalı Bulutlu";
    if (code >= 45 && code <= 48) return "Sisli";
    if (code >= 51 && code <= 67) return "Yağmurlu";
    if (code >= 71 && code <= 77) return "Karlı";
    if (code >= 95) return "Fırtınalı";
    return "Bulutlu";
  };

  useEffect(() => {
    const updateTime = () => setTime(new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }));
    const i = setInterval(updateTime, 1000);
    return () => clearInterval(i);
  }, []);

  return (
    <>
      <style jsx>{`
        @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-scroll { display: flex; animation: scroll 40s linear infinite; }
        .animate-scroll:hover { animation-play-state: paused; }
      `}</style>

      {/* 1. ÜST HEADER */}
      <header className="bg-white pt-6 pb-2">
        <div className="w-full px-6 lg:px-12 flex items-center">
          <div className="flex items-center gap-4 mr-auto">
            <div className="flex flex-col leading-none">
              <h1 className="text-7xl font-black tracking-tighter text-gray-900">
                {siteSettings?.siteName || "APAK"} <span className="text-red-600">/</span>
              </h1>
              <span className="text-gray-600 text-[13px] tracking-[0.2em] font-black ml-1">
                {siteSettings?.siteSuffix || "HABER"}
              </span>
            </div>
            <div className="hidden md:block w-[2px] h-16 bg-gray-300 mx-5"></div>
            <span className="hidden md:block text-gray-500 text-lg font-bold tracking-tight">
              {siteSettings?.logoText || "Doğru Haberin Tek Adresi"}
            </span>
          </div>
        </div>
      </header>

      {/* 2. ALT HEADER (Menü) */}
      <nav className="bg-white shadow-sm sticky top-0 z-40 border-t-2 border-b-2 border-gray-100 py-2">
        <div className="w-full px-6 lg:px-12 flex items-center justify-between h-14">
          <div className="text-2xl font-black tracking-tighter text-gray-900 hidden lg:block w-auto pr-10">
            {siteSettings?.siteName}<span>{siteSettings?.siteSuffix}</span>
          </div>
          
          <ul className="flex-1 flex items-center justify-center gap-10 text-base font-black text-gray-800 uppercase whitespace-nowrap overflow-x-auto no-scrollbar md:overflow-visible">
            {/* DİNAMİK KATEGORİLER (Hata düzeltildi: categories || []) */}
            {(categories || []).map((cat) => (
                <li 
                    key={cat} 
                    onClick={() => setSearchTerm(cat === 'GÜNDEM' ? '' : cat)} 
                    className={`hover:text-red-600 cursor-pointer transition-colors 
                                ${searchTerm === cat.toLowerCase() || (searchTerm === '' && cat === 'GÜNDEM') ? 'text-red-600 border-b-4 border-red-600 py-1' : ''}`}
                >
                    {cat}
                </li>
            ))}
          </ul>

          <div className="hidden lg:flex justify-end w-auto pl-10">
            <div className="relative w-72">
               <input 
                  type="text" 
                  placeholder="HABER ARA..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-100 text-gray-900 text-xs font-bold rounded-full pl-10 pr-4 py-3 w-full transition-all focus:outline-none focus:ring-2 focus:ring-red-600 border-2 border-gray-200 placeholder-gray-500"
               />
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 stroke-[3]" />
            </div>
          </div>
        </div>
      </nav>

      {/* 3. PİYASA BANDI */}
      <div className="bg-red-600 text-white text-sm font-black py-4 border-b-4 border-red-800 overflow-hidden relative flex items-center h-20">
        
        <div className="absolute left-0 top-0 bottom-0 bg-red-800 z-10 px-8 lg:px-10 flex items-center shadow-xl border-r-2 border-red-900">
           <span className="text-white text-lg font-black tracking-widest drop-shadow-md">GÜNCEL</span>
        </div>
        
        <div className="w-full flex items-center overflow-hidden">
             <div className="animate-scroll flex items-center gap-16 pl-40 whitespace-nowrap">
                {[...Array(10)].map((_, i) => (
                  <React.Fragment key={i}>
                    <div className="flex items-center gap-3">
                      <span className="text-red-200 font-extrabold text-lg">DOLAR</span>
                      <span className="text-white text-2xl font-black">{rates.usd}</span>
                      <span className="flex items-center text-green-100 bg-black/20 px-2 py-1 rounded font-bold"><TrendingUp size={18} strokeWidth={3}/></span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-red-200 font-extrabold text-lg">EURO</span>
                      <span className="text-white text-2xl font-black">{rates.eur}</span>
                      <span className="flex items-center text-green-100 bg-black/20 px-2 py-1 rounded font-bold"><TrendingUp size={18} strokeWidth={3}/></span>
                    </div>
                    <div className="w-[2px] h-8 bg-red-400 opacity-50"></div>
                  </React.Fragment>
                ))}
             </div>
        </div>

        {/* SAĞ: HAVA DURUMU VE SAAT (DİNAMİK ŞEHİR) */}
        <div className="absolute right-0 top-0 bottom-0 bg-red-600 z-10 px-8 lg:px-16 hidden md:flex items-center gap-8 border-l-2 border-red-500 shadow-[-15px_0_30px_rgba(0,0,0,0.3)]">
            <div className="flex items-center gap-3">
              <Clock size={24} className="text-white stroke-[3]" />
              <span className="text-white font-black text-2xl tracking-widest drop-shadow-sm">{time}</span>
            </div>
            <div className="flex items-center gap-3">
              {getWeatherDesc(weather.code).includes('Bulut') ? <Cloud size={24} className="text-white stroke-[3]" /> : 
               getWeatherDesc(weather.code).includes('Yağmur') ? <CloudRain size={24} className="text-white stroke-[3]" /> : 
               <Sun size={24} className="text-yellow-300 animate-spin-slow stroke-[3]" />}
              
              <span className="text-white font-black text-2xl tracking-tight drop-shadow-sm uppercase">
                {city} {weather.temp}°C
              </span>
            </div>
        </div>
      </div>

      {/* 4. SON DAKİKA BANDI */}
      <div className="bg-gray-900 text-white py-4 overflow-hidden border-b-4 border-gray-800 h-16 flex items-center">
        <div className="w-full px-6 lg:px-12 flex items-center">
          <div className="bg-red-600 text-white text-sm font-black px-6 py-2 rounded-md mr-8 whitespace-nowrap animate-pulse shrink-0 z-10 shadow-lg border-2 border-red-500 tracking-wider">SON DAKİKA</div>
          <div className="overflow-hidden relative w-full mask-linear-fade">
             <div className="animate-scroll flex gap-20 whitespace-nowrap text-base font-bold opacity-100">
               {tickerNews.length > 0 ? (
                 [...tickerNews, ...tickerNews, ...tickerNews].map((news, i) => (
                   <Link href={`/haber/${news.id}`} key={i} className="flex items-center gap-4 text-gray-200 hover:text-white transition">
                     <span className="text-yellow-500 text-2xl">⚡</span> 
                     <span className="text-white font-black text-lg uppercase tracking-wide">{news.category}:</span> {news.title}
                   </Link>
                 ))
               ) : (
                 <span className="text-gray-400">Henüz son dakika haberi girilmedi.</span>
               )}
             </div>
          </div>
        </div>
      </div>
    </>
  );
}