"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useNews } from '../../context/NewsContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { Clock, User, Share2, Eye, Tag } from 'lucide-react';

export default function HaberDetay() {
  const params = useParams(); // URL'deki id'yi alır (örn: 101)
  const { getArticle, articles } = useNews();
  const [searchTerm, setSearchTerm] = useState(''); // Header için gerekli

  // Haber verisini al (useNews hook'u asenkron olabilir veya veri geç gelebilir, bu yüzden kontrol önemli)
  const news = getArticle ? getArticle(params.id) : null;

  // Bu haberi hariç tutarak diğer haberleri getir
  const otherNews = articles.filter(a => a.id.toString() !== params.id.toString()).slice(0, 4);

  // YÜKLENİYOR veya BULUNAMADI DURUMU
  if (!news) {
    return (
      <div className="font-sans text-gray-900 bg-gray-50 min-h-screen font-bold flex flex-col">
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
          <div className="animate-pulse mb-4">
            <div className="h-4 bg-gray-300 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-32"></div>
          </div>
          <h2 className="text-2xl text-gray-400 font-black">Haber yükleniyor veya bulunamadı...</h2>
          <Link href="/" className="mt-6 text-red-600 hover:underline">Anasayfaya Dön</Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Güvenli İçerik Erişimi (Hata Önleyici)
  // Haber var ama içeriği boşsa varsayılan metin ata.
  const safeContent = news.content || "Bu haberin detaylı içeriği hazırlanmaktadır. Lütfen daha sonra tekrar deneyiniz.";

  return (
    <div className="font-sans text-gray-900 bg-gray-50 min-h-screen font-bold flex flex-col">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <main className="container mx-auto px-4 py-8 flex-grow">
        
        {/* Breadcrumb (Yol Haritası) */}
        <div className="text-xs text-gray-500 mb-6 font-extrabold uppercase tracking-wide">
          <Link href="/" className="hover:text-red-600">ANASAYFA</Link> 
          <span className="mx-2">/</span> 
          <span className="text-red-600">{news.category}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* SOL TARAF: HABER İÇERİĞİ (8 Kolon) */}
          <article className="lg:col-span-8 bg-white p-8 rounded-3xl shadow-xl border-2 border-gray-100">
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
              {news.title}
            </h1>

            <div className="flex items-center justify-between border-b-2 border-gray-100 pb-6 mb-6">
              <div className="flex items-center gap-6 text-sm text-gray-500 font-bold">
                <div className="flex items-center gap-2">
                  <User size={18} className="text-red-600"/>
                  <span className="uppercase">{news.author || 'Editör'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-red-600"/>
                  <span>{news.date || 'Tarih Yok'}</span>
                </div>
              </div>
              <button className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full hover:bg-gray-200 transition text-sm font-black text-gray-600">
                <Share2 size={16} /> PAYLAŞ
              </button>
            </div>

            {/* Ana Görsel */}
            <div className="rounded-2xl overflow-hidden mb-8 shadow-lg">
              <img src={news.image} alt={news.title} className="w-full h-auto object-cover" />
            </div>

            {/* İçerik */}
            <div className="prose max-w-none text-lg leading-relaxed font-medium text-gray-700">
              {/* Özet (İlk 150 karakter) - substring hatası burada çözüldü */}
              <p className="font-black text-xl text-gray-900 mb-6 drop-shadow-sm">
                {safeContent.length > 150 ? safeContent.substring(0, 150) + "..." : safeContent}
              </p>
              
              {/* İçerik Arası Reklam */}
              <div className="my-8 bg-gray-100 border-2 border-dashed border-gray-300 p-8 text-center rounded-xl">
                <span className="text-xs font-bold text-gray-400 border border-gray-400 px-2 py-0.5 rounded mb-2 inline-block">REKLAM</span>
                <h4 className="text-gray-500 font-bold text-xl">Google Adsense (Haber İçi)</h4>
              </div>

              <div className="whitespace-pre-wrap">
                {/* Metnin tamamı */}
                {safeContent}
              </div>
              
              <div className="mt-8 text-gray-400 text-sm italic">
                 <br/>
                 Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                 Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </div>
            </div>
          </article>

          {/* SAĞ TARAF: SİDEBAR (4 Kolon) */}
          <aside className="lg:col-span-4 space-y-8">
            
            {/* Sidebar Reklam */}
            <div className="bg-gray-200 h-[300px] rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-bold text-gray-400 border border-gray-400 px-2 py-0.5 rounded mb-2">REKLAM</span>
              <h4 className="text-gray-500 font-bold">Kare Reklam (300x250)</h4>
            </div>

            {/* İlgili Haberler */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-6 w-1.5 bg-red-600 rounded-full"></div>
                <h3 className="text-xl font-black">DİĞER HABERLER</h3>
              </div>
              
              <div className="space-y-6">
                {otherNews.map((item) => (
                  <Link href={`/haber/${item.id}`} key={item.id} className="flex gap-4 group cursor-pointer">
                    <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden shadow-sm">
                      <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                       <span className="text-[10px] font-black text-red-600 uppercase block mb-1">{item.category}</span>
                       <h4 className="text-sm font-bold leading-tight group-hover:text-red-600 transition-colors line-clamp-3">
                         {item.title}
                       </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* ALT: İLGİNİZİ ÇEKEBİLİR */}
        <section className="mt-16 border-t-4 border-gray-200 pt-10">
           <h3 className="text-3xl font-black mb-8">BUNLARI DA OKUYUN</h3>
           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {otherNews.map((item) => (
                 <Link href={`/haber/${item.id}`} key={item.id} className="group">
                    <div className="relative h-48 rounded-2xl overflow-hidden mb-4 shadow-md">
                       <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                       <div className="absolute top-0 left-0 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-br-lg uppercase">
                         {item.category}
                       </div>
                    </div>
                    <h4 className="font-bold text-lg leading-tight group-hover:text-red-600 transition-colors">
                      {item.title}
                    </h4>
                 </Link>
              ))}
           </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}