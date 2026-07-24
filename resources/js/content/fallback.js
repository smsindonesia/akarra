/**
 * Konten cadangan.
 *
 * Dipakai bila grup/field tertentu belum diisi admin, sehingga halaman tetap
 * tampil utuh. Nilai dari `settings` (dibagikan lewat Inertia) selalu
 * menimpa nilai di sini. Strukturnya sengaja dibuat identik dengan
 * SettingSeeder di backend.
 */
export const fallbackContent = {
  global: {
    site_name: 'AKARRA',
    tagline: 'Ecosystem of Excellence',
    description:
      'Ekosistem bisnis terintegrasi di bidang fashion, desain kreatif, event, dan periklanan digital.',
    founded_year: '',
    address: '',
    phone: '',
    whatsapp: '',
    email: '',
    office_hours: 'Senin–Jumat, 09.00–17.00 WIB',
    social: [
      { platform: 'instagram', url: '', label: 'Instagram' },
      { platform: 'tiktok', url: '', label: 'TikTok' },
      { platform: 'linkedin', url: '', label: 'LinkedIn' },
    ],
    nav: [
      { label: 'Ecosystem', path: '/ecosystem' },
      { label: 'Products', path: '/products' },
      { label: 'Services', path: '/services' },
      { label: 'Founders', path: '/founders' },
    ],
    nav_cta_label: 'Start a Conversation',
    footer_note: 'Seluruh hak cipta dilindungi.',
  },

  home: {
    hero_eyebrow: 'AKARRA',
    hero_title: 'Ecosystem of Excellence',
    hero_title_emphasis: 'Excellence',
    hero_subtitle:
      'Ekosistem bisnis terintegrasi yang mempertemukan fashion, kreativitas, dan periklanan dalam satu atap — mendampingi perjalanan brand Anda dari ide hingga eksekusi.',
    hero_cta_label: 'Mulai Kolaborasi',
    hero_image: '',

    narrative_title: 'Membangun Warisan, Bukan Sekadar Bisnis',
    narrative_body:
      'AKARRA bergerak di industri fashion, desain kreatif, event, dan periklanan digital. Melalui tiga pilar utama, kami tidak hanya menjual produk, tetapi membangun identitas dan dampak nyata bagi komunitas fashion dan kreatif Indonesia.',
    narrative_image: '',

    stats: [
      { value: '3', label: 'Pilar Bisnis' },
      { value: '12+', label: 'Segmen Layanan' },
      { value: 'Infinite', label: 'Creative Possibilities' },
      { value: '100%', label: 'Komitmen pada Klien' },
    ],

    services_title: 'The Services Ecosystem',
    services_subtitle:
      'Tiga pilar yang saling menopang, dirancang untuk menemani brand di setiap tahap pertumbuhannya.',
    services_cta_label: 'Lihat seluruh layanan',

    solutions_title: 'Curated Solutions',
    solutions_subtitle: 'Rangkaian produk dan karya yang lahir dari ekosistem kami.',

    story_title: 'Cerita di Balik AKARRA',
    story_body:
      'Kami percaya setiap brand memiliki cerita yang layak diceritakan dengan elegan. Bersama kami, Anda tidak hanya membangun bisnis — Anda membangun warisan.',
    story_image: '',
    story_cta_label: 'Kenali ekosistem kami',

    founders_title: 'Meet the Founders',
    founders_subtitle: 'Dua orang di balik arah dan standar AKARRA.',

    form_title: 'Mari Berkolaborasi',
    form_subtitle: 'Konsultasi awal gratis, tanpa komitmen. Ceritakan apa yang sedang Anda bangun.',
    form_cta_label: 'Kirim pesan',
  },

  ecosystem: {
    hero_title: 'Ecosystem of Excellence',
    hero_title_emphasis: 'Excellence',
    hero_subtitle:
      'Mengenal lebih dekat siapa kami, apa yang kami perjuangkan, dan bagaimana kami bekerja.',

    story_title: 'Cerita Kami',
    story_body:
      'AKARRA didirikan oleh Febri Khoirul Imam dan Nanda Fifia Putri, lahir dari visi untuk menciptakan platform bisnis yang tidak hanya menjual produk, tetapi juga membangun identitas dan dampak nyata bagi komunitas fashion dan kreatif Indonesia.',

    philosophy_title: 'Filosofi Nama & Logo',
    philosophy_body:
      'Logo AKARRA terinspirasi dari geometri berlian dan mandala tradisional — perpaduan antara kemewahan modern dan kearifan lokal.',
    philosophy_items: [
      { title: 'Berlian & Kemewahan', body: 'Struktur geometris berlian mencerminkan kualitas premium dan eksklusivitas.' },
      { title: 'Energi & Dinamisme', body: 'Segitiga yang saling bertautan melambangkan inovasi dan kolaborasi.' },
      { title: 'Mandala & Harmoni', body: 'Pola melingkar mengacu pada tradisi mandala Nusantara.' },
      { title: 'Emas & Kepercayaan', body: 'Warna emas melambangkan prestise dan kepercayaan.' },
    ],

    standard_title: 'The AKARRA Standard',
    standard_body:
      'Standar tertinggi di setiap produk dan layanan, sesuai nilai Excellence dan Elegance yang kami pegang.',
    standard_image: '',
    values: [
      { name: 'Excellence', label: 'Keunggulan', body: 'Standar tertinggi dalam setiap produk dan layanan.' },
      { name: 'Integrity', label: 'Integritas', body: 'Transparansi dan kepercayaan di setiap kemitraan.' },
      { name: 'Innovation', label: 'Inovasi', body: 'Terus berevolusi dan berpikir di luar konvensi.' },
      { name: 'Collaboration', label: 'Kolaborasi', body: 'Tumbuh bersama klien, mitra, dan komunitas kreatif.' },
      { name: 'Elegance', label: 'Elegansi', body: 'Estetika dan keindahan dalam setiap karya.' },
    ],

    vision_title: 'A Global Vision of Shared Success',
    vision_body:
      'Menjadi ekosistem bisnis fashion dan kreatif terdepan di Indonesia yang melahirkan brand-brand berkelas dunia dengan akar budaya lokal.',
    mission: [
      'Membangun platform fashion terintegrasi dari produksi hingga distribusi.',
      'Menghadirkan layanan desain dan event kreatif berkelas premium.',
      'Memperkuat brand lokal melalui strategi digital dan periklanan inovatif.',
      'Menciptakan ekosistem kolaboratif untuk pelaku industri kreatif Indonesia.',
      'Mendorong pertumbuhan bisnis klien melalui solusi holistik dan terukur.',
    ],
  },

  products: {
    hero_title: 'The Artifacts of Excellence',
    hero_title_emphasis: 'Excellence',
    hero_subtitle: 'Apa yang kami hasilkan — dari helai kain hingga kampanye digital.',

    textile_title: 'Textile Engineering & Fashion',
    textile_body:
      'Produksi pakaian berkualitas dengan standar industri modern, melayani kebutuhan fashion dari skala lokal hingga nasional.',
    textile_images: [],

    labs_title: 'AKARRA Labs',
    labs_body:
      'Ruang eksperimen desain dan pengembangan produk, tempat ide diuji sebelum menjadi karya.',
    labs_image: '',

    digital_title: 'Strategic Dominance In Digital Realms',
    digital_body:
      'Perencanaan dan eksekusi kampanye digital yang terukur, dari penempatan media hingga pengelolaan performa.',
    digital_image: '',

    cta_title: 'Ready to redefine your business?',
    cta_subtitle:
      'Mari berdiskusi tentang bagaimana ekosistem AKARRA dapat mendukung pertumbuhan bisnis Anda.',
    cta_label: 'Hubungi kami',
  },

  services: {
    hero_title: 'Architecting Excellence.',
    hero_title_emphasis: 'Excellence',
    hero_subtitle: 'Apa yang kami kerjakan bersama Anda — dari ide pertama hingga brand yang dikenal.',
    hero_image: '',

    pillars: [
      {
        name: 'Akarra Fashionpreneur',
        label: 'Industri Pakaian & Perdagangan Fashion',
        body: 'Produksi pakaian jadi berkualitas dengan standar industri modern, melayani kebutuhan fashion dari skala lokal hingga nasional.',
        items: ['Industri Pakaian Jadi', 'Perdagangan Besar Pakaian', 'Distribusi & Retail'],
        image: '',
      },
      {
        name: 'Akarra Creative Labs',
        label: 'Desain, Produksi & Event',
        body: 'Layanan desain dan penyelenggaraan acara berkelas premium, dari konsep hingga pelaksanaan.',
        items: ['Desain Grafis & Branding', 'Produksi Konten', 'Event & Pertunjukan'],
        image: '',
      },
      {
        name: 'Akarra Advertising',
        label: 'Periklanan & Strategi Digital',
        body: 'Strategi digital dan periklanan inovatif untuk memperkuat posisi brand di pasar.',
        items: ['Strategi Digital', 'Media Placement', 'Social Media Management'],
        image: '',
      },
    ],

    growth_title: 'Digital Strategy & Growth',
    growth_body: 'Pendampingan dari ide pertama hingga eksekusi, dengan hasil yang bisa diukur.',

    why_title: 'Mengapa AKARRA',
    why_items: [
      { title: 'Ekosistem lengkap dalam satu atap', body: 'Produksi fashion, desain kreatif, event, hingga periklanan digital ditangani satu mitra.' },
      { title: 'Kualitas premium & elegan', body: 'Standar tertinggi di setiap produk dan layanan.' },
      { title: 'Berakar pada budaya lokal', body: 'Brand berkelas dunia tanpa melepaskan akar budaya Indonesia.' },
      { title: 'Kolaboratif & transparan', body: 'Kami tumbuh bersama klien, mitra, dan komunitas kreatif.' },
      { title: 'Solusi holistik & terukur', body: 'Pendampingan dari ide pertama hingga eksekusi.' },
    ],

    cta_title: 'Ready to redefine your legacy?',
    cta_subtitle: 'Konsultasi awal gratis, tanpa komitmen.',
    cta_label: 'Mulai kolaborasi',
  },

  founders: {
    hero_title: 'The Stewardship of Legacy.',
    hero_title_emphasis: 'Legacy',
    hero_subtitle: 'Dua orang yang menjaga arah dan standar AKARRA.',

    people: [
      { name: 'Febri Khoirul Imam', role: 'Komisaris', body: '', portrait: '' },
      {
        name: 'Nanda Fifia Putri',
        role: 'Direktur Utama',
        body: 'Visioner di balik ekosistem AKARRA, membawa pengalaman lintas industri fashion, kreatif, dan bisnis digital untuk membangun brand yang berdampak.',
        portrait: '',
      },
    ],

    quote: 'Anda tidak hanya membangun bisnis — Anda membangun warisan.',

    cta_title: 'Join the Inner Circle',
    cta_subtitle:
      'AKARRA adalah mitra perjalanan bisnis Anda — dari ide pertama hingga brand yang dikenal dunia.',
    cta_label: 'Mari berkenalan',
  },
}

export const interestOptions = [
  { value: 'fashionpreneur', label: 'Akarra Fashionpreneur' },
  { value: 'creative-labs', label: 'Akarra Creative Labs' },
  { value: 'advertising', label: 'Akarra Advertising' },
  { value: 'other', label: 'Lainnya' },
]
