import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
  // 1. Sistem Yetkilisi (Service Role) olarak giriş yapıyoruz (Güvenlik kilidini aşmak için)
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  // 2. 'dosyalar' kovasındaki tüm dosyaları listele
  const { data: files, error: listError } = await supabaseAdmin.storage.from('dosyalar').list()
  if (listError || !files) return new Response("Dosya okuma hatası", { status: 400 })

  const now = new Date()
  
  // 3. 1 dakikadan eski olanları tespit et (Test bittikten sonra burayı 1440 dakika yani 24 saat yapacağız)
  const silinecekler = files.filter(f => {
    const farkDakika = (now.getTime() - new Date(f.created_at).getTime()) / 60000
    return farkDakika > 1440 
  }).map(f => f.name)

  // 4. Resmi API üzerinden dosyaları kalıcı olarak sil
  if (silinecekler.length > 0) {
    await supabaseAdmin.storage.from('dosyalar').remove(silinecekler)
    return new Response(`${silinecekler.length} adet dosya çöpe atıldı.`, { status: 200 })
  }

  return new Response("Silinecek eski dosya yok.", { status: 200 })
})