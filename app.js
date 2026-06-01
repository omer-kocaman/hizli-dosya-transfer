const supabaseUrl = 'BURAYA_KENDI_SUPABASE_URL_ADRESINIZI_YAZIN';
const supabaseKey = 'BURAYA_KENDI_SUPABASE_ANON_KEY_SIFRENIZI_YAZIN';

const supabaseIstemci = window.supabase.createClient(supabaseUrl, supabaseKey);

document.getElementById('upload-btn').addEventListener('click', async () => {
    const fileInput = document.getElementById('file-input');
    const messageDiv = document.getElementById('message');
    const shareSection = document.getElementById('share-section');
    const progressContainer = document.getElementById('progress-container');
    const progressBar = document.getElementById('progress-bar');
    const shareBtn = document.getElementById('share-btn');

    if (fileInput.files.length === 0) {
        alert("Lütfen önce bir dosya seçin!");
        return;
    }

    const file = fileInput.files[0];

    const maxSize = 50 * 1024 * 1024; 
    if (file.size > maxSize) {
        alert("Dosya boyutu çok büyük! Lütfen 50 MB'tan daha küçük bir dosya seçin.");
        fileInput.value = ""; 
        return;
    }
    
    const safeFileName = file.name.replace(/[^a-zA-Z0-9.\-]/g, "_");
    const uniqueFileName = Date.now() + "_" + safeFileName;

    shareSection.style.display = "none";
    shareBtn.style.display = "none";
    messageDiv.style.color = "blue";
    messageDiv.innerText = "Buluta yükleniyor, lütfen bekleyin...";
    
    progressContainer.style.display = "block";
    progressBar.style.width = "50%";

    const { data, error } = await supabaseIstemci.storage
        .from('dosyalar')
        .upload(uniqueFileName, file, {
            contentType: 'application/octet-stream' 
        });

    if (error) {
        console.error("Yükleme hatası:", error);
        progressBar.style.width = "0%";
        progressContainer.style.display = "none";
        messageDiv.style.color = "red";
        messageDiv.innerText = "Hata oluştu: " + error.message;
        return;
    }

    progressBar.style.width = "100%";
    setTimeout(() => { progressContainer.style.display = "none"; }, 1000);

    const { data: publicUrlData } = supabaseIstemci.storage
        .from('dosyalar')
        .getPublicUrl(uniqueFileName, {
            download: safeFileName 
        });

    const downloadUrl = publicUrlData.publicUrl;

    messageDiv.style.color = "green";
    messageDiv.innerHTML = `Başarıyla yüklendi! 🎉`;

    shareSection.style.display = "block";
    const shortLinkElement = document.getElementById('short-link');

    try {
        const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(downloadUrl)}`);
        const shortUrl = await response.text();

        shortLinkElement.href = shortUrl;
        shortLinkElement.innerText = shortUrl;

        // paylasma
        shareBtn.style.display = "inline-block";
        shareBtn.onclick = async () => {
            // web api ile paylasma
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: 'Sana Bir Dosya Gönderildi!',
                        text: 'Merhaba, bu linkten sana gönderdiğim dosyayı indirebilirsin (24 saat geçerlidir):',
                        url: shortUrl
                    });
                } catch (err) {
                    console.log("Paylaşım menüsü kapatıldı.");
                }
            } 
            // link kopyalama
            else {
                navigator.clipboard.writeText(shortUrl).then(() => {
                    const originalText = shareBtn.innerText;
                    shareBtn.innerText = "Link Kopyalandı! ✔";
                    setTimeout(() => { shareBtn.innerText = originalText; }, 2000);
                });
            }
        };

        new QRious({
            element: document.getElementById('qr-code'),
            value: shortUrl,
            size: 180,
            background: 'white',
            foreground: 'black'
        });

    } catch (err) {
        console.error("Kısaltma başarısız:", err);
        shortLinkElement.href = downloadUrl;
        shortLinkElement.innerText = "Kısaltılamadı, tıklayıp indirin.";
    }
});