MotzBot v1.0.0

!!⚠️ Attention: This bot uses Bahasa Indonesia for all responses and logs (console.log). Please ensure you understand the Indonesian language before installing or using this template.


Bot WhatsApp multifungsi yang dibuat oleh ShinAi, berbasis @whiskeysockets/baileys dan baileys. Bot ini dapat menangani berbagai fungsi umum maupun fitur khusus untuk admin.


🌐 Fitur Global (Dapat diakses semua user)
Menghasilkan QR Code dari teks
Membaca isi QR Code
Mengubah gambar menjadi stiker (dengan mengirim atau membalas gambar)
Mengubah teks menjadi stiker
Mendownload konten dari berbagai platform: TikTok, YouTube (video & musik *Bisa mengkonversi video ke musik), Instagram (reels, foto, IGTV)
Mengekstrak teks dari gambar
Mengecek apakah nomor WhatsApp terdaftar
Mengambil foto profil pengguna 

🔐 Fitur Admin (Hanya untuk nomor yang terdaftar menjadi admin)
Memblokir nomor
Membuka blokir
Membuat grup baru
Menambahkan nomor ke grup (hanya jika bot sudah ada di grup atau Anda adalah admin grup)
Mengirim pesan ke semua nomor grup


🛠️ Format Penggunaan Khusus
Beberapa fitur memerlukan penggunaan simbol •• untuk input tambahan, seperti:
Membuat nama grup
Mengisi isi QR Code
Mengirim pesan ke grup
Contoh:
buat qr code •• (Ini adalah contoh QR Code)

🔢 Nomor Admin / Bot
Jika nomor bot tidak didaftarkan atau tidak dimasukkan secara eksplisit, maka nomor tersebut akan dianggap sebagai nomor bot sekaligus admin.
*Catatan Penting:
Pastikan nilai myReplyMessage diatur menjadi true agar bot bisa membalas pesannya sendiri.
Jika myReplyMessage bernilai true, maka botLabel dan botName juga wajib diisi.

🛠️ Catatan Tambahan untuk Pengembang:
Jika ingin menambahkan fitur custom, hindari penggunaan kata kunci yang tumpang tindih dengan fitur lain.
Sistem membaca perintah menggunakan metode includes(), sehingga perintah seperti "buka blokir nomor" bisa terdeteksi sebagai "blokir nomor" jika tidak ditangani dengan benar.

❎ Contoh yang salah (tumpang tindih):
"blokir nomor"
"buka blokir nomor"

🔁 Solusi:
Gunakan kata unik atau tambahkan pengecekan tambahan seperti awalan atau penanda khusus agar sistem tidak salah mendeteksi perintah.


🐞 Laporan Bug
Jika Anda menemukan bug, silakan laporkan melalui email:
📧 shinai.developer@gmail.com


📦 Instalasi
Wajib memahami Bahasa Indonesia sebelum menggunakan. Jika sudah siap, silakan kloning repositori dan install dependensi:
npm install @shinai/motz


👮 Disclaimer
Bot ini dibuat untuk keperluan pembelajaran dan eksperimen. Penggunaan yang melanggar hukum sepenuhnya menjadi tanggung jawab pengguna. Pengembang tidak bertanggung jawab atas penyalahgunaan bot.