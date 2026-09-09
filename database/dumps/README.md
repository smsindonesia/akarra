# Database dump

`akarra.sql` adalah snapshot database MySQL (artikel, isi Pengaturan, akun
admin, kategori) per tanggal commit ini. Tabel `sessions` dan `cache` sengaja
tidak disertakan karena isinya sementara.

## Cara pakai di device/server baru

1. Buat database kosong (nama harus sama dengan `DB_DATABASE` di `.env`):

   ```
   mysql -u root -p -e "CREATE DATABASE akarra CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
   ```

2. Import dump-nya:

   ```
   mysql -u root -p akarra < database/dumps/akarra.sql
   ```

3. Jalankan `php artisan storage:link` supaya folder `storage/app/public`
   (foto/video yang ikut di-push lewat git) bisa diakses dari browser di
   `/storage/...`. (`composer setup` menjalankan ini otomatis — lihat
   `composer.json` — jadi langkah ini cuma perlu manual kalau tidak pakai
   perintah itu.)

4. Pastikan `APP_URL` di `.env` server sudah domain aslinya (bukan
   `http://localhost:...`). Foto/video yang diunggah lewat panel admin
   sendiri sudah aman disimpan sebagai path relatif (lihat
   `config/filesystems.php`), jadi tetap tampil benar walau `APP_URL` beda
   antar environment — tapi `APP_URL` masih dipakai untuk hal lain (canonical
   URL, sitemap, link di email, dll), jadi tetap harus diisi benar.

5. Cek batas upload PHP di server. `public/.user.ini` (ikut ter-push) sudah
   menaikkan `upload_max_filesize`/`post_max_size` ke 64M kalau server jalan
   lewat PHP-FPM/CGI (umum di hosting bersama/cPanel) — tapi kalau server
   pakai Apache dengan mod_php, itu tidak kebaca, jadi harus diatur manual di
   php.ini server (atau lewat panel hosting) supaya sesuai
   `config/akarra.php` (batas video 50 MB). Kalau ini kelewat, unggah video
   yang lebih besar dari batas PHP bawaan (sering cuma 2 MB) akan gagal
   persis seperti kasus yang pernah terjadi di lokal.

Setelah ini, situs akan tampil persis seperti kondisi terakhir di komputer asal
— termasuk isi Pengaturan, artikel, dan akun admin yang sudah dibuat.

**Ingat**: kalau nanti kontennya berubah lagi (artikel baru, ganti nomor
WhatsApp, dll), dump ini harus dibuat ulang dan di-push lagi — dump ini bukan
sinkronisasi otomatis, hanya snapshot satu waktu.
