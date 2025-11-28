"use client";
import React from 'react';
import { useNews } from '../context/NewsContext';
import { Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  const { siteSettings } = useNews();

  // Settings yüklenmemişse varsayılanları göster (Hydration error önlemek için opsiyonel)
  if (!siteSettings) return null;

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 border-t-8 border-red-600">
      <div className="container mx-auto px-6 lg:px-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* 1. KOLON: Logo ve Hakkında */}
          <div className="space-y-6">
            <div className="flex flex-col leading-none">
              <h2 className="text-5xl font-black tracking-tighter text-white">
                {siteSettings.siteName || "APAK"} <span className="text-red-600">/</span>
              </h2>
              <span className="text-gray-400 text-[10px] tracking-[0.3em] font-black ml-1">
                {siteSettings.siteSuffix || "HABER"}
              </span>
            </div>
            <p className="text-gray-400 text-sm font-bold leading-relaxed">
              {siteSettings.footerDesc || "Türkiye'nin ve dünyanın nabzını tutan, doğru, tarafsız ve hızlı haberciliğin yeni adresi."}
            </p>
            <div className="flex gap-4">
              {siteSettings.socialFacebook && <a href={siteSettings.socialFacebook} className="bg-gray-800 p-2 rounded-lg hover:bg-red-600 transition-colors"><Facebook size={20} /></a>}
              {siteSettings.socialTwitter && <a href={siteSettings.socialTwitter} className="bg-gray-800 p-2 rounded-lg hover:bg-red-600 transition-colors"><Twitter size={20} /></a>}
              {siteSettings.socialInstagram && <a href={siteSettings.socialInstagram} className="bg-gray-800 p-2 rounded-lg hover:bg-red-600 transition-colors"><Instagram size={20} /></a>}
              {siteSettings.socialYoutube && <a href={siteSettings.socialYoutube} className="bg-gray-800 p-2 rounded-lg hover:bg-red-600 transition-colors"><Youtube size={20} /></a>}
            </div>
          </div>

          {/* 2. KOLON: Kategoriler (Statik kalabilir veya istenirse dinamikleştirilir) */}
          <div>
            <h3 className="text-xl font-black mb-6 text-red-600 uppercase tracking-wider">Kategoriler</h3>
            <ul className="space-y-3 font-bold text-gray-300">
              <li><a href="#" className="hover:text-white hover:translate-x-2 transition-all inline-block">Gündem</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-2 transition-all inline-block">Ekonomi</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-2 transition-all inline-block">Spor</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-2 transition-all inline-block">Dünya</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-2 transition-all inline-block">Teknoloji</a></li>
            </ul>
          </div>

          {/* 3. KOLON: Kurumsal */}
          <div>
            <h3 className="text-xl font-black mb-6 text-red-600 uppercase tracking-wider">Kurumsal</h3>
            <ul className="space-y-3 font-bold text-gray-300">
              <li><a href="#" className="hover:text-white hover:translate-x-2 transition-all inline-block">Künye</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-2 transition-all inline-block">İletişim</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-2 transition-all inline-block">Gizlilik Politikası</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-2 transition-all inline-block">Çerez Politikası</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-2 transition-all inline-block">Reklam</a></li>
            </ul>
          </div>

          {/* 4. KOLON: İletişim */}
          <div>
            <h3 className="text-xl font-black mb-6 text-red-600 uppercase tracking-wider">Bize Ulaşın</h3>
            <div className="space-y-4 text-gray-300 font-bold text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="text-red-600 mt-1 shrink-0" size={18} />
                <span>{siteSettings.contactAddress || "Adres bilgisi girilmedi."}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-red-600 shrink-0" size={18} />
                <span>{siteSettings.contactPhone || "+90"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-red-600 shrink-0" size={18} />
                <span>{siteSettings.contactEmail || "info@example.com"}</span>
              </div>
            </div>
          </div>

        </div>

        {/* ALT ŞERİT */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 font-bold text-sm">
            {siteSettings.copyrightText || "© 2025 APAK HABER Yazılımı. Tüm hakları saklıdır."}
          </p>
          <div className="text-gray-600 text-xs font-bold tracking-widest">
            DESIGNED BY NEXUS
          </div>
        </div>
      </div>
    </footer>
  );
}