/**
 * Peta isi tiap halaman publik untuk panel "Kelola Halaman".
 *
 * Data di database tetap berupa pasangan group/key (lihat SettingSeeder) —
 * file ini hanya memberi tiap key label manusiawi, keterangan letaknya di
 * situs, dan mengelompokkannya per bagian halaman (satu bagian = satu kartu
 * di admin). Key yang ada di database tapi tidak tercantum di sini tetap
 * bisa disunting lewat kartu "Pengaturan lanjutan" di bagian bawah, jadi
 * tidak ada data yang tersembunyi.
 *
 * Tipe field:
 * - text / textarea : teks satu baris / paragraf
 * - image / video   : unggah media (lihat ImageField/VideoField)
 * - gallery         : daftar URL foto (lihat GalleryField)
 * - lines           : daftar teks pendek, satu per baris
 * - list            : daftar kartu, tiap kartu punya `fields` sendiri
 * - object          : satu kartu tunggal dengan `fields`
 */

const heroSection = ({ withImage = false, withButtons = false, description } = {}) => ({
  id: 'hero',
  title: 'Bagian Pembuka',
  description: description ?? 'Tampilan paling atas, yang pertama dilihat pengunjung saat halaman dibuka.',
  fields: [
    { key: 'hero_eyebrow', label: 'Teks kecil di atas judul', type: 'text', placeholder: 'mis. Koleksi Pilihan' },
    { key: 'hero_title', label: 'Judul besar', type: 'text', wide: true },
    {
      key: 'hero_title_emphasis',
      label: 'Kata berwarna emas',
      type: 'text',
      help: 'Tulis ulang satu kata dari Judul besar (huruf besar/kecil harus sama persis) — kata itu akan diwarnai emas.',
    },
    { key: 'hero_subtitle', label: 'Paragraf pengantar', type: 'textarea', wide: true },
    ...(withButtons
      ? [
          { key: 'hero_cta_label', label: 'Tulisan tombol utama', type: 'text', help: 'Tombol emas, mengarah ke formulir kolaborasi.' },
          { key: 'hero_secondary_cta_label', label: 'Tulisan tombol kedua', type: 'text', help: 'Tombol bergaris, mengarah ke halaman Ecosystem.' },
        ]
      : []),
    ...(withImage ? [{ key: 'hero_image', label: 'Foto pembuka', type: 'image', wide: true, help: 'Tampil lebar di bawah judul.' }] : []),
  ],
})

const ctaSection = (description = 'Ajakan penutup di bagian paling bawah halaman, sebelum footer.') => ({
  id: 'cta',
  title: 'Ajakan Penutup',
  description,
  fields: [
    { key: 'cta_title', label: 'Judul', type: 'text', wide: true },
    { key: 'cta_subtitle', label: 'Keterangan', type: 'textarea', wide: true },
    { key: 'cta_label', label: 'Tulisan tombol utama', type: 'text' },
    { key: 'cta_secondary_label', label: 'Tulisan tombol kedua', type: 'text' },
  ],
})

const titleBodyItem = (titleLabel = 'Judul', bodyLabel = 'Keterangan') => [
  { key: 'title', label: titleLabel, type: 'text' },
  { key: 'body', label: bodyLabel, type: 'textarea' },
]

export const SETTING_SCHEMA = {
  global: {
    title: 'Pengaturan Umum',
    path: '/',
    description: 'Identitas, menu, kontak, dan footer yang muncul di semua halaman.',
    sections: [
      {
        id: 'identity',
        title: 'Identitas Situs',
        description: 'Nama dan deskripsi singkat AKARRA. Dipakai di judul tab browser, hasil pencarian Google, dan footer.',
        fields: [
          { key: 'site_name', label: 'Nama situs', type: 'text' },
          { key: 'tagline', label: 'Slogan', type: 'text', help: 'Tampil sebagai judul tab browser di Beranda.' },
          { key: 'description', label: 'Deskripsi singkat', type: 'textarea', wide: true, help: 'Muncul di footer dan di hasil pencarian Google.' },
        ],
      },
      {
        id: 'nav',
        title: 'Menu Navigasi',
        description: 'Daftar menu di bagian atas situs (juga diulang di footer).',
        fields: [
          {
            key: 'nav',
            label: 'Daftar menu',
            type: 'list',
            wide: true,
            itemLabel: 'Menu',
            titleKey: 'label',
            newItem: { label: '', path: '/' },
            fields: [
              { key: 'label', label: 'Nama menu', type: 'text' },
              { key: 'path', label: 'Alamat tujuan', type: 'text', help: 'mis. /products atau /articles' },
            ],
          },
          { key: 'nav_cta_label', label: 'Tulisan tombol di pojok kanan atas', type: 'text' },
        ],
      },
      {
        id: 'contact',
        title: 'Kontak',
        description: 'Dipakai di footer dan tombol WhatsApp pada formulir kolaborasi.',
        fields: [
          { key: 'email', label: 'Alamat email', type: 'text', placeholder: 'mis. halo@akarra.co.id' },
          {
            key: 'whatsapp',
            label: 'Nomor WhatsApp',
            type: 'text',
            placeholder: '6281234567890',
            help: 'Awali dengan 62, tanpa tanda + dan tanpa angka 0 di depan. Kosongkan untuk menyembunyikan tombol WhatsApp.',
          },
        ],
      },
      {
        id: 'social',
        title: 'Media Sosial',
        description: 'Tautan di footer. Akun yang alamatnya kosong tidak ditampilkan.',
        fields: [
          {
            key: 'social',
            label: 'Akun media sosial',
            type: 'list',
            wide: true,
            itemLabel: 'Akun',
            titleKey: 'label',
            newItem: { platform: '', url: '', label: '' },
            fields: [
              { key: 'label', label: 'Nama yang ditampilkan', type: 'text', placeholder: 'mis. Instagram' },
              { key: 'url', label: 'Alamat lengkap (URL)', type: 'text', placeholder: 'https://instagram.com/akarra' },
              { key: 'platform', label: 'Kode platform', type: 'text', placeholder: 'instagram', help: 'Huruf kecil tanpa spasi.' },
            ],
          },
        ],
      },
      {
        id: 'footer',
        title: 'Footer & Berbagi Tautan',
        description: 'Bagian paling bawah situs, serta tampilan saat link situs dibagikan ke WhatsApp/media sosial.',
        fields: [
          { key: 'footer_note', label: 'Catatan hak cipta', type: 'text', wide: true },
          {
            key: 'og_image',
            label: 'Gambar pratinjau saat link dibagikan',
            type: 'image',
            wide: true,
            help: 'Ukuran ideal 1200×630 piksel.',
          },
          { key: 'twitter_handle', label: 'Akun X/Twitter', type: 'text', placeholder: '@akarra' },
        ],
      },
    ],
  },

  home: {
    title: 'Beranda',
    path: '/',
    description: 'Halaman utama yang pertama kali dibuka pengunjung.',
    sections: [
      heroSection({ withButtons: true }),
      {
        id: 'narrative',
        title: 'Narasi & Kutipan',
        description: 'Bagian setelah pembuka: foto di satu sisi, judul, paragraf, dan kutipan pendiri di sisi lain.',
        fields: [
          { key: 'narrative_title', label: 'Judul', type: 'text', wide: true },
          { key: 'narrative_body', label: 'Paragraf', type: 'textarea', wide: true },
          { key: 'narrative_image', label: 'Foto', type: 'image' },
          { key: 'narrative_badge', label: 'Label kecil di atas foto', type: 'text', placeholder: 'mis. Est. 2026' },
          { key: 'narrative_quote', label: 'Kutipan', type: 'textarea', wide: true },
          { key: 'narrative_quote_attribution', label: 'Nama pemilik kutipan', type: 'text' },
        ],
      },
      {
        id: 'values',
        title: 'Nilai-Nilai',
        description: 'Deretan kotak nilai perusahaan di bawah bagian Narasi.',
        fields: [
          {
            key: 'values',
            label: 'Daftar nilai',
            type: 'list',
            wide: true,
            itemLabel: 'Nilai',
            titleKey: 'name',
            newItem: { name: '', body: '' },
            fields: [
              { key: 'name', label: 'Nama nilai', type: 'text' },
              { key: 'body', label: 'Penjelasan', type: 'textarea' },
            ],
          },
        ],
      },
      {
        id: 'solutions',
        title: 'Solusi Pilihan',
        description: 'Kartu-kartu bergambar berisi produk/karya unggulan.',
        fields: [
          { key: 'solutions_title', label: 'Judul bagian', type: 'text' },
          { key: 'solutions_subtitle', label: 'Keterangan bagian', type: 'text' },
          {
            key: 'solutions',
            label: 'Kartu solusi',
            type: 'list',
            wide: true,
            itemLabel: 'Kartu',
            titleKey: 'title',
            newItem: { title: '', body: '', image: '', category: '' },
            fields: [
              { key: 'image', label: 'Foto', type: 'image' },
              { key: 'title', label: 'Judul', type: 'text' },
              { key: 'category', label: 'Kategori', type: 'text', placeholder: 'mis. Fashion' },
              { key: 'body', label: 'Keterangan', type: 'textarea' },
            ],
          },
        ],
      },
      {
        id: 'services',
        title: 'Ekosistem Layanan',
        description: 'Ringkasan tiga pilar layanan. Isi tiap pilar diatur di halaman Services → kartu "Pilar Layanan".',
        fields: [
          { key: 'services_eyebrow', label: 'Teks kecil di atas judul', type: 'text' },
          { key: 'services_title', label: 'Judul bagian', type: 'text' },
          { key: 'services_subtitle', label: 'Keterangan bagian', type: 'textarea', wide: true },
          { key: 'services_cta_label', label: 'Tulisan tautan ke halaman Services', type: 'text' },
        ],
      },
      {
        id: 'story',
        title: 'Cerita di Balik AKARRA',
        description: 'Bagian dengan video/foto besar dan paragraf cerita.',
        fields: [
          { key: 'story_title', label: 'Judul', type: 'text', wide: true },
          { key: 'story_body', label: 'Paragraf', type: 'textarea', wide: true },
          { key: 'story_video', label: 'Video', type: 'video', help: 'Kalau diisi, video ini yang tampil.' },
          { key: 'story_image', label: 'Foto', type: 'image', help: 'Dipakai kalau video kosong.' },
        ],
      },
      {
        id: 'clients',
        title: 'Logo Klien',
        description: 'Deretan logo klien yang bergeser otomatis. Kosongkan untuk menyembunyikan bagian ini.',
        fields: [{ key: 'clients_gallery', label: 'Logo klien', type: 'gallery', wide: true }],
      },
      {
        id: 'form',
        title: 'Formulir Kolaborasi',
        description: 'Formulir kontak di bagian paling bawah Beranda.',
        fields: [
          { key: 'form_title', label: 'Judul', type: 'text' },
          { key: 'form_cta_label', label: 'Tulisan tombol kirim', type: 'text' },
          { key: 'form_subtitle', label: 'Keterangan', type: 'textarea', wide: true },
        ],
      },
    ],
  },

  ecosystem: {
    title: 'Ecosystem',
    path: '/ecosystem',
    description: 'Cerita, filosofi, nilai, visi, dan misi AKARRA.',
    sections: [
      heroSection(),
      {
        id: 'story',
        title: 'Cerita Kami',
        description: 'Paragraf cerita berdirinya AKARRA.',
        fields: [
          { key: 'story_title', label: 'Judul', type: 'text', wide: true },
          { key: 'story_body', label: 'Paragraf', type: 'textarea', wide: true },
        ],
      },
      {
        id: 'philosophy',
        title: 'Filosofi Nama & Logo',
        description: 'Penjelasan makna logo, tampil di samping gambar logo.',
        fields: [
          { key: 'philosophy_title', label: 'Judul', type: 'text', wide: true },
          { key: 'philosophy_body', label: 'Paragraf', type: 'textarea', wide: true },
        ],
      },
      {
        id: 'standard',
        title: 'The AKARRA Standard',
        description: 'Foto, paragraf, dan daftar nilai perusahaan (juga tampil sebagai deretan kotak nilai).',
        fields: [
          { key: 'standard_title', label: 'Judul', type: 'text' },
          { key: 'standard_image', label: 'Foto', type: 'image' },
          { key: 'standard_body', label: 'Paragraf', type: 'textarea', wide: true },
          {
            key: 'values',
            label: 'Daftar nilai',
            type: 'list',
            wide: true,
            itemLabel: 'Nilai',
            titleKey: 'name',
            newItem: { name: '', label: '', body: '' },
            fields: [
              { key: 'name', label: 'Nama nilai', type: 'text', placeholder: 'mis. Excellence' },
              { key: 'label', label: 'Terjemahan / sebutan', type: 'text', placeholder: 'mis. Keunggulan' },
              { key: 'body', label: 'Penjelasan', type: 'textarea' },
            ],
          },
        ],
      },
      {
        id: 'vision',
        title: 'Visi, Misi & Angka',
        description: 'Bagian berlatar gelap berisi visi, daftar misi, dan angka pencapaian.',
        fields: [
          { key: 'vision_title', label: 'Judul visi', type: 'text', wide: true },
          { key: 'vision_body', label: 'Isi visi', type: 'textarea', wide: true },
          { key: 'mission', label: 'Daftar misi', type: 'lines', wide: true, help: 'Satu misi per baris.' },
          {
            key: 'stats',
            label: 'Angka pencapaian',
            type: 'list',
            wide: true,
            itemLabel: 'Angka',
            titleKey: 'label',
            newItem: { value: '', label: '' },
            compact: true,
            fields: [
              { key: 'value', label: 'Angka', type: 'text', placeholder: 'mis. 450+' },
              { key: 'label', label: 'Keterangan', type: 'text', placeholder: 'mis. Pengrajin' },
            ],
          },
        ],
      },
    ],
  },

  products: {
    title: 'Products',
    path: '/products',
    description: 'Koleksi produk, AKARRA Labs, dan layanan digital.',
    sections: [
      heroSection(),
      {
        id: 'textile',
        title: 'Tekstil & Fashion',
        description: 'Judul, paragraf, dan kartu produk bergambar.',
        fields: [
          { key: 'textile_title', label: 'Judul', type: 'text', wide: true },
          { key: 'textile_body', label: 'Paragraf', type: 'textarea', wide: true },
          {
            key: 'items',
            label: 'Kartu produk',
            type: 'list',
            wide: true,
            itemLabel: 'Produk',
            titleKey: 'name',
            newItem: { name: '', label: '', image: '', tag: '' },
            fields: [
              { key: 'image', label: 'Foto produk', type: 'image' },
              { key: 'name', label: 'Nama produk', type: 'text' },
              { key: 'label', label: 'Keterangan kecil', type: 'text', placeholder: 'mis. Edisi Terbatas 01' },
              { key: 'tag', label: 'Tulisan tombol/label', type: 'text', placeholder: 'mis. Reserve' },
            ],
          },
        ],
      },
      {
        id: 'labs',
        title: 'AKARRA Labs',
        description: 'Kartu-kartu eksperimen dan satu kartu studi kasus bergambar.',
        fields: [
          { key: 'labs_title', label: 'Judul bagian', type: 'text', wide: true },
          {
            key: 'labs',
            label: 'Kartu eksperimen',
            type: 'list',
            wide: true,
            itemLabel: 'Kartu',
            titleKey: 'title',
            newItem: { title: '', body: '' },
            fields: titleBodyItem(),
          },
          {
            key: 'whitepaper',
            label: 'Kartu studi kasus',
            type: 'object',
            wide: true,
            fields: [
              { key: 'image', label: 'Foto', type: 'image' },
              { key: 'label', label: 'Label kecil', type: 'text', placeholder: 'mis. Studi Eksperimental 042' },
              { key: 'title', label: 'Judul', type: 'text' },
              { key: 'body', label: 'Keterangan', type: 'textarea' },
            ],
          },
        ],
      },
      {
        id: 'digital',
        title: 'Strategi Digital',
        description: 'Judul, paragraf, dan poin-poin layanan digital.',
        fields: [
          { key: 'digital_title', label: 'Judul', type: 'text', wide: true },
          { key: 'digital_body', label: 'Paragraf', type: 'textarea', wide: true },
          {
            key: 'digital_items',
            label: 'Poin layanan',
            type: 'list',
            wide: true,
            itemLabel: 'Poin',
            titleKey: 'title',
            newItem: { title: '', body: '' },
            fields: titleBodyItem(),
          },
        ],
      },
      ctaSection(),
    ],
  },

  services: {
    title: 'Services',
    path: '/services',
    description: 'Pilar layanan, galeri, dan alasan memilih AKARRA.',
    sections: [
      heroSection({ withImage: true }),
      {
        id: 'pillars',
        title: 'Pilar Layanan',
        description:
          'Tiga pilar layanan. Pilar 1 & 2 tampil lengkap di halaman Services; ketiganya juga tampil ringkas di Beranda.',
        fields: [
          {
            key: 'pillars',
            label: 'Daftar pilar',
            type: 'list',
            wide: true,
            itemLabel: 'Pilar',
            titleKey: 'name',
            newItem: { name: '', label: '', body: '', bullets: [], subcards: [], image: '' },
            fields: [
              { key: 'image', label: 'Foto pilar', type: 'image' },
              { key: 'name', label: 'Nama pilar', type: 'text' },
              { key: 'label', label: 'Sebutan kecil', type: 'text', placeholder: 'mis. Infrastruktur' },
              { key: 'body', label: 'Penjelasan', type: 'textarea' },
              { key: 'bullets', label: 'Poin keahlian', type: 'lines', help: 'Satu poin per baris.' },
              {
                key: 'subcards',
                label: 'Kartu detail',
                type: 'list',
                itemLabel: 'Kartu detail',
                titleKey: 'title',
                newItem: { title: '', body: '', bullets: [] },
                fields: [
                  ...titleBodyItem(),
                  { key: 'bullets', label: 'Poin', type: 'lines', help: 'Satu poin per baris.' },
                ],
              },
              { key: 'items', label: 'Bidang usaha (cadangan, belum tampil di situs)', type: 'lines' },
            ],
          },
        ],
      },
      {
        id: 'gallery',
        title: 'Galeri Foto',
        description: 'Foto yang bergeser otomatis di halaman Services, juga tampil sebagai pratinjau di Beranda.',
        fields: [{ key: 'gallery', label: 'Foto galeri', type: 'gallery', wide: true }],
      },
      {
        id: 'growth',
        title: 'Strategi & Pertumbuhan Digital',
        description: 'Bagian berlatar gelap dengan tiga kartu layanan.',
        fields: [
          { key: 'growth_title', label: 'Judul', type: 'text', wide: true },
          { key: 'growth_body', label: 'Paragraf', type: 'textarea', wide: true },
          {
            key: 'amplification_cards',
            label: 'Kartu layanan',
            type: 'list',
            wide: true,
            itemLabel: 'Kartu',
            titleKey: 'title',
            newItem: { title: '', body: '', bullets: [] },
            fields: [...titleBodyItem(), { key: 'bullets', label: 'Poin', type: 'lines', help: 'Satu poin per baris.' }],
          },
        ],
      },
      {
        id: 'why',
        title: 'Mengapa AKARRA',
        description: 'Daftar bernomor alasan memilih AKARRA.',
        fields: [
          { key: 'why_title', label: 'Judul', type: 'text', wide: true },
          {
            key: 'why_items',
            label: 'Daftar alasan',
            type: 'list',
            wide: true,
            itemLabel: 'Alasan',
            titleKey: 'title',
            newItem: { title: '', body: '' },
            fields: titleBodyItem('Alasan', 'Penjelasan'),
          },
        ],
      },
      ctaSection(),
    ],
  },

  founders: {
    title: 'Founders',
    path: '/founders',
    description: 'Profil para pendiri AKARRA.',
    sections: [
      heroSection(),
      {
        id: 'people',
        title: 'Profil Pendiri',
        description: 'Pendiri 1 tampil di atas, Pendiri 2 di bawah kutipan.',
        fields: [
          {
            key: 'people',
            label: 'Para pendiri',
            type: 'list',
            wide: true,
            itemLabel: 'Pendiri',
            titleKey: 'name',
            newItem: { name: '', role: '', body: '', portrait: '', quote: '', legacy_body: '' },
            fields: [
              { key: 'portrait', label: 'Foto potret', type: 'image' },
              { key: 'name', label: 'Nama lengkap', type: 'text' },
              { key: 'role', label: 'Jabatan', type: 'text' },
              { key: 'body', label: 'Profil singkat', type: 'textarea' },
              { key: 'quote', label: 'Kutipan', type: 'textarea' },
              { key: 'legacy_body', label: 'Paragraf "Building Legacies"', type: 'textarea' },
            ],
          },
        ],
      },
      {
        id: 'quote',
        title: 'Kutipan Tengah',
        description: 'Kutipan besar di antara kedua profil pendiri.',
        fields: [{ key: 'quote', label: 'Kutipan', type: 'textarea', wide: true }],
      },
      ctaSection(),
    ],
  },
}

/** Nilai awal untuk field yang belum ada di database. */
export function emptyValueFor(field) {
  switch (field.type) {
    case 'list':
    case 'lines':
    case 'gallery':
      return []
    case 'object':
      return {}
    default:
      return ''
  }
}

/** Semua key tingkat atas yang dipetakan oleh schema satu grup. */
export function schemaKeys(group) {
  return new Set((SETTING_SCHEMA[group]?.sections ?? []).flatMap((section) => section.fields.map((field) => field.key)))
}
