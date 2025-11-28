"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

const NewsContext = createContext();

const INITIAL_DATA = [
  { id: 101, title: "ANKARA'DA HAREKETLİ SAATLER! Kritik görüşme sona erdi", category: "GÜNDEM", image: "https://images.unsplash.com/photo-1555848962-6e79363ec58f?w=800&auto=format&fit=crop&q=60", author: "Ankara Kulis", date: "28.11.2025 - 14:30", status: "Yayında", isTicker: true, content: "..." },
  { id: 102, title: "DEV ORTAKLIK İMZALANDI!", category: "EKONOMİ", image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&auto=format&fit=crop&q=60", author: "Ekonomi Servisi", date: "28.11.2025 - 13:45", status: "Yayında", isTicker: true, content: "..." },
];

const INITIAL_SETTINGS = {
  siteName: "APAK",
  siteSuffix: "HABER",
  logoText: "Doğru Haberin Tek Adresi",
  weatherCity: "İstanbul",
  geminiKey: "",
  rssUrl: "",
  autoFetch: false,
  // ... diğer ayarlar ...
};

export function NewsProvider({ children }) {
  const [articles, setArticles] = useState([]);
  const [siteSettings, setSiteSettings] = useState(INITIAL_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // RSS Fonksiyonu (Düzeltilmiş)
  const fetchRSS = async (url) => {
    if (!url) return alert("Lütfen önce ayarlardan geçerli bir RSS URL'si giriniz.");
    
    try {
      console.log("RSS İsteği Gönderiliyor:", url);
      const res = await fetch('/api/rss', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Sunucu hatası");

      if (data.success && data.items.length > 0) {
        let addedCount = 0;
        setArticles(prevArticles => {
          const newArticles = data.items.map((item, index) => ({
            id: Date.now() + index + Math.floor(Math.random() * 1000), // Çakışmayı önlemek için random ekle
            title: item.title,
            category: 'GÜNDEM', // RSS'den kategori gelmediği için varsayılan
            image: item.image,
            author: 'Editör', // Kaynak Gizlendi
            date: item.pubDate,
            status: 'Yayında',
            isTicker: false, // RSS'den gelenleri manşete koyma (manuel seçilsin)
            content: item.description + "\n\nDetaylar için sitemizi takip etmeye devam edin."
          }));

          // Sadece başlığı sistemde OLMAYANLARI ekle
          const uniqueNewArticles = newArticles.filter(
            newItem => !prevArticles.some(prev => prev.title === newItem.title)
          );
          
          addedCount = uniqueNewArticles.length;
          
          // Yeni haberleri en üste ekle
          return [...uniqueNewArticles, ...prevArticles];
        });

        // Kullanıcıya bilgi ver (Gecikmeli, state güncellensin diye)
        setTimeout(() => {
           if(addedCount > 0) alert(`✅ Başarılı! ${addedCount} yeni haber RSS kaynağından çekildi.`);
           else alert("⚠️ Bağlantı başarılı ancak yeni haber bulunamadı (Tümü zaten ekli).");
        }, 500);

      } else {
        alert("⚠️ RSS kaynağına ulaşıldı ancak uygun formatta haber bulunamadı.");
      }
    } catch (err) {
      console.error("RSS Fetch Error:", err);
      alert(`❌ RSS Çekme Hatası: ${err.message}`);
    }
  };

  useEffect(() => {
    const savedNews = localStorage.getItem('nexus_news');
    if (savedNews) setArticles(JSON.parse(savedNews));
    else setArticles(INITIAL_DATA);

    const savedSettings = localStorage.getItem('nexus_settings');
    const integrationSettings = localStorage.getItem('nexus_integrations');
    
    let mergedSettings = INITIAL_SETTINGS;
    if (savedSettings) mergedSettings = { ...mergedSettings, ...JSON.parse(savedSettings) };
    
    if (integrationSettings) {
      const parsedInt = JSON.parse(integrationSettings);
      if (parsedInt.rssUrl) mergedSettings.rssUrl = parsedInt.rssUrl;
      if (parsedInt.geminiKey) mergedSettings.geminiKey = parsedInt.geminiKey;
    }
    setSiteSettings(mergedSettings);
    
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('nexus_news', JSON.stringify(articles));
      localStorage.setItem('nexus_settings', JSON.stringify(siteSettings));
    }
  }, [articles, siteSettings, isLoaded]);

  const updateSettings = (newSettings) => {
    setSiteSettings(prev => ({ ...prev, ...newSettings }));
  };

  const addArticle = (newArticle) => {
    const articleWithId = { 
      ...newArticle, 
      id: newArticle.id || Date.now(),
      views: newArticle.views || 0, 
      status: newArticle.status || 'Yayında',
      date: newArticle.date || new Date().toLocaleDateString() + ' - ' + new Date().toLocaleTimeString(),
    };
    
    if (newArticle.id) {
        setArticles(prev => prev.map(a => a.id === newArticle.id ? articleWithId : a));
    } else {
        setArticles(prev => [articleWithId, ...prev]);
    }
  };

  const deleteArticle = (id) => {
    setArticles(prev => prev.filter(item => item.id !== id));
  };

  const deleteMultipleArticles = (ids) => {
    setArticles(prev => prev.filter(item => !ids.includes(item.id)));
  };

  const toggleStatus = (id) => {
    setArticles(articles.map(item => 
      item.id === id ? { ...item, status: item.status === 'Yayında' ? 'Taslak' : 'Yayında' } : item
    ));
  };

  const getArticle = (id) => articles.find(article => article.id.toString() === id.toString());

  return (
    <NewsContext.Provider value={{ 
      articles, siteSettings, updateSettings, addArticle, getArticle, 
      deleteArticle, deleteMultipleArticles, toggleStatus, fetchRSS 
    }}>
      {children}
    </NewsContext.Provider>
  );
}

export function useNews() {
  return useContext(NewsContext);
}