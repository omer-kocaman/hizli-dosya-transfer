const supabaseUrl = 'BURAYA_KENDI_SUPABASE_URL_ADRESINIZI_YAZIN';
const supabaseKey = 'BURAYA_KENDI_SUPABASE_ANON_KEY_SIFRENIZI_YAZIN';

const supabaseIstemci = window.supabase.createClient(supabaseUrl, supabaseKey);

const fileInput = document.getElementById('file-input');
const messageDiv = document.getElementById('message');
const shareSection = document.getElementById('share-section');
const progressContainer = document.getElementById('progress-container');
const progressBar = document.getElementById('progress-bar');
const shareBtn = document.getElementById('share-btn');
const dropZone = document.getElementById('drop-zone');
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Kullanıcının daha önceki tercihini hafızadan oku
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.innerText = '☀️';
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark'); // Hafızaya kaydet
        themeToggle.innerText = '☀️';
    } else {
        localStorage.setItem('theme', 'light');
        themeToggle.innerText = '🌙';
    }
});

//surukle birak sistemi
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

//dosya kutuya birakildiginda
dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    
    //birakilan dosyayi alip bizim gizli file-input a gonder
    if (e.dataTransfer.files.length > 0) {
        fileInput.files = e.dataTransfer.files;
        messageDiv.style.color = "#007bff";
        messageDiv.innerText = `📂 ${fileInput.files[0].name} seçildi. Yükle butonuna basabilirsiniz.`;
    }
});

//buluta yükleme islemi
document.getElementById('upload-btn').addEventListener('click', async () => {
    if (fileInput.files.length === 0) {
        alert("Lütfen önce bir dosya seçin veya sürükleyip bırakın!");
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
    messageDiv.style.color = "#007bff";
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

    messageDiv.style.color = "#28a745";
    messageDiv.innerHTML = `Başarıyla yüklendi! 🎉`;

    shareSection.style.display = "block";
    const shortLinkElement = document.getElementById('short-link');

    try {
        const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(downloadUrl)}`);
        const shortUrl = await response.text();

        shortLinkElement.href = shortUrl;
        shortLinkElement.innerText = shortUrl;

        shareBtn.style.display = "inline-block";
        shareBtn.onclick = async () => {
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
            } else {
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
