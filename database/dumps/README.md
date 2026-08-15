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
   `/storage/...`.

Setelah ini, situs akan tampil persis seperti kondisi terakhir di komputer asal
— termasuk isi Pengaturan, artikel, dan akun admin yang sudah dibuat.

**Ingat**: kalau nanti kontennya berubah lagi (artikel baru, ganti nomor
WhatsApp, dll), dump ini harus dibuat ulang dan di-push lagi — dump ini bukan
sinkronisasi otomatis, hanya snapshot satu waktu.
