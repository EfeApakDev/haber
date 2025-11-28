"use client";
import React, { useState, useEffect } from 'react';
import { useNews } from './context/NewsContext';
import Header from './components/Header'; 
import Footer from './components/Footer'; 
import { Clock, ChevronRight, User, TrendingUp, Eye } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { articles, siteSettings } = useNews();
  const [searchTerm, setSearchTerm] = useState('');
  const [adsenseId, setAdsenseId] = useState(null);

  // 1. ENTEGRASYON AYARLARINI ÇEK (Adsense ID)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedInt = localStorage.getItem('nexus_integrations');
      if (savedInt) {
        const parsed = JSON.parse(savedInt);
        // Eğer ID girilmişse state'e at
        if (parsed.adsenseId) setAdsenseId(parsed.adsenseId);
      }
    }
  }, []);
  
  // Arama Filtresi
  const filteredArticles = articles.filter(a => 
    a.status === 'Yayında' &&
    (a.title.toLowerCase().includes(searchTerm.toLocaleLowerCase('tr-TR')) || 
     a.category.toLowerCase().includes(searchTerm.toLocaleLowerCase('tr-TR')))
  );

  const headline = filteredArticles[0]; 
  const subHeadlines = filteredArticles.slice(1, 3); 
  const gridNews = filteredArticles.slice(3);

  // --- GELİŞMİŞ REKLAM BİLEŞENİ ---
  const AdCard = ({ type = "horizontal", className = "" }) => {
    // Adsense ID yoksa reklam alanını gizle (veya boş göster)
    if (!adsenseId) return null; 

    return (
      <div className={`bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-center p-4 overflow-hidden relative group transition-all hover:border-blue-300 ${className} ${type === 'vertical' ? 'min-h-[600px]' : 'min-h-[150px] md:min-h-[280px]'}`}>
         
         {/* Reklam Etiketi */}
         <div className="absolute top-0 right-0 bg-gray-300 text-[10px] font-bold text-gray-600 px-2 py-0.5 rounded-bl-lg z-10">
           REKLAM
         </div>
         
         {/* Google Adsense Kodu İçin Placeholder */}
         {/* Gerçek bir sitede buraya <ins ... /> etiketi gelir. */}
         <div className="relative z-0">
            <h4 className="text-gray-400 font-black text-xl mb-2">GOOGLE ADSENSE</h4>
            <div className="text-xs font-mono text-gray-500 bg-white p-2 rounded border border-gray-200">
               Yayıncı ID: <span className="text-blue-600 font-bold">{adsenseId}</span><br/>
               Alan Tipi: <span className="text-orange-600 font-bold">{type.toUpperCase()}</span>
            </div>
            <p className="text-[10px] text-gray-400 mt-2 max-w-xs mx-auto">
               (Bu alan entegrasyon ayarlarında girdiğiniz ID ile otomatik oluşturuldu. Canlı sitede burada gerçek reklamlar görünecektir.)
            </p>
         </div>

         {/* Görsel Efekt (Arkaplan) */}
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-10"></div>
      </div>
    );
  };

  // --- MODERN HABER KARTI (GÜNCELLENDİ) ---
  const NewsCard = ({ news }) => (
    <Link href={`/haber/${news.id}`} className="group block h-full">
      <div className="relative h-80 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
        
        {/* Arkaplan Resmi */}
        <img 
          src={news.image} 
          alt={news.title} 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Gradient Overlay (Yazı Okunabilirliği İçin) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>

        {/* Üst Etiketler */}
        <div className="absolute top-4 left-4 flex gap-2">
           <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
             {news.category}
           </span>
        </div>

        {/* Alt İçerik */}
        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-lg md:text-xl font-bold text-white leading-tight mb-3 line-clamp-2 group-hover:text-red-100 transition-colors">
            {news.title}
          </h3>
          
          <div className="flex items-center justify-between text-xs font-medium text-gray-300 border-t border-white/20 pt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
             <div className="flex items-center gap-2">
                <Clock size={14} className="text-red-500"/>
                <span>{news.date?.split('-')[1]?.trim() || '14:30'}</span>
             </div>
             <div className="flex items-center gap-1">
                <User size={14}/>
                <span className="uppercase truncate max-w-[100px]">{news.author || 'EDİTÖR'}</span>
             </div>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="font-sans text-gray-900 bg-[#F8F9FA] min-h-screen font-bold flex flex-col">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <main className="container mx-auto px-4 py-8 flex-grow">
        
        {headline ? (
          <>
            {/* 1. MANŞET BÖLÜMÜ */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
              {/* Dev Manşet */}
              <Link href={`/haber/${headline.id}`} className="lg:col-span-8 block group relative h-[400px] md:h-[550px] rounded-3xl overflow-hidden shadow-2xl">
                  <img src={headline.image} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
                  
                  <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                    <span className="bg-red-600 text-white text-sm font-black px-4 py-1.5 rounded-lg mb-4 inline-block shadow-lg">{headline.category}</span>
                    <h2 className="text-3xl md:text-5xl font-black text-white leading-tight drop-shadow-lg mb-2 group-hover:text-red-100 transition-colors">
                      {headline.title}
                    </h2>
                    <div className="flex items-center gap-4 text-gray-300 text-sm mt-4">
                       <span className="flex items-center gap-1"><Clock size={16}/> {headline.date?.split('-')[0]}</span>
                       <span className="flex items-center gap-1"><Eye size={16}/> {headline.views || 1205} Okunma</span>
                    </div>
                  </div>
              </Link>

              {/* Yan Manşetler */}
              <div className="lg:col-span-4 flex flex-col gap-6 h-[550px]">
                {subHeadlines.map((news) => (
                   <Link href={`/haber/${news.id}`} key={news.id} className="relative flex-1 rounded-2xl overflow-hidden shadow-lg group block">
                      <img src={news.image} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-6">
                        <span className="text-red-500 text-[10px] font-black uppercase mb-1 tracking-widest bg-black/50 px-2 py-0.5 rounded w-fit backdrop-blur-sm">{news.category}</span>
                        <h3 className="text-white font-bold text-lg leading-snug group-hover:underline decoration-2 underline-offset-4">{news.title}</h3>
                      </div>
                   </Link>
                ))}
              </div>
            </section>

            {/* REKLAM ALANI 1 (YATAY) */}
            <div className="mb-12">
               <AdCard type="horizontal" />
            </div>

            {/* 2. İÇERİK VE SIDEBAR */}
            <section className="grid grid-cols-1 lg:grid-cols-4 gap-10">
              
              {/* SOL KOLON (HABER AKIŞI) */}
              <div className="lg:col-span-3">
                <div className="flex items-center justify-between mb-8">
                   <div className="flex items-center gap-3">
                     <div className="h-10 w-2 bg-red-600 rounded-full"></div>
                     <h2 className="text-4xl font-black text-gray-900 tracking-tighter">GÜNÜN MANŞETLERİ</h2>
                   </div>
                   <button className="text-sm font-bold text-white bg-black px-4 py-2 rounded-full hover:bg-red-600 transition flex items-center gap-1">TÜMÜ <ChevronRight size={16}/></button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {gridNews.map((news, index) => (
                    <React.Fragment key={news.id}>
                      <NewsCard news={news} />
                      
                      {/* HER 4 HABERDE BİR REKLAM (Responsive uyumlu) */}
                      {(index + 1) % 6 === 0 && (
                         <div className="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-3">
                            <AdCard type="horizontal" className="my-0" />
                         </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
                
                {/* LİSTE SONU REKLAMI */}
                <div className="mt-8">
                  <AdCard type="horizontal" />
                </div>
              </div>

              {/* SAĞ KOLON (SIDEBAR) */}
              <aside className="space-y-8">
                 
                 {/* Çok Okunanlar Widget */}
                 <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
                    <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                       <TrendingUp className="text-red-600" />
                       <h3 className="text-xl font-black">ÇOK OKUNANLAR</h3>
                    </div>
                    
                    <div className="space-y-6">
                       {articles.slice(0, 5).map((item, i) => (
                          <Link href={`/haber/${item.id}`} key={item.id} className="flex gap-4 group items-start">
                             <span className="text-5xl font-black text-gray-100 group-hover:text-red-100 transition-colors -mt-2">{i+1}</span>
                             <div>
                                <h4 className="text-sm font-bold text-gray-800 leading-snug group-hover:text-red-600 transition-colors line-clamp-2">{item.title}</h4>
                                <span className="text-[10px] text-gray-400 font-bold mt-1 block uppercase">{item.category}</span>
                             </div>
                          </Link>
                       ))}
                    </div>

                    {/* SIDEBAR REKLAM */}
                    <div className="mt-8 pt-8 border-t border-gray-100">
                       <AdCard type="vertical" />
                    </div>
                 </div>

              </aside>

            </section>
          </>
        ) : (
          <div className="text-center py-40 bg-white rounded-3xl shadow-sm">
             <h2 className="text-3xl font-black text-gray-900 mb-2">İçerik Yükleniyor...</h2>
             <p className="text-gray-500">Sistemde henüz haber bulunmuyor veya yükleniyor.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}