# 📣 Attention
### 📣 Attention
## This bot uses Indonesia leanguage for all responses and logs (console.log). Please ensure you understand the Indonesian language before installing or using this template.

> [!NOTE]  
> **MotzBot** adalah bot WhatsApp multifungsi yang dikembangkan oleh **ShinAi**. Bot ini menggunakan [@whiskeysockets/baileys](https://github.com/WhiskeySockets/Baileys) sebagai library utama, dan bersifat statis (non-dinamis). Bot ini dirancang untuk menjalankan berbagai perintah umum serta fitur khusus yang hanya dapat digunakan oleh admin bot. 

## Install

Dengan NPX
```bash
npx @shin-ai/motzbot
```

> [!WARNING]
> Karena bot ini bisa dijalankan di berbagai sistem seperti Android atau Windows, beberapa library seperti `sharp@0.34.2` mungkin mengalami konflik versi dengan `@whiskeysockets/baileys@6.7.18`.  
Jika muncul error saat proses instalasi, gunakan flag berikut untuk memastikan semua dependensi tetap terpasang:
```bash
npm install --force
```

## Login Bot
**MotzBot** mendukung dua metode login: QR Code dan Pairing Code. Kamu bisa memilih salah satu sesuai kebutuhan, dengan menyertakan flag pada saat menjalankan bot melalui `node start`.

dengan qr code
```bash
node start --qrcode=628xxx
```

dengan pairing code
```bash
node start --prcode=628xxx
```

> [!NOTE]
> Nomor yang dimasukkan saat login dengan flag `--qrcode=628xxx` atau `--prcode=628xxx` seperti yang di contoh kan di atas, akan otomatis disimpan ke dalam file `.env` sebagai BOT_NUMBER.

## Menjalankan Bot
Jika semua langkah sebelumnya sudah dilakukan (login dan instalasi dependensi), bot akan langsung berjalan secara otomatis setelah proses login selesai.

Untuk menghentikan bot, tekan `CTRL + c` di terminal kamu.

Untuk menjalankan ulang bot, gunakan perintah 
```bash
node start
```
> [!NOTE]
> Pastikan Anda berada di root direktori proyek saat menjalankan perintah tersebut.

---

## Kustomisasi Bot 
Kamu bisa mengatur tampilan dan perilaku bot atau mengkustom daftar perintah bot melalui file:
```path
./settings/botConfig.js
```

### botBehavior (tampilan dan perilaku bot)

1. **botName** (string)
   - Nama bot yang akan digunakan sebagai visual saat merespons.
     
2. **botLabel** (string)
   - Label sebelum isi pesan, contoh: `*[MTZ]* Halo`.
     
3. **botMenu** (string)
   - Kata kunci untuk memunculkan menu bot.
     
4. **replyMyMessage**	(boolean)
   - Jika true, bot merespons pesan yang dikirim oleh nomornya sendiri.
     
6. **readMessage** (boolean)
   - Jika true, pesan akan ditandai sebagai telah dibaca (centang dua putih).
  
7. **isTyping**	(boolean)
   - Jika true, bot akan menampilkan status "sedang mengetik" sebelum mengirim pesan.
     
8. **typingDelay**	(number)
   - Waktu delay (dalam ms) sebelum bot mengirim pesan. Harus digunakan bersama isTyping: true.
     
**Contoh:**

```JavaScript
const botBehavior = {
  botName: "Motz",
  botLabel: "*[MTZ]*",
  botMenu: "menu list",
  replyMyMessage: true,
  readMessage: true,
  isTyping: true,
  typingDelay: 1500
};
```

> [!IMPORTANT]
> Jika `isTyping` diatur ke `true`, pastikan `typingDelay` juga diisi. Jika tidak, bot akan menunggu default (0 ms).

### botResponsePatterns (daftar perintah bot)

> [!NOTE]
> Setiap perintah bot didefinisikan dalam bentuk objek

1. **command** (string)
   - Kata perintah yang diketik oleh pengguna.
2. **handler** (path)
   - Fungsi yang akan dijalankan ketika perintah tersebut dipanggil.
3. **isAdmin** (boolean)
   - Jika true, hanya admin yang dapat menggunakan perintah ini.
     
**Contoh:**

```JavaScript
const botResponsePatterns = [
  {
    command: "buat qr code",
    handler: returnCommand["qrCode_create"]
  },
  {
    command: "scan qr code",
    handler: returnCommand["qrCode_read"]
  },
  	{
		command: "buat grup",
		handler: returnCommand["group_create"],
		isAdmin: true
	},
	{
		command: "tambahkan nomor ke grup",
		handler: returnCommand["group_addNumbers"],
		isAdmin: true
	},
];
```

> [!TIP]
> command tidak hanya sebagai pemicu fitur, tetapi juga akan muncul di menu bot [(fitur bot / fitur umum)](#fitur-bot-fitur-umum). Ketika isAdmin true, maka fitur itu akan masuk ke [fitur admin](#fitur-admin)

> [!NOTE]
> Jika properti `isAdmin` tidak disertakan, maka secara default dianggap `false`.
> Handler seperti `returnCommand["qrCode_create"]` akan memanggil fungsi dari file berikut:
```bash
./commands/qrCode/create.js

```path
./qrCode/create.js
```

## Fitur Yang terdapat di bot

**MotzBot** menyediakan dua jenis fitur utama:

#### **Fitur Bot (Fitur umum)**  
   Fitur Bot (Fitur umum)
Fitur ini dapat digunakan oleh seluruh pengguna tanpa perlu akses khusus. Cukup ketik perintah sesuai format yang didukung, dan bot akan merespons secara otomatis.
   - **Format Perintah Khusus**
Beberapa perintah memerlukan pemisah `••` untuk menandai input tambahan yang dibutuhkan.
**Contoh penggunaan:**

```text
buat qr code •MotzBot by ShinAi•
```

#### **Fitur Admin**  
   Beberapa fitur dalam **MotzBot** hanya bisa dijalankan oleh pengguna yang terdaftar sebagai admin. Akses admin ini memungkinkan kontrol yang lebih luas terhadap bot, seperti pengelolaan grup, pengiriman pesan berskala besar, hingga pengaturan hak akses pengguna lain. Untuk bisa mengakses fitur admin, pastikan Kamu telah menambahkan nomor admin di variabel `ADMIN_NUMBER` pada file `.env`.
```env
ADMIN_NUMBER=628xxx
```
