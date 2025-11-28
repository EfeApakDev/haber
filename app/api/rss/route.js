import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL gerekli' }, { status: 400 });
    }

    console.log(`RSS İsteği Başladı: ${url}`);

    // 1. RSS Feed'i Çek (Tarayıcı gibi davranarak engelleri aş)
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/rss+xml, application/xml, text/xml; q=0.1',
      },
      cache: 'no-store' // Her zaman taze veri çek
    });
    
    if (!response.ok) {
      throw new Error(`RSS Sunucu Hatası: ${response.status}`);
    }

    const xmlText = await response.text();
    
    // 2. XML AYRIŞTIRMA (Regex ile Gelişmiş Parser)
    const items = [];
    
    // Hem <item> (RSS) hem <entry> (Atom) desteği
    const itemRegex = /<(item|entry)[\s\S]*?>([\s\S]*?)<\/(item|entry)>/gi;
    let match;

    while ((match = itemRegex.exec(xmlText)) !== null) {
      const itemContent = match[2];
      
      // Yardımcı: Tag içeriğini temizle (CDATA ve HTML tagleri)
      const getTagValue = (tag) => {
        const regex = new RegExp(`<${tag}[^>]*>(.*?)<\/${tag}>`, 'is');
        const m = regex.exec(itemContent);
        if (!m) return null;
        let text = m[1];
        // CDATA temizle
        text = text.replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1');
        // HTML tagleri temizle (Basitçe)
        return text.trim();
      };

      // RESİM BULMA STRATEJİSİ (En önemli kısım)
      let image = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800"; // Varsayılan

      // 1. <enclosure>
      const enclosureMatch = /<enclosure[^>]*url=["'](.*?)["'][^>]*>/i.exec(itemContent);
      if (enclosureMatch) image = enclosureMatch[1];
      
      // 2. <media:content> veya <media:thumbnail>
      if (!enclosureMatch) {
        const mediaMatch = /<media:(content|thumbnail)[^>]*url=["'](.*?)["'][^>]*>/i.exec(itemContent);
        if (mediaMatch) image = mediaMatch[2];
      }
      
      // 3. İçerikteki ilk <img> etiketi
      if (image.includes("unsplash")) { // Hala varsayılan ise
         const imgMatch = /<img[^>]+src=["'](.*?)["']/i.exec(itemContent);
         if (imgMatch) image = imgMatch[1];
         // CDATA içindeki img'yi de bulmaya çalış
         const contentMatch = /<!\[CDATA\[([\s\S]*?)\]\]>/i.exec(itemContent);
         if (contentMatch) {
            const imgInCdata = /<img[^>]+src=["'](.*?)["']/i.exec(contentMatch[1]);
            if (imgInCdata) image = imgInCdata[1];
         }
      }

      // İÇERİK TEMİZLEME
      let description = getTagValue('description') || getTagValue('content') || getTagValue('summary') || "";
      // HTML taglerini temizle
      description = description.replace(/<[^>]*>?/gm, '');
      // Gereksiz boşlukları temizle
      description = description.replace(/\s+/g, ' ').trim();
      // Kısalt
      const shortDesc = description.substring(0, 250) + (description.length > 250 ? "..." : "");

      const title = getTagValue('title');
      const pubDate = getTagValue('pubDate') || getTagValue('updated') || getTagValue('dc:date');
      const link = getTagValue('link');

      if (title) {
        items.push({
          title: title.replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1').trim(), // Başlıktaki CDATA'yı da temizle
          description: shortDesc,
          image,
          pubDate: pubDate ? new Date(pubDate).toLocaleString('tr-TR') : new Date().toLocaleString('tr-TR'),
          link,
          source: 'RSS'
        });
      }
      
      if (items.length >= 15) break; // Max 15 haber
    }

    console.log(`${items.length} haber başarıyla ayrıştırıldı.`);
    return NextResponse.json({ success: true, items });

  } catch (error) {
    console.error('RSS API Kritik Hata:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}