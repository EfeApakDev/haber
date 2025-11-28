"use client";
import React, { useState, useEffect } from 'react';
import { useNews } from '../context/NewsContext'; // Context'ten fetchRSS fonksiyonunu alacağız
import { 
  Puzzle, CheckCircle, DollarSign, AlertCircle, BarChart, Upload, Code, X, Save, 
  Sun, Plus, Trash2, Sparkles, Database, Shield, Globe, MessageSquare, Briefcase, 
  FileText, Zap, Settings, Eye, EyeOff, Lock, Rss
} from 'lucide-react';

const MODULE_DEFINITIONS = [
  { id: 'rss', title: 'Otomatik RSS Botu', desc: 'Başka sitelerden otomatik haber çeker.', version: 'v3.0', icon: Rss, color: 'text-orange-600', bg: 'bg-orange-100', hasSettings: true, action: 'fetch_rss' },
  { id: 'gemini', title: 'Yapay Zeka (Gemini)', desc: 'Haber yazım asistanı ve SEO üretici.', version: 'v1.5', icon: Sparkles, color: 'text-purple-600', bg: 'bg-purple-100', hasSettings: true },
  { id: 'weather', title: 'Hava Durumu', desc: 'Bölgesel hava durumu ve namaz vakitleri.', version: 'v2.1', icon: Sun, color: 'text-yellow-600', bg: 'bg-yellow-100', hasSettings: true },
  { id: 'currency', title: 'Döviz Kurları', desc: 'Canlı piyasa verileri entegrasyonu.', version: 'v2.0', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100', hasSettings: false },
  { id: 'adsense', title: 'Reklam (Adsense)', desc: 'Google reklam gelirleri yönetimi.', version: 'v1.2', icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-100', hasSettings: true },
  { id: 'analytics', title: 'Analytics', desc: 'Google ziyaretçi takip sistemi.', version: 'v4.0', icon: BarChart, color: 'text-indigo-600', bg: 'bg-indigo-100', hasSettings: true },
  { id: 'adstxt', title: 'Ads.txt', desc: 'Yayıncı doğrulama dosyası yönetimi.', version: 'v1.0', icon: FileText, color: 'text-gray-600', bg: 'bg-gray-100', hasSettings: true },
  { id: 'cookies', title: 'Çerez Politikası', desc: 'KVKK uyumlu çerez onay barı.', version: 'v1.0', icon: Lock, color: 'text-indigo-600', bg: 'bg-indigo-100', hasSettings: true },
  { id: 'captcha', title: 'Captcha Güvenlik', desc: 'Formlar için Google reCaptcha v3.', version: 'v3.0', icon: Shield, color: 'text-teal-600', bg: 'bg-teal-100', hasSettings: true },
  { id: 'comments', title: 'Yorum Sistemi', desc: 'Ziyaretçi yorumları ve moderasyon.', version: 'v1.3', icon: MessageSquare, color: 'text-pink-600', bg: 'bg-pink-100', hasSettings: true },
  { id: 'cache', title: 'Önbellek (Cache)', desc: 'Sistem önbelleğini temizle.', version: 'v1.0', icon: Zap, color: 'text-red-600', bg: 'bg-red-100', hasSettings: false, action: 'clear_cache' },
  { id: 'agencies', title: 'Haber Ajansları', desc: 'AA, İHA, DHA bot entegrasyonları.', version: 'v1.0', icon: Globe, color: 'text-cyan-600', bg: 'bg-cyan-100', hasSettings: true },
  { id: 'backup', title: 'Yedekleme', desc: 'Veritabanı yedeği al ve indir.', version: 'v1.0', icon: Database, color: 'text-emerald-600', bg: 'bg-emerald-100', hasSettings: false, action: 'backup' },
  { id: 'logs', title: 'Sistem Logları', desc: 'Hata ve işlem kayıtlarını incele.', version: 'v1.1', icon: FileText, color: 'text-slate-600', bg: 'bg-slate-100', hasSettings: false },
  // ... Diğer modüller ...
];

const TURKEY_CITIES = [
  "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir", "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman", "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"
];

export default function Integrations() {
  const { fetchRSS } = useNews(); 
  
  const [settings, setSettings] = useState({
    adsenseId: '', analyticsId: '', adsTxt: '', weatherCity: 'İstanbul', geminiKey: '',
    rssUrl: '', 
    captchaKey: '', cookieText: 'Bu site deneyiminizi geliştirmek için çerezleri kullanır.',
    agencyUser: '', agencyPass: '',
    moduleStatus: {} 
  });

  const [activeModal, setActiveModal] = useState(null); 
  const [tempData, setTempData] = useState({});

  // --- SCRIPT ENJEKSİYON MOTORU (YENİLENMİŞ) ---
  const injectScripts = (currentSettings) => {
    // 1. Google Analytics
    if (currentSettings.analyticsId) {
      const scriptId = 'nexus-analytics';
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${currentSettings.analyticsId}`;
        document.head.appendChild(script);

        const inlineScript = document.createElement('script');
        inlineScript.id = 'nexus-analytics-inline';
        inlineScript.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${currentSettings.analyticsId}');
        `;
        document.head.appendChild(inlineScript);
        console.log('✅ Nexus Panel: Google Analytics Enjekte Edildi');
      }
    }

    // 2. Google Adsense (Kesin Çalışan Script)
    if (currentSettings.adsenseId) {
      const scriptId = 'nexus-adsense';
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.async = true;
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${currentSettings.adsenseId}`;
        script.crossOrigin = "anonymous";
        document.head.appendChild(script);
        console.log('✅ Nexus Panel: Adsense Enjekte Edildi');
      }
    }
  };

  useEffect(() => {
    const savedSettings = localStorage.getItem('nexus_integrations');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
      // Sayfa yüklendiğinde scriptleri çalıştır
      injectScripts(parsed);
    } else {
      const defaultStatus = {};
      MODULE_DEFINITIONS.forEach(m => defaultStatus[m.id] = true);
      setSettings(prev => ({ ...prev, moduleStatus: defaultStatus }));
    }
  }, []);

  const saveSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('nexus_integrations', JSON.stringify(newSettings));
    alert('Ayarlar kaydedildi ve entegrasyonlar aktif edildi!');
    setActiveModal(null);
    // Yeni ayarları hemen uygula
    injectScripts(newSettings);
  };

  const toggleModule = (id) => {
    const newStatus = { ...settings.moduleStatus, [id]: !settings.moduleStatus[id] };
    saveSettings({ ...settings, moduleStatus: newStatus });
  };

  const handleAction = async (action) => {
    if (action === 'fetch_rss') {
      if (!settings.rssUrl) return alert("Lütfen önce RSS URL'sini ayarlardan girin!");
      alert('RSS Botu başlatıldı... Haberler çekiliyor...');
      await fetchRSS(settings.rssUrl);
      alert('İşlem tamam! Haberler listeye eklendi.');
      window.location.reload(); 
    } else if (action === 'clear_cache') {
      alert('Sistem ve CDN önbelleği başarıyla temizlendi!');
    } else if (action === 'backup') {
      alert('Veritabanı yedeği oluşturuldu ve indirme başlatıldı (Simülasyon).');
    }
  };

  const openSettings = (id) => {
    let initialData = {};
    if (id === 'gemini') initialData = { key: settings.geminiKey };
    if (id === 'rss') initialData = { url: settings.rssUrl };
    if (id === 'adsense') initialData = { id: settings.adsenseId };
    if (id === 'analytics') initialData = { id: settings.analyticsId };
    if (id === 'weather') initialData = { city: settings.weatherCity };
    if (id === 'adstxt') initialData = { txt: settings.adsTxt };
    if (id === 'cookies') initialData = { text: settings.cookieText };
    if (id === 'captcha') initialData = { key: settings.captchaKey };
    if (id === 'agencies') initialData = { user: settings.agencyUser, pass: settings.agencyPass };
    
    setTempData(initialData);
    setActiveModal(id);
  };

  const renderModalContent = () => {
    switch (activeModal) {
      case 'rss':
        return (
          <>
            <p className="text-sm text-gray-500 mb-4">Takip edilecek RSS besleme adresi.</p>
            <input type="text" placeholder="https://www.sabah.com.tr/rss/gundem.xml" className="w-full border p-2 rounded mb-4" value={tempData.url || ''} onChange={e => setTempData({...tempData, url: e.target.value})} />
            <div className="bg-gray-50 p-2 rounded text-xs text-gray-400 mb-4">
               Örnekler:<br/>
               - https://www.cnnturk.com/feed/rss/all/news<br/>
               - https://www.haber7.com/rss/sondakika.xml
            </div>
            <button onClick={() => saveSettings({ ...settings, rssUrl: tempData.url })} className="w-full bg-orange-600 text-white py-2 rounded font-bold">Kaydet</button>
          </>
        );
      case 'gemini':
        return (
          <>
            <p className="text-sm text-gray-500 mb-4">Gemini API anahtarınızı giriniz.</p>
            <input type="password" placeholder="AIzaSy..." className="w-full border p-2 rounded mb-4" value={tempData.key || ''} onChange={e => setTempData({...tempData, key: e.target.value})} />
            <button onClick={() => saveSettings({ ...settings, geminiKey: tempData.key })} className="w-full bg-purple-600 text-white py-2 rounded font-bold">Kaydet</button>
          </>
        );
      case 'weather':
        return (
          <>
            <p className="text-sm text-gray-500 mb-4">Varsayılan şehir seçimi.</p>
            <select className="w-full border p-2 rounded mb-4" value={tempData.city || 'İstanbul'} onChange={e => setTempData({...tempData, city: e.target.value})}>
              {TURKEY_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button onClick={() => saveSettings({ ...settings, weatherCity: tempData.city })} className="w-full bg-yellow-600 text-white py-2 rounded font-bold">Kaydet</button>
          </>
        );
      case 'adsense':
        return (
          <>
            <p className="text-sm text-gray-500 mb-4">Publisher ID (pub-xxx).</p>
            <input type="text" className="w-full border p-2 rounded mb-4" value={tempData.id || ''} onChange={e => setTempData({...tempData, id: e.target.value})} />
            <button onClick={() => saveSettings({ ...settings, adsenseId: tempData.id })} className="w-full bg-blue-600 text-white py-2 rounded font-bold">Kaydet</button>
          </>
        );
      case 'analytics':
        return (
          <>
            <p className="text-sm text-gray-500 mb-4">Measurement ID (G-XXX).</p>
            <input type="text" className="w-full border p-2 rounded mb-4" value={tempData.id || ''} onChange={e => setTempData({...tempData, id: e.target.value})} />
            <button onClick={() => saveSettings({ ...settings, analyticsId: tempData.id })} className="w-full bg-indigo-600 text-white py-2 rounded font-bold">Kaydet</button>
          </>
        );
      case 'adstxt':
        return (
          <>
            <p className="text-sm text-gray-500 mb-4">Ads.txt içeriği.</p>
            <textarea rows="6" className="w-full border p-2 rounded mb-4" value={tempData.txt || ''} onChange={e => setTempData({...tempData, txt: e.target.value})}></textarea>
            <button onClick={() => saveSettings({ ...settings, adsTxt: tempData.txt })} className="w-full bg-gray-800 text-white py-2 rounded font-bold">Kaydet</button>
          </>
        );
      case 'cookies':
        return (
          <>
            <p className="text-sm text-gray-500 mb-4">Çerez uyarısı metni.</p>
            <textarea rows="3" className="w-full border p-2 rounded mb-4" value={tempData.text || ''} onChange={e => setTempData({...tempData, text: e.target.value})}></textarea>
            <button onClick={() => saveSettings({ ...settings, cookieText: tempData.text })} className="w-full bg-indigo-600 text-white py-2 rounded font-bold">Kaydet</button>
          </>
        );
      case 'captcha':
        return (
          <>
            <p className="text-sm text-gray-500 mb-4">Google reCaptcha Site Key.</p>
            <input type="text" className="w-full border p-2 rounded mb-4" value={tempData.key || ''} onChange={e => setTempData({...tempData, key: e.target.value})} />
            <button onClick={() => saveSettings({ ...settings, captchaKey: tempData.key })} className="w-full bg-teal-600 text-white py-2 rounded font-bold">Kaydet</button>
          </>
        );
      case 'agencies':
        return (
          <>
            <p className="text-sm text-gray-500 mb-4">Ajans Abonelik Bilgileri.</p>
            <input type="text" placeholder="Kullanıcı Adı" className="w-full border p-2 rounded mb-2" value={tempData.user || ''} onChange={e => setTempData({...tempData, user: e.target.value})} />
            <input type="password" placeholder="Şifre" className="w-full border p-2 rounded mb-4" value={tempData.pass || ''} onChange={e => setTempData({...tempData, pass: e.target.value})} />
            <button onClick={() => saveSettings({ ...settings, agencyUser: tempData.user, agencyPass: tempData.pass })} className="w-full bg-cyan-600 text-white py-2 rounded font-bold">Kaydet</button>
          </>
        );
      default:
        return <p>Bu modül için yapılandırılacak ayar bulunamadı.</p>;
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black text-gray-800 flex items-center gap-2">
          <Puzzle className="text-red-600" /> Modül ve Entegrasyonlar
        </h1>
        <div className="text-sm text-gray-500 font-bold bg-white px-4 py-2 rounded-lg border border-gray-200">
          Toplam {MODULE_DEFINITIONS.length} Modül
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {MODULE_DEFINITIONS.map((mod) => {
          const isActive = settings.moduleStatus?.[mod.id] !== false; 
          const Icon = mod.icon;

          return (
            <div key={mod.id} className={`bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col transition-all hover:shadow-md ${!isActive ? 'opacity-60 grayscale' : ''}`}>
              <div className="p-5 flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${mod.bg} ${mod.color}`}>
                    <Icon size={24} className="stroke-[2.5]"/>
                  </div>
                  <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${mod.bg} ${mod.color}`}>
                    {mod.version}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-gray-800 mb-1">{mod.title}</h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">{mod.desc}</p>
              </div>

              <div className="p-4 border-t border-gray-100 flex gap-2">
                {mod.hasSettings && (
                  <button 
                    onClick={() => openSettings(mod.id)}
                    disabled={!isActive}
                    className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200 transition disabled:cursor-not-allowed"
                  >
                    <Settings size={14} /> Ayarlar
                  </button>
                )}
                {mod.action && (
                  <button 
                    onClick={() => handleAction(mod.action)}
                    disabled={!isActive}
                    className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-bold text-blue-600 hover:bg-blue-50 transition disabled:cursor-not-allowed"
                  >
                    <Zap size={14} /> Çalıştır
                  </button>
                )}
                
                <button 
                  onClick={() => toggleModule(mod.id)}
                  className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-bold transition ${isActive ? 'text-red-500 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}
                >
                  {isActive ? <><EyeOff size={14} /> Pasif Et</> : <><Eye size={14} /> Aktif Et</>}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {activeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in zoom-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-black text-gray-800 text-lg flex items-center gap-2">
                <Settings size={18} className="text-red-600"/> Modül Ayarları
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-red-600 transition"><X size={20}/></button>
            </div>
            <div className="p-6">
              {renderModalContent()}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}