"use client";
import React, { useState, useEffect } from 'react';
import { useNews } from '../context/NewsContext';
import { Settings, Type, MapPin, Globe, Image as ImageIcon, MessageSquare, Share2, Save } from 'lucide-react';

// 81 İL LİSTESİ
const TURKEY_CITIES = [
  "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir",
  "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli",
  "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari",
  "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir",
  "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir",
  "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat", "Trabzon",
  "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman", "Kırıkkale",
  "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"
];

export default function SiteSettings() {
  const { siteSettings, updateSettings } = useNews();
  
  const [settingsForm, setSettingsForm] = useState({
    siteName: '', siteSuffix: '', logoText: '', weatherCity: '',
    seoTitle: '', seoDescription: '', seoKeywords: '', faviconUrl: '',
    footerDesc: '', contactAddress: '', contactPhone: '', contactEmail: '',
    socialFacebook: '', socialTwitter: '', socialInstagram: '', socialYoutube: '', copyrightText: ''
  });

  // Context'ten gelen verileri forma doldur
  useEffect(() => {
    if (siteSettings) {
      setSettingsForm(prev => ({...prev, ...siteSettings}));
    }
  }, [siteSettings]);

  // Input değiştiğinde state güncelle
  const handleSettingChange = (e) => {
    const { name, value } = e.target;
    setSettingsForm(prev => ({ ...prev, [name]: value }));
  };

  // Kaydetme işlemi
  const handleSettingsSave = (e) => {
    e.preventDefault();
    updateSettings(settingsForm);
    alert('Tüm site ayarları başarıyla güncellendi!');
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto pb-20">
      <h1 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-2">
        <Settings className="text-red-600" /> Site Genel Ayarları
      </h1>

      <form onSubmit={handleSettingsSave} className="space-y-8">
        
        {/* 1. Görsel Kimlik */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-lg text-gray-800 mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
            <Type size={20} className="text-gray-400" /> Görsel Kimlik
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Favicon URL</label>
              <div className="flex gap-4 items-center">
                <input type="text" name="faviconUrl" className="flex-1 border-2 border-gray-200 rounded-xl p-3 focus:border-red-600 focus:outline-none font-bold text-sm" placeholder="https://..." value={settingsForm.faviconUrl} onChange={handleSettingChange} />
                {settingsForm.faviconUrl && <div className="w-10 h-10 border rounded-lg flex items-center justify-center bg-gray-50 p-1"><img src={settingsForm.faviconUrl} className="w-6 h-6 object-contain" /></div>}
              </div>
            </div>
            <div><label className="block text-sm font-bold text-gray-700 mb-2">Site Adı</label><input type="text" name="siteName" className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-red-600 focus:outline-none font-bold" value={settingsForm.siteName} onChange={handleSettingChange} /></div>
            <div><label className="block text-sm font-bold text-gray-700 mb-2">Site Uzantısı</label><input type="text" name="siteSuffix" className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-red-600 focus:outline-none font-bold" value={settingsForm.siteSuffix} onChange={handleSettingChange} /></div>
            <div className="md:col-span-2"><label className="block text-sm font-bold text-gray-700 mb-2">Slogan</label><input type="text" name="logoText" className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-red-600 focus:outline-none font-medium" value={settingsForm.logoText} onChange={handleSettingChange} /></div>
          </div>
        </div>

        {/* 2. Footer & İletişim Ayarları */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-lg text-gray-800 mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
            <MessageSquare size={20} className="text-gray-400" /> Footer & İletişim Bilgileri
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Footer Açıklaması</label>
              <textarea rows="3" name="footerDesc" className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-red-600 focus:outline-none font-medium text-sm resize-none" value={settingsForm.footerDesc} onChange={handleSettingChange}></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-bold text-gray-700 mb-2">Adres</label><input type="text" name="contactAddress" className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-red-600 focus:outline-none font-medium text-sm" value={settingsForm.contactAddress} onChange={handleSettingChange} /></div>
              <div><label className="block text-sm font-bold text-gray-700 mb-2">Telefon</label><input type="text" name="contactPhone" className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-red-600 focus:outline-none font-medium text-sm" value={settingsForm.contactPhone} onChange={handleSettingChange} /></div>
              <div><label className="block text-sm font-bold text-gray-700 mb-2">E-posta</label><input type="text" name="contactEmail" className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-red-600 focus:outline-none font-medium text-sm" value={settingsForm.contactEmail} onChange={handleSettingChange} /></div>
              <div><label className="block text-sm font-bold text-gray-700 mb-2">Copyright Metni</label><input type="text" name="copyrightText" className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-red-600 focus:outline-none font-medium text-sm" value={settingsForm.copyrightText} onChange={handleSettingChange} /></div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100">
              <label className="block text-sm font-black text-gray-800 mb-3 flex items-center gap-2"><Share2 size={16}/> Sosyal Medya Linkleri</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="socialFacebook" placeholder="Facebook URL" className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-blue-600 focus:outline-none text-sm" value={settingsForm.socialFacebook} onChange={handleSettingChange} />
                <input type="text" name="socialTwitter" placeholder="Twitter (X) URL" className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-black focus:outline-none text-sm" value={settingsForm.socialTwitter} onChange={handleSettingChange} />
                <input type="text" name="socialInstagram" placeholder="Instagram URL" className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-pink-600 focus:outline-none text-sm" value={settingsForm.socialInstagram} onChange={handleSettingChange} />
                <input type="text" name="socialYoutube" placeholder="Youtube URL" className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-red-600 focus:outline-none text-sm" value={settingsForm.socialYoutube} onChange={handleSettingChange} />
              </div>
            </div>
          </div>
        </div>

        {/* 3. SEO Ayarları */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-lg text-gray-800 mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
            <Globe size={20} className="text-gray-400" /> SEO Yapılandırması
          </h3>
          <div className="space-y-4">
            <div><label className="block text-sm font-bold text-gray-700 mb-2">Site Başlığı (Title)</label><input type="text" name="seoTitle" className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-red-600 focus:outline-none font-bold" value={settingsForm.seoTitle} onChange={handleSettingChange} /></div>
            <div><label className="block text-sm font-bold text-gray-700 mb-2">Site Açıklaması (Description)</label><textarea rows="3" name="seoDescription" className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-red-600 focus:outline-none font-medium text-sm resize-none" value={settingsForm.seoDescription} onChange={handleSettingChange}></textarea></div>
            <div><label className="block text-sm font-bold text-gray-700 mb-2">Anahtar Kelimeler</label><input type="text" name="seoKeywords" className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-red-600 focus:outline-none font-medium text-sm" value={settingsForm.seoKeywords} onChange={handleSettingChange} /></div>
          </div>
        </div>

        {/* 4. Bölgesel Ayarlar */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-lg text-gray-800 mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
            <MapPin size={20} className="text-gray-400" /> Varsayılan Bölge
          </h3>
          <div className="max-w-md">
            <label className="block text-sm font-bold text-gray-700 mb-2">Hava Durumu & Namaz Vakti Şehri</label>
            <select name="weatherCity" className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-red-600 focus:outline-none font-bold" value={settingsForm.weatherCity} onChange={handleSettingChange}>
              {TURKEY_CITIES.map(city => <option key={city} value={city}>{city}</option>)}
            </select>
          </div>
        </div>

        <button type="submit" className="w-full bg-gray-900 text-white py-4 rounded-xl font-black hover:bg-gray-800 transition shadow-lg flex items-center justify-center gap-2"><Save size={20} /> AYARLARI KAYDET</button>
      </form>
    </div>
  );
}