"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useNews } from '../context/NewsContext';
import Integrations from '../components/Integrations'; // DIŞARIDAN GELEN TEK DOSYA
import SiteSettings from '../components/SiteSettings'; // DIŞARIDAN GELEN TEK DOSYA
import CategoryManager from '../components/CategoryManager'; // DIŞARIDAN GELEN TEK DOSYA
import { 
  LayoutDashboard, Plus, Trash2, LogOut, Eye, FileText, Lock, X, CheckCircle, 
  Sun, Puzzle, RefreshCw, Moon, Cloud, Settings, Sparkles, Image as LucideImage, Megaphone,
  Edit, CheckSquare, Square, Search, Tag, Users, MessageSquare, AlertCircle, ArrowUp, ArrowDown
} from 'lucide-react';
import Link from 'next/link';

export default function AdminPanel() {
  const { articles, addArticle, deleteArticle, toggleStatus, siteSettings } = useNews();
  
  // --- STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeView, setActiveView] = useState('dashboard');
  
  // Liste & Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedNews, setSelectedNews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Kategori Yönetimi
  const [categories, setCategories] = useState(['GÜNDEM', 'EKONOMİ', 'SPOR', 'DÜNYA', 'TEKNOLOJİ', 'KÜLTÜR', 'YAŞAM', 'YAZARLAR', 'MAGAZİN']);
  const [newCategory, setNewCategory] = useState('');

  // Dashboard Data
  const [rates, setRates] = useState({ dollar: '...', euro: '...' });
  const [weather, setWeather] = useState({ temp: 14, desc: 'Az Bulutlu', city: 'İstanbul' });
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [apiStatus, setApiStatus] = useState('idle'); 

  // FORM DATA
  const [formData, setFormData] = useState({
    id: null, title: '', category: 'GÜNDEM', author: 'Admin', image: '', content: '',
    seoTitle: '', seoDescription: '', isTicker: false
  });
  const [isGeneratingSEO, setIsGeneratingSEO] = useState(false);

  // --- ETKİLER (EFFECTS) ---
  useEffect(() => {
    if (typeof window !== 'undefined') {
       if (localStorage.getItem('admin_auth') === 'true') setIsAuthenticated(true);
    
       const savedCats = localStorage.getItem('nexus_categories');
       if (savedCats) setCategories(JSON.parse(savedCats));
    }

    if (siteSettings?.weatherCity) {
      setWeather(prev => ({ ...prev, city: siteSettings.weatherCity }));
    }
  }, [siteSettings]);

  // --- FONKSİYONLAR ---

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'efeapak') {
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', 'true');
      setError('');
    } else {
      setError('Hatalı şifre!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_auth');
  };

  // Dashboard Veri Çekme (API)
  const fetchDashboardData = useCallback(async () => {
    setApiStatus('loading');
    try {
      const resRate = await fetch('https://finans.truncgil.com/v4/today.json');
      const dataRate = await resRate.json();
      if(dataRate) setRates({ dollar: dataRate.USD.Selling, euro: dataRate.EUR.Selling });

      const city = siteSettings?.weatherCity || 'İstanbul';
      const normalizeCity = (str) => {
        if (!str) return "";
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ı/g, "i").replace(/İ/g, "I").replace(/ğ/g, "g").replace(/Ğ/g, "G").replace(/ü/g, "u").replace(/Ü/g, "U").replace(/ş/g, "s").replace(/Ş/g, "S").replace(/ö/g, "o").replace(/Ö/g, "O").replace(/ç/g, "c").replace(/Ç/g, "C");
      }
      const apiCity = normalizeCity(city);

      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${apiCity}&count=1&language=tr&format=json`);
      const geoData = await geoRes.json();
      if (geoData.results) {
        const { latitude, longitude } = geoData.results[0];
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
        const weatherData = await weatherRes.json();
        setWeather(prev => ({ 
           ...prev,
           temp: Math.round(weatherData.current_weather.temperature), 
           desc: 'Az Bulutlu', // Varsayılanı Az Bulutlu yapalım
           city 
        }));
      }

      const prayerRes = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${apiCity}&country=Turkey&method=13`);
      const prayerData = await prayerRes.json();
      if (prayerData.data) setPrayerTimes(prayerData.data.timings);
      
      setApiStatus('success');
    } catch (e) { 
      setApiStatus('error');
    }
  }, [siteSettings]);

  useEffect(() => { if (isAuthenticated) fetchDashboardData(); }, [isAuthenticated, fetchDashboardData]);

  // Haber İşlemleri
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, image: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.id) deleteArticle(formData.id);
    
    addArticle({ 
      ...formData, 
      image: formData.image || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1000",
      date: formData.date || new Date().toLocaleDateString() + ' - ' + new Date().toLocaleTimeString()
    });
    
    setShowModal(false);
    setFormData({ title: '', category: 'GÜNDEM', author: 'Admin', image: '', content: '', seoTitle: '', seoDescription: '', isTicker: false, id: null });
    alert(formData.id ? 'Haber güncellendi!' : 'Haber eklendi!');
    setActiveView('list');
  };

  const openEditModal = (news) => {
    setFormData({ ...news });
    setShowModal(true);
  };

  // GEMINI SEO
  const generateSEO = async () => {
    if (!formData.title && !formData.content) return alert("Başlık veya içerik giriniz.");
    
    let apiKey = siteSettings?.geminiKey;
    if (!apiKey && typeof window !== 'undefined') {
        const storedInt = localStorage.getItem('nexus_integrations');
        if (storedInt) apiKey = JSON.parse(storedInt).geminiKey;
    }
    
    if (!apiKey) return alert("HATA: Gemini API Anahtarı bulunamadı!");

    setIsGeneratingSEO(true);
    try {
      const prompt = `Sen bir haber editörüsün. Aşağıdaki haber için SEO uyumlu, dikkat çekici bir başlık (title) ve kısa açıklama (description) yaz.
      Haber: ${formData.title}
      İçerik: ${formData.content.substring(0, 800)}
      Yanıtı SADECE JSON formatında ver: {"title": "...", "description": "..."}`;
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      
      const data = await response.json();
      if (data.error) throw new Error(data.error.message);

      let text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if(!text) throw new Error("Boş yanıt.");
      
      const result = JSON.parse(text.replace(/```json|```/g, '').trim());
      
      setFormData(prev => ({ 
          ...prev, 
          seoTitle: result.title, 
          seoDescription: result.description 
      }));
      alert("SEO Oluşturuldu!");

    } catch (e) { 
        alert("Hata oluştu: " + e.message); 
    } finally { 
        setIsGeneratingSEO(false); 
    }
  };

  // Kategori Yönetimi
  const addCategory = () => {
    if (newCategory && !categories.includes(newCategory.toUpperCase())) {
      const updatedCats = [...categories, newCategory.toUpperCase()];
      setCategories(updatedCats);
      localStorage.setItem('nexus_categories', JSON.stringify(updatedCats));
      setNewCategory('');
      alert('Kategori eklendi!');
    }
  };

  const deleteCategory = (cat) => {
    if (confirm(`${cat} kategorisini silmek istediğinize emin misiniz?`)) {
      const updatedCats = categories.filter(c => c !== cat);
      setCategories(updatedCats);
      localStorage.setItem('nexus_categories', JSON.stringify(updatedCats));
    }
  };


  // TOPLU SİLME İŞLEMLERİ
  const deleteSelected = () => {
    if (confirm(`${selectedNews.length} haberi silmek istiyor musunuz?`)) {
      selectedNews.forEach(id => deleteArticle(id));
      setSelectedNews([]);
    }
  };

  const toggleSelect = (id) => {
    if (selectedNews.includes(id)) setSelectedNews(selectedNews.filter(item => item !== id));
    else setSelectedNews([...selectedNews, id]);
  };

  const selectAll = () => {
    if (selectedNews.length === articles.length) setSelectedNews([]);
    else setSelectedNews(articles.map(a => a.id));
  };


  // --- İÇ GÖRÜNÜM BİLEŞENLERİ ---

  const DashboardView = () => {
      const today = new Date();
      const dateString = today.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });
      const dayName = today.toLocaleDateString('tr-TR', { weekday: 'long' });
      const timeString = today.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

      const mockNews = articles.slice(0, 5); 

      // İstatistik Kartları (Kırmızı kart silindi, kalanlar kaydırıldı)
      const stats = [
        { title: 'Haber', value: articles.length.toString(), color: 'text-white', bg: 'bg-[#6F42C1]', icon: FileText },
        { title: 'Yorum', value: '120', color: 'text-white', bg: 'bg-[#FFC107]', icon: MessageSquare },
        { title: 'Okunmamış İleti', value: '12', color: 'text-white', bg: 'bg-[#343A40]', icon: AlertCircle },
        { title: 'Üye', value: '9', color: 'text-white', bg: 'bg-[#00C292]', icon: Users },
      ];


      return (
        <div className="space-y-8 animate-in fade-in duration-500 font-sans">
          
          {/* İstatistik Kartları */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
               <div key={i} className={`${stat.bg} rounded-xl p-6 text-white text-center shadow-lg`}>
                  <h3 className="text-4xl font-black mb-1">{stat.value}</h3>
                  <p className="font-bold text-sm opacity-90">{stat.title}</p>
               </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-80">
              <div className="flex justify-between items-start border-b border-gray-50 pb-2"><h4 className="font-bold text-gray-700 text-sm">Hava Durumu</h4><span className="text-xs text-gray-400">{weather.city}</span></div>
              <div className="flex items-center justify-between mt-4"><div><h2 className="text-4xl font-light text-gray-700">{dayName}</h2><p className="text-xs text-gray-400 mt-1">{dateString} {timeString}</p></div><div className="text-right"><div className="flex items-center justify-end gap-2"><Sun size={48} className="text-orange-400" /><span className="text-6xl font-light text-gray-700">{weather.temp}°C</span></div><p className="text-xs text-gray-400 mt-1 text-right">{weather.desc}</p></div></div>
              <div className="grid grid-cols-4 gap-2 mt-4 text-center border-t border-gray-50 pt-4">
                {['Pzt', 'Sal', 'Çrş', 'Prş'].map((day, idx) => (<div key={day} className="flex flex-col items-center"><span className="text-xs text-gray-500 mb-1">{day}</span><Sun size={20} className="text-orange-400 mb-1" /><span className="text-lg font-light text-gray-700">{weather.temp + idx}°</span><span className="text-[9px] text-gray-400">Az Bulutlu</span></div>))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-80 relative">
              <div className="flex justify-between items-center mb-6 border-b border-gray-50 pb-2"><h4 className="font-bold text-gray-700 text-sm">Canlı Piyasalar</h4><button onClick={() => fetchDashboardData()} className="text-gray-400 hover:text-red-600 transition"><RefreshCw size={16} className={apiStatus === 'loading' ? 'animate-spin' : ''}/></button></div>
              <div className="grid grid-cols-2 gap-y-6 gap-x-2 text-center">
                 <div><div className="text-gray-400 font-serif font-bold text-xl mb-1">$</div><div className="text-[10px] font-bold text-gray-400 uppercase mb-1">DOLAR</div><div className="text-xl font-light text-gray-600">{rates.dollar}</div><div className="text-green-500 text-[10px] font-bold flex items-center justify-center gap-1">0.10% <ArrowUp size={8}/></div></div>
                 <div><div className="text-gray-400 font-serif font-bold text-xl mb-1">€</div><div className="text-[10px] font-bold text-gray-400 uppercase mb-1">EURO</div><div className="text-xl font-light text-gray-600">{rates.euro}</div><div className="text-red-500 text-[10px] font-bold flex items-center justify-center gap-1">-0.13% <ArrowDown size={8}/></div></div>
              </div>
            </div>

            {prayerTimes && (
              <div className="bg-[#00C292] p-6 rounded-xl shadow text-white h-80">
                <h4 className="font-bold mb-4 flex items-center gap-2"><Moon size={20}/> Namaz Vakitleri ({weather.city})</h4>
                <div className="grid grid-cols-6 gap-2 text-center text-sm font-bold">
                  <div>İmsak<br/>{prayerTimes.Imsak}</div>
                  <div>Güneş<br/>{prayerTimes.Sunrise}</div>
                  <div>Öğle<br/>{prayerTimes.Dhuhr}</div>
                  <div>İkindi<br/>{prayerTimes.Asr}</div>
                  <div>Akşam<br/>{prayerTimes.Maghrib}</div>
                  <div>Yatsı<br/>{prayerTimes.Isha}</div>
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-8">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white"><h3 className="font-bold text-gray-600 flex items-center gap-2 text-sm"><FileText size={16} /> Son Haberler</h3><div className="flex gap-2 text-gray-400"><RefreshCw size={14} className="cursor-pointer hover:text-blue-500"/></div></div>
             <table className="w-full text-left text-xs">
               <thead className="bg-gray-50 text-gray-400 font-bold border-b border-gray-100 uppercase"><tr><th className="p-3 w-16 text-center">GÖRSEL</th><th className="p-3">BAŞLIK</th><th className="p-3">KATEGORİLER</th><th className="p-3 text-center">DURUM</th><th className="p-3 text-right">OLUŞTURMA</th></tr></thead>
               <tbody className="divide-y divide-gray-100 text-gray-600">
                  {mockNews.map((news) => (<tr key={news.id} className="hover:bg-blue-50 transition-colors group"><td className="p-3 text-center"><div className="w-8 h-6 bg-gray-200 rounded mx-auto flex items-center justify-center text-gray-400 overflow-hidden"><img src={news.image || "https://placehold.co/60x60/f0f0f0/cccccc?text=N"} className="w-full h-full object-cover" /></div></td><td className="p-3 font-bold text-gray-700">{news.title}</td><td className="p-3 text-gray-400">{news.category}</td><td className="p-3 text-center"><span className={`px-2 py-1 rounded text-white text-[10px] font-bold ${news.status === 'Taslak' ? 'bg-red-600' : 'bg-green-600'}`}>{news.status}</span></td><td className="p-3 text-right text-gray-400">{news.date}</td></tr>))}
               </tbody>
            </table>
          </div>
        </div>
      );
    };

  const NewsListView = () => {
    const filteredArticles = articles.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()));
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <h1 className="text-2xl font-black text-gray-800 whitespace-nowrap">Haber Listesi</h1>
            <div className="relative w-full md:w-64">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
               <input type="text" placeholder="Haber ara..." className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto justify-end">
            {selectedNews.length > 0 && (
              <button onClick={deleteSelected} className="bg-red-100 text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-200 flex items-center gap-2 transition">
                <Trash2 size={18} /> ({selectedNews.length}) Sil
              </button>
            )}
            <button onClick={() => { setFormData({ title: '', category: 'GÜNDEM', author: 'Admin', image: '', content: '', seoTitle: '', seoDescription: '', isTicker: false, id: null }); setShowModal(true); }} className="bg-red-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-red-700 transition flex items-center gap-2">
              <Plus size={18} /> Yeni Haber
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase font-black text-gray-500">
              <tr>
                <th className="p-4 w-10">
                  <button onClick={selectAll} className="text-gray-500 hover:text-black">
                    {selectedNews.length === articles.length && articles.length > 0 ? <CheckSquare size={20}/> : <Square size={20}/>}
                  </button>
                </th>
                <th className="p-4">Görsel</th>
                <th className="p-4">Başlık</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Durum</th>
                <th className="p-4 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-bold text-gray-700">
              {filteredArticles.map((news) => (
                <tr key={news.id} className={`hover:bg-gray-50 transition ${selectedNews.includes(news.id) ? 'bg-blue-50' : ''}`}>
                  <td className="p-4">
                    <button onClick={() => toggleSelect(news.id)} className="text-gray-400 hover:text-blue-600">
                      {selectedNews.includes(news.id) ? <CheckSquare size={20} className="text-blue-600"/> : <Square size={20}/>}
                    </button>
                  </td>
                  <td className="p-4">
                    <img src={news.image || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=100"} className="w-12 h-12 rounded-lg object-cover bg-gray-200 border" />
                  </td>
                  <td className="p-4 max-w-xs truncate font-medium">{news.title}</td>
                  <td className="p-4"><span className="px-2 py-1 bg-gray-100 rounded text-xs border">{news.category}</span></td>
                  <td className="p-4">
                    <button onClick={() => toggleStatus(news.id)} className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 w-fit ${news.status === 'Yayında' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {news.status === 'Yayında' ? <CheckCircle size={10}/> : <Lock size={10}/>} {news.status}
                    </button>
                  </td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <button onClick={() => openEditModal(news)} className="p-2 text-blue-500 hover:bg-blue-50 rounded transition" title="Düzenle"><Edit size={18}/></button>
                    <button onClick={() => { if(confirm('Silinsin mi?')) deleteArticle(news.id); }} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition" title="Sil"><Trash2 size={18}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // --- RENDER ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 font-sans">
        <div className="bg-white rounded-2xl p-8 w-full max-w-md text-center">
          <h1 className="text-3xl font-black mb-4">APAK PANEL</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border-2 p-3 rounded-xl mb-4" placeholder="Şifre" />
            <button className="w-full bg-red-600 text-white py-3 rounded-xl font-bold">Giriş</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7F6] font-sans flex text-gray-800">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#212529] text-white fixed h-full z-20 hidden md:flex flex-col shadow-xl">
        <div className="p-6 border-b border-gray-700 flex items-center gap-2">
           <div className="w-3 h-3 rounded-full bg-red-500"></div>
           <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
           <h2 className="text-xl font-black tracking-tighter ml-2">APAK<span className="text-red-600">PANEL</span></h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {['dashboard', 'list', 'categories', 'settings', 'integrations'].map((id) => {
             const label = id === 'dashboard' ? 'Kontrol Paneli' : id === 'list' ? 'Haber Listesi' : id === 'categories' ? 'Kategoriler' : id === 'settings' ? 'Site Ayarları' : 'Entegrasyonlar';
             const Icon = id === 'dashboard' ? LayoutDashboard : id === 'list' ? FileText : id === 'categories' ? Tag : id === 'settings' ? Settings : Puzzle;
             return (
               <button 
                 key={id}
                 onClick={() => setActiveView(id)}
                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all ${
                   activeView === id ? 'bg-red-600 text-white shadow-lg translate-x-1' : 'text-gray-400 hover:bg-gray-800 hover:text-white hover:translate-x-1'
                 }`}
               >
                 <Icon size={20} /> {label}
               </button>
             );
          })}

          <div className="pt-6 pb-2 px-4 text-[10px] font-black text-gray-500 uppercase tracking-wider">Hızlı Erişim</div>
          <Link href="/" target="_blank" className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg font-bold transition hover:translate-x-1">
            <Eye size={20} /> Siteyi Görüntüle
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
        <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-500 flex items-center gap-2 uppercase text-sm tracking-wide">
             {activeView.toUpperCase()}
          </h2>
          <div className="flex items-center gap-3">
             <div className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-black">v3.6 Pro</div>
             <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold">A</div>
          </div>
        </div>

        <div className="min-h-[500px]">
           {activeView === 'dashboard' && <DashboardView />}
           {activeView === 'list' && <NewsListView />}
           {activeView === 'categories' && <CategoryManager 
              categories={categories} 
              addCategory={addCategory} 
              deleteCategory={deleteCategory} 
              newCategory={newCategory} 
              setNewCategory={setNewCategory}
           />}
           {activeView === 'settings' && <SiteSettings />}
           {activeView === 'integrations' && <Integrations />}
        </div>
      </main>
      
      {/* MODAL: HABER EKLE / DÜZENLE (Aynı kalır) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black flex gap-2 items-center"><FileText className="text-red-600"/> {formData.id ? 'Haberi Düzenle' : 'Yeni Haber Ekle'}</h2>
              <button onClick={() => setShowModal(false)}><X size={24} className="text-gray-400"/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-xs font-bold uppercase mb-1">Başlık</label><input required type="text" className="w-full border-2 border-gray-200 rounded-xl p-3 font-bold focus:border-red-600 outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Kategori</label>
                  <select className="w-full border-2 border-gray-200 rounded-xl p-3 font-bold bg-white focus:border-red-600 outline-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div><label className="block text-xs font-bold uppercase mb-1">Yazar</label><input type="text" className="w-full border-2 border-gray-200 rounded-xl p-3 font-bold focus:border-red-600 outline-none" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} /></div>
              </div>
              <div>
                 <label className="block text-xs font-bold uppercase mb-1">Kapak Görseli</label>
                 <div className="flex gap-2"><input type="text" placeholder="URL veya Dosya Yükle" className="flex-1 border-2 border-gray-200 rounded-xl p-3 font-medium text-sm focus:border-red-600 outline-none" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} /><label className="bg-gray-100 hover:bg-gray-200 p-3 rounded-xl cursor-pointer"><LucideImage size={20} className="text-gray-600"/><input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} /></label></div>
                 {formData.image && <img src={formData.image} className="mt-2 w-16 h-16 rounded-lg object-cover border" />}
              </div>
              <div><label className="block text-xs font-bold uppercase mb-1">İçerik</label><textarea rows="6" required className="w-full border-2 border-gray-200 rounded-xl p-3 font-medium focus:border-red-600 outline-none" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})}></textarea></div>
              
              <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 space-y-3">
                 <div className="flex justify-between items-center"><h4 className="font-bold text-purple-800 flex items-center gap-2"><Sparkles size={16}/> AI SEO</h4><button type="button" onClick={generateSEO} disabled={isGeneratingSEO} className="text-xs bg-purple-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-purple-700 disabled:opacity-50">{isGeneratingSEO ? '...' : 'Otomatik Doldur'}</button></div>
                 <input type="text" placeholder="SEO Başlığı" className="w-full border border-purple-200 rounded-lg p-2 text-sm" value={formData.seoTitle} onChange={e => setFormData({...formData, seoTitle: e.target.value})} />
                 <textarea rows="2" placeholder="SEO Açıklaması" className="w-full border border-purple-200 rounded-lg p-2 text-sm resize-none" value={formData.seoDescription} onChange={e => setFormData({...formData.seoDescription, seoDescription: e.target.value})}></textarea>
                 <label className="flex items-center gap-2 cursor-pointer pt-2 border-t border-purple-100"><input type="checkbox" checked={formData.isTicker} onChange={e => setFormData({...formData, isTicker: e.target.checked})} className="w-4 h-4 text-red-600 rounded" /><span className="text-sm font-bold text-gray-700 flex items-center gap-1"><Megaphone size={14}/> Son Dakika Bandında Göster</span></label>
              </div>

              <button type="submit" className="w-full bg-red-600 text-white py-3 rounded-xl font-black hover:bg-red-700 shadow-lg">{formData.id ? 'GÜNCELLE' : 'KAYDET'}</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}