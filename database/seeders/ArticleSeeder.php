<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Category;
use App\Models\User;
use App\Services\ArticleService;
use Illuminate\Database\Seeder;

/**
 * Tiga artikel contoh tentang AKARRA sendiri, supaya pratinjau artikel di
 * beranda dan halaman /articles tidak kosong begitu situs baru dipasang.
 */
class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        $category = Category::where('name', 'Berita Perusahaan')->first();
        $author = User::first();

        if (! $category) {
            return;
        }

        $articles = [
            [
                'title' => 'Kisah Berdirinya AKARRA: Dari Visi Menjadi Ekosistem Bisnis',
                'excerpt' => 'Bermula dari keresahan tentang industri kreatif Indonesia yang berjalan sendiri-sendiri, Febri Khoirul Imam dan Nanda Fifia Putri merancang AKARRA sebagai satu ekosistem yang menyatukan fashion, kreativitas, dan strategi digital.',
                'meta_title' => 'Kisah Berdirinya AKARRA',
                'meta_description' => 'Bagaimana AKARRA lahir dari visi untuk menyatukan fashion, desain kreatif, event, dan periklanan digital dalam satu ekosistem bisnis.',
                'published_at' => now()->subDays(12),
                'body' => <<<'HTML'
                    <p>Setiap merek besar biasanya lahir dari satu keresahan sederhana. Bagi AKARRA, keresahan itu adalah melihat betapa terpecahnya industri kreatif Indonesia — seorang desainer fashion harus mencari sendiri rumah produksinya, brand yang baru tumbuh harus berpindah dari satu vendor ke vendor lain hanya untuk membangun identitas visual, dan strategi digital sering menjadi renungan terakhir setelah produk jadi, bukan bagian dari perencanaan sejak awal.</p>

                    <p>Febri Khoirul Imam dan Nanda Fifia Putri mendirikan AKARRA dengan gagasan yang berbeda: bagaimana jika seluruh perjalanan itu — dari produksi, desain, penyelenggaraan acara, hingga periklanan digital — bisa ditempuh dalam satu ekosistem yang saling terhubung, tanpa brand harus kehilangan jiwa aslinya di tengah jalan?</p>

                    <h2>Dari Nama, Sudah Ada Filosofi</h2>
                    <p>Nama "AKARRA" sendiri bukan sekadar label. Terinspirasi dari geometri berlian dan mandala tradisional Nusantara, identitas visualnya memadukan kemewahan modern dengan kearifan lokal — sebuah pengingat bahwa tumbuh besar tidak harus berarti melepaskan akar budaya.</p>

                    <ul>
                        <li><strong>Berlian & Kemewahan</strong> — struktur geometris yang mencerminkan kualitas premium dan eksklusivitas.</li>
                        <li><strong>Energi & Dinamisme</strong> — segitiga yang saling bertautan, melambangkan inovasi dan kolaborasi.</li>
                        <li><strong>Mandala & Harmoni</strong> — pola melingkar yang mengacu pada tradisi mandala Nusantara.</li>
                        <li><strong>Emas & Kepercayaan</strong> — warna yang melambangkan prestise sekaligus kepercayaan jangka panjang.</li>
                    </ul>

                    <h2>Bukan Sekadar Menjual, Tapi Membangun Warisan</h2>
                    <p>Sejak hari pertama, AKARRA tidak dirancang untuk sekadar menjual produk atau jasa. Tujuannya lebih jauh: membangun identitas dan dampak nyata bagi komunitas fashion dan kreatif Indonesia, sekaligus membuka jalan bagi brand lokal untuk tumbuh setara dengan nama-nama besar dunia — tanpa kehilangan akar budayanya.</p>

                    <p>Perjalanan itu terus berlanjut hari ini, melalui tiga pilar yang saling menopang: Fashionpreneur, Creative Labs, dan Advertising. Ketiganya lahir dari satu keyakinan yang sama — bahwa keunggulan sejati ditemukan di persimpangan antara presisi dan jiwa.</p>
                    HTML,
            ],
            [
                'title' => 'Mengenal Tiga Pilar AKARRA: Fashionpreneur, Creative Labs, dan Advertising',
                'excerpt' => 'Tiga pilar yang saling menopang, dirancang untuk menemani brand di setiap tahap pertumbuhannya — dari produksi hingga strategi digital.',
                'meta_title' => 'Tiga Pilar Ekosistem AKARRA',
                'meta_description' => 'Fashionpreneur, Creative Labs, dan Advertising — tiga pilar yang membentuk ekosistem layanan AKARRA bagi brand fashion dan kreatif Indonesia.',
                'published_at' => now()->subDays(6),
                'body' => <<<'HTML'
                    <p>Salah satu hal yang membedakan AKARRA dari agensi atau rumah produksi pada umumnya adalah struktur layanannya yang tidak berdiri sendiri-sendiri. Ketiga pilar — Fashionpreneur, Creative Labs, dan Advertising — dirancang untuk saling menopang, sehingga sebuah brand bisa ditemani sejak ide pertama hingga dikenal luas, tanpa harus berpindah mitra di setiap tahap.</p>

                    <h2>01 / Fashionpreneur</h2>
                    <p>Fashionpreneur adalah ekosistem komprehensif bagi desainer mapan maupun label yang baru tumbuh, untuk berkembang tanpa mengorbankan integritas kualitas. AKARRA menangani kerumitan rantai pasok — dari sampling di atelier hingga produksi skala besar yang etis — supaya brand bisa fokus sepenuhnya pada jiwa produknya sendiri.</p>
                    <p>Dua layanan inti di pilar ini adalah <strong>The Atelier</strong> (sampling bespoke dan pengembangan pola teknis untuk siluet high-fashion) dan <strong>Global Production</strong> (manufaktur skala kecil yang etis serta sourcing tekstil berskala besar dengan fokus keberlanjutan).</p>

                    <h2>02 / Creative Labs</h2>
                    <p>Jika Fashionpreneur adalah tangan yang memproduksi, Creative Labs adalah mesin intelektual yang menerjemahkan nilai brand menjadi narasi visual dan pengalaman yang membekas di benak audiens yang semakin kritis.</p>
                    <p>Di dalamnya ada <strong>Art Direction</strong> — kurasi identitas visual, citra kampanye, dan panduan brand berkualitas tinggi — serta <strong>Immersive Events</strong>, mulai dari peluncuran produk bespoke hingga peragaan busana yang dirancang untuk membangkitkan kedekatan emosional, bukan sekadar hiburan sesaat.</p>

                    <h2>03 / Advertising</h2>
                    <p>Pilar ketiga menjembatani semua kerja kreatif itu ke pasar yang tepat. Fokusnya ada pada strategi digital dan periklanan yang terukur — penempatan media, pengelolaan media sosial, hingga positioning brand — supaya karya yang telah dibangun dengan susah payah benar-benar sampai ke audiens yang dituju.</p>

                    <h2>Mengapa Harus Tiga Pilar dalam Satu Atap?</h2>
                    <p>Karena keputusan yang baik di satu pilar selalu memengaruhi pilar lainnya. Pilihan tekstil di Fashionpreneur akan menentukan bagaimana produk difoto dan diceritakan di Creative Labs, dan narasi itu pada akhirnya membentuk cara sebuah kampanye ditempatkan di Advertising. Dengan ketiganya berjalan dalam satu ekosistem, brand tidak perlu menerjemahkan ulang visinya setiap kali berpindah tangan.</p>
                    HTML,
            ],
            [
                'title' => 'Komitmen AKARRA terhadap Keberlanjutan dan Budaya Lokal Indonesia',
                'excerpt' => 'Menjadi brand berkelas dunia bukan berarti melepaskan akar. Begini cara AKARRA menyeimbangkan pertumbuhan bisnis dengan tanggung jawab terhadap lingkungan dan warisan budaya.',
                'meta_title' => 'Keberlanjutan & Budaya Lokal di AKARRA',
                'meta_description' => 'Bagaimana AKARRA menjaga keseimbangan antara pertumbuhan bisnis, praktik produksi yang etis, dan penghormatan terhadap budaya lokal Indonesia.',
                'published_at' => now()->subDay(),
                'body' => <<<'HTML'
                    <p>Ada satu pertanyaan yang terus dipegang AKARRA sejak awal berdiri: apakah mungkin sebuah brand tumbuh menjadi kelas dunia tanpa mengorbankan tempat ia berasal? Bagi AKARRA, jawabannya bukan hanya "mungkin" — tetapi menjadi salah satu prinsip yang mendasari setiap keputusan bisnis yang diambil.</p>

                    <h2>Keberlanjutan Bukan Jargon, Tapi Standar Kerja</h2>
                    <p>Di pilar Fashionpreneur, komitmen ini terlihat nyata pada layanan Global Production — manufaktur skala kecil yang etis dan sourcing tekstil dengan fokus keberlanjutan. Ini bukan lapisan pemasaran yang ditambahkan belakangan, melainkan bagian dari cara AKARRA memilih mitra produksi dan bahan baku sejak tahap paling awal.</p>
                    <p>Pendekatan ini memang menuntut lebih banyak kesabaran dibanding produksi massal konvensional. Namun bagi AKARRA, kualitas yang bertahan lama — baik dari sisi material maupun dampaknya terhadap lingkungan — selalu lebih bernilai daripada kecepatan semata.</p>

                    <h2>Akar Budaya sebagai Fondasi, Bukan Sekadar Ornamen</h2>
                    <p>Penghormatan terhadap budaya lokal juga tertanam sejak dari identitas visual AKARRA sendiri. Motif mandala yang menjadi ciri khas logo bukan dipilih karena sedang tren, melainkan karena mengacu langsung pada tradisi mandala Nusantara — pola melingkar yang telah lama menjadi simbol harmoni dalam budaya Indonesia.</p>
                    <p>Filosofi yang sama juga membentuk cara AKARRA bekerja dengan para perajin dan pelaku industri kreatif lokal: bukan sebagai vendor yang sekadar dibayar untuk mengeksekusi, melainkan sebagai mitra yang turut membentuk arah kreatif setiap karya.</p>

                    <h2>Visi ke Depan</h2>
                    <p>AKARRA ingin menjadi ekosistem bisnis fashion dan kreatif terdepan di Indonesia yang melahirkan brand-brand berkelas dunia — namun tetap berakar pada budaya lokal. Bagi AKARRA, keunggulan sejati justru ditemukan pada titik temu antara presisi matematis sebuah strategi bisnis dan jiwa artistik yang diwariskan turun-temurun.</p>
                    <p>Itulah sebabnya setiap ekspansi yang dilakukan AKARRA — baik ke kategori produk baru, kemitraan strategis, maupun pasar yang lebih luas — selalu diuji dengan satu pertanyaan yang sama: apakah langkah ini memperkuat akar, atau justru menjauhkannya?</p>
                    HTML,
            ],
        ];

        $service = app(ArticleService::class);

        foreach ($articles as $data) {
            if (Article::where('title', $data['title'])->exists()) {
                continue;
            }

            $data['category_id'] = $category->id;
            $data['status'] = Article::STATUS_PUBLISHED;

            $service->create($data, $author?->id ?? 1);
        }
    }
}
