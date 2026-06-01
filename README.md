\# 🚀 Hızlı Dosya Transferi (WeTransfer Klonu)



🌍 \*\*Canlı Demo:\*\* \[Projeyi Hemen Test Et](https://hizlidosyapaylasimi.netlify.app)



Bu proje, kullanıcıların dosyalarını güvenle buluta yükleyebildiği, anında kısa link ve QR kod oluşturabilen ve yüklenen dosyaları \*\*24 saat sonra otomatik olarak imha eden\*\* modern bir web uygulamasıdır.



\## 🛠️ Kullanılan Teknolojiler

\* \*\*Frontend:\*\* HTML5, CSS3, Vanilla JavaScript

\* \*\*Backend (BaaS):\*\* Supabase (PostgreSQL, Storage)

\* \*\*Cloud Architecture:\*\* Supabase Edge Functions (Deno/TypeScript), pg\_cron, pg\_net

\* \*\*Hosting:\*\* Netlify

\* \*\*Harici API'ler:\*\* TinyURL API (Link Kısaltma), QRious.js (QR Kod Üretimi)



\## ✨ Öne Çıkan Özellikler

1\. \*\*Otomatik Temizlik (Cron Jobs):\*\* Supabase veritabanına kurulan zamanlayıcılar (pg\_cron) sayesinde, yazılan Edge Function tetiklenir ve 24 saati dolduran dosyalar "Orphaned Object" bırakmadan kalıcı olarak silinir.

2\. \*\*Güvenli Depolama (RLS):\*\* Supabase Row Level Security kuralları ile dosyalar güvence altına alınmıştır.

3\. \*\*Web Share API:\*\* Mobil cihazlarda yerel "Paylaş" menüsünü tetikleyen akıllı paylaşım butonu.

4\. \*\*Maksimum Boyut Sınırı:\*\* İstemci tarafında (Client-side) 50 MB dosya yükleme sınırı kontrolü.



\## ⚙️ Kendi Bilgisayarınızda Çalıştırmak İçin

1\. Bu projeyi indirin.

2\. Supabase üzerinde yeni bir proje oluşturun ve bir 'dosyalar' storage kovası (bucket) açın.

3\. `app.js` dosyasının en üstündeki `supabaseUrl` ve `supabaseKey` alanlarına kendi API bilgilerinizi girin.

4\. `index.html` dosyasını tarayıcınızda açarak kullanmaya başlayın! \*(Kurulumla uğraşmak istemiyorsanız doğrudan \[https://hizlidosyapaylasimi.netlify.app](https://hizlidosyapaylasimi.netlify.app) adresini ziyaret ederek sistemi test edebilirsiniz).\*

