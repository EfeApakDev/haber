import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { city } = await request.json();

    // 1. Şehir ID'sini Bul (Search API)
    const searchUrl = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${process.env.ACCUWEATHER_API_KEY}&q=${city}&language=tr-tr`;
    // Not: Gerçek projede API Key .env dosyasından gelmeli. Şimdilik demo için hardcode yapabiliriz veya senin verdiğin rapidapi key'i kullanabiliriz.
    // Ancak RapidAPI endpoint yapısı farklıdır. Senin verdiğin RapidAPI koduna sadık kalarak ilerleyelim:

    // RapidAPI Yapılandırması (Senin Verdiğin Kod)
    const locationKeyUrl = `https://accuweatherstefan-skliarovv1.p.rapidapi.com/searchLocations?q=${city}`;
    
    const searchRes = await fetch(locationKeyUrl, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': 'be75b54c12msh568a10a6f8676a6p1e6f22jsn0f4ba315d1f6', // Senin Key
        'x-rapidapi-host': 'AccuWeatherstefan-skliarovv1.p.rapidapi.com'
      }
    });

    const searchData = await searchRes.json();
    
    if (!searchData || searchData.length === 0) {
      return NextResponse.json({ error: 'Şehir bulunamadı' }, { status: 404 });
    }

    const locationKey = searchData[0].Key;

    // 2. Hava Durumunu Çek (Current Conditions)
    const weatherUrl = `https://accuweatherstefan-skliarovv1.p.rapidapi.com/get24HoursConditionsByLocationKey?locationKey=${locationKey}&language=tr`;
    
    const weatherRes = await fetch(weatherUrl, {
      method: 'GET', // RapidAPI'deki bu endpoint genelde GET çalışır
      headers: {
        'x-rapidapi-key': 'be75b54c12msh568a10a6f8676a6p1e6f22jsn0f4ba315d1f6',
        'x-rapidapi-host': 'AccuWeatherstefan-skliarovv1.p.rapidapi.com'
      }
    });

    const weatherData = await weatherRes.json();

    return NextResponse.json(weatherData);

  } catch (error) {
    console.error('API Hatası:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}