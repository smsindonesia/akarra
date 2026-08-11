<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

/**
 * Konten awal kelima halaman publik.
 *
 * Struktur di bawah ini sengaja dibuat identik dengan
 * `resources/js/content/fallback.js` (nilai fallback yang dipakai frontend
 * saat sebuah field belum diisi admin) — keduanya harus tetap sinkron setiap
 * kali salah satunya diubah, supaya seed data dan tampilan fallback tidak
 * saling bertentangan.
 *
 * Field berakhiran _emphasis berisi satu kata yang dicetak miring pada
 * headline (mis. "Ecosystem of Excellence").
 */
class SettingSeeder extends Seeder
{
    /**
     * Konten yang sama disemai untuk kedua bahasa (id & en) — nilainya identik
     * di awal, admin menerjemahkan belakangan lewat tab bahasa di panel
     * Pengaturan. Ini cuma nilai awal instalasi baru; database yang sudah
     * berjalan tidak disentuh oleh migrasi/seeder ini (lihat catatan di
     * migration penambahan kolom locale).
     */
    public function run(): void
    {
        foreach (['id', 'en'] as $locale) {
            foreach ($this->settings() as $group => $items) {
                foreach ($items as $key => $item) {
                    [$value, $type] = is_array($item) && isset($item[1])
                        ? [$item[0], $item[1]]
                        : [$item, 'string'];

                    Setting::updateOrCreate(
                        ['group' => $group, 'key' => $key, 'locale' => $locale],
                        [
                            'value' => $type === 'json' ? json_encode($value, JSON_UNESCAPED_UNICODE) : $value,
                            'type' => $type,
                        ]
                    );
                }
            }
        }
    }

    private function settings(): array
    {
        return [

            // ---------------------------------------------------------------
            'global' => [
                'site_name' => 'AKARRA',
                'tagline' => 'Ecosystem of Excellence',
                'description' => 'Ekosistem bisnis terintegrasi di bidang fashion, desain kreatif, event, dan periklanan digital.',
                'founded_year' => '',
                'address' => '',
                'phone' => '',
                'whatsapp' => '',
                'email' => '',
                'office_hours' => 'Senin sampai Jumat, pukul 09.00 s.d. 17.00 WIB',
                'social' => [[
                    ['platform' => 'instagram', 'url' => '', 'label' => 'Instagram'],
                    ['platform' => 'tiktok', 'url' => '', 'label' => 'TikTok'],
                    ['platform' => 'linkedin', 'url' => '', 'label' => 'LinkedIn'],
                ], 'json'],
                'nav' => [[
                    ['label' => 'Ecosystem', 'path' => '/ecosystem'],
                    ['label' => 'Products', 'path' => '/products'],
                    ['label' => 'Services', 'path' => '/services'],
                    ['label' => 'Articles', 'path' => '/articles'],
                    ['label' => 'Founders', 'path' => '/founders'],
                ], 'json'],
                'nav_cta_label' => 'Start a Conversation',
                'footer_note' => 'Seluruh hak cipta dilindungi.',
            ],

            // ---------------------------------------------------------------
            'home' => [
                'hero_eyebrow' => 'A Legacy in the Making',
                'hero_title' => 'Ecosystem of Excellence',
                'hero_title_emphasis' => 'Excellence',
                'hero_subtitle' => 'A sophisticated convergence of Fashionpreneurial spirit, Creative Labs innovation, and Strategic Advertising excellence. AKARRA is built for the visionaries of tomorrow.',
                'hero_cta_label' => 'Explore the Ecosystem',
                'hero_secondary_cta_label' => 'Our Philosophy',
                'hero_image' => '',

                'narrative_title' => 'Membangun Warisan, Bukan Sekadar Bisnis',
                'narrative_body' => 'AKARRA bergerak di industri fashion, desain kreatif, event, dan periklanan digital. Melalui tiga pilar utama, kami tidak hanya menjual produk, tetapi membangun identitas dan dampak nyata bagi komunitas fashion dan kreatif Indonesia.',
                'narrative_image' => '/images/content/home-narrative.jpg',
                'narrative_quote' => 'We believe that true prestige is found in the intersection of mathematical precision and artistic soul. Our journey is about creating impact that resonates across generations.',
                'narrative_quote_attribution' => 'The Founders of AKARRA',
                'narrative_badge' => 'Est. 2024',

                'values' => [[
                    ['name' => 'Excellence', 'body' => 'Uncompromising quality in every stitch, frame, and strategy we execute.'],
                    ['name' => 'Integrity', 'body' => 'Building trust through transparency and ethical leadership in all domains.'],
                    ['name' => 'Innovation', 'body' => 'Pushing boundaries through creative experimentation and modern technology.'],
                    ['name' => 'Elegance', 'body' => 'A commitment to refined aesthetics that speak without needing to shout.'],
                ], 'json'],

                'services_eyebrow' => 'Our Three Pillars',
                'services_title' => 'The Services Ecosystem',
                'services_subtitle' => 'Tiga pilar yang saling menopang, dirancang untuk menemani brand di setiap tahap pertumbuhannya.',
                'services_cta_label' => 'Lihat seluruh layanan',

                'solutions_title' => 'Curated Solutions',
                'solutions_subtitle' => 'Rangkaian produk dan karya yang lahir dari ekosistem kami.',
                'solutions' => [[
                    [
                        'title' => 'Bespoke Collection',
                        'body' => 'Made-to-measure excellence for the modern executive.',
                        'image' => '/images/content/home-solution-bespoke-collection.jpg',
                        'category' => 'Fashion',
                    ],
                    [
                        'title' => 'Signature Textiles',
                        'body' => 'Ethically sourced, world-class fabric curation.',
                        'image' => '/images/content/home-solution-signature-textiles.jpg',
                        'category' => 'Fashion',
                    ],
                    [
                        'title' => 'Visual Storytelling',
                        'body' => 'Narasi visual yang membangun kedekatan emosional dengan audiens.',
                        'image' => '/images/content/home-solution-visual-storytelling.jpg',
                        'category' => 'Creative',
                    ],
                    [
                        'title' => 'Brand Positioning',
                        'body' => 'Strategi penempatan brand yang tajam dan terukur di pasar digital.',
                        'image' => '/images/content/home-solution-brand-positioning.jpg',
                        'category' => 'Advertising',
                    ],
                ], 'json'],

                'story_title' => 'Cerita di Balik AKARRA',
                'story_body' => 'Kami percaya setiap brand memiliki cerita yang layak diceritakan dengan elegan. Bersama kami, Anda tidak hanya membangun bisnis, tetapi juga membangun warisan.',
                'story_image' => '/images/content/home-story.jpg',
                'story_video' => '',

                'founders_title' => 'Meet the Founders',
                'founders_subtitle' => 'Dua orang di balik arah dan standar AKARRA.',

                'form_title' => 'Mari Berkolaborasi',
                'form_subtitle' => 'Konsultasi awal gratis, tanpa komitmen. Ceritakan apa yang sedang Anda bangun.',
                'form_cta_label' => 'Kirim pesan',
            ],

            // ---------------------------------------------------------------
            'ecosystem' => [
                'hero_eyebrow' => 'The Architecture of Aspiration',
                'hero_title' => 'Ecosystem of Excellence',
                'hero_title_emphasis' => 'Excellence',
                'hero_subtitle' => 'A multi-disciplinary sanctuary where precision meets poetry. AKARRA is not merely a brand; it is a unified sensory landscape where fashion, art, and strategy coalesce into a singular, prestigious standard.',

                'story_title' => 'Cerita Kami',
                'story_body' => 'AKARRA didirikan oleh Febri Khoirul Imam dan Nanda Fifia Putri, lahir dari visi untuk menciptakan platform bisnis yang tidak hanya menjual produk, tetapi juga membangun identitas dan dampak nyata bagi komunitas fashion dan kreatif Indonesia.',

                'philosophy_title' => 'Filosofi Nama & Logo',
                'philosophy_body' => 'Logo AKARRA terinspirasi dari geometri berlian dan mandala tradisional, perpaduan antara kemewahan modern dan kearifan lokal.',
                'philosophy_items' => [[
                    ['title' => 'Berlian & Kemewahan', 'body' => 'Struktur geometris berlian mencerminkan kualitas premium dan eksklusivitas.'],
                    ['title' => 'Energi & Dinamisme', 'body' => 'Segitiga yang saling bertautan melambangkan inovasi dan kolaborasi.'],
                    ['title' => 'Mandala & Harmoni', 'body' => 'Pola melingkar mengacu pada tradisi mandala Nusantara.'],
                    ['title' => 'Emas & Kepercayaan', 'body' => 'Warna emas melambangkan prestise dan kepercayaan.'],
                ], 'json'],

                'standard_title' => 'The AKARRA Standard',
                'standard_body' => 'Standar tertinggi di setiap produk dan layanan, sesuai nilai Excellence dan Elegance yang kami pegang.',
                'standard_image' => '/images/content/ecosystem-standard.jpg',
                'values' => [[
                    ['name' => 'Excellence', 'label' => 'Keunggulan', 'body' => 'Standar tertinggi dalam setiap produk dan layanan.'],
                    ['name' => 'Integrity', 'label' => 'Integritas', 'body' => 'Transparansi dan kepercayaan di setiap kemitraan.'],
                    ['name' => 'Innovation', 'label' => 'Inovasi', 'body' => 'Terus berevolusi dan berpikir di luar konvensi.'],
                    ['name' => 'Collaboration', 'label' => 'Kolaborasi', 'body' => 'Tumbuh bersama klien, mitra, dan komunitas kreatif.'],
                    ['name' => 'Elegance', 'label' => 'Elegansi', 'body' => 'Estetika dan keindahan dalam setiap karya.'],
                ], 'json'],

                'vision_title' => 'A Global Vision of Shared Success',
                'vision_body' => 'Menjadi ekosistem bisnis fashion dan kreatif terdepan di Indonesia yang melahirkan brand-brand berkelas dunia dengan akar budaya lokal.',
                'mission' => [[
                    'Membangun platform fashion terintegrasi dari produksi hingga distribusi.',
                    'Menghadirkan layanan desain dan event kreatif berkelas premium.',
                    'Memperkuat brand lokal melalui strategi digital dan periklanan inovatif.',
                    'Menciptakan ekosistem kolaboratif untuk pelaku industri kreatif Indonesia.',
                    'Mendorong pertumbuhan bisnis klien melalui solusi holistik dan terukur.',
                ], 'json'],
                'stats' => [[
                    ['value' => '12', 'label' => 'Global Ateliers'],
                    ['value' => '450+', 'label' => 'Artisans'],
                    ['value' => '24', 'label' => 'Strategic Partners'],
                    ['value' => '100%', 'label' => 'Ethical Sourcing'],
                ], 'json'],
            ],

            // ---------------------------------------------------------------
            'products' => [
                'hero_eyebrow' => 'Curated Collections',
                'hero_title' => 'The Artifacts of Excellence',
                'hero_title_emphasis' => 'Excellence',
                'hero_subtitle' => 'Explore AKARRA\'s product ecosystem, where high-performance logic meets artisanal craftsmanship. Our solutions are designed for those who demand uncompromising results.',

                'textile_title' => 'Textile Engineering & Fashion',
                'textile_body' => 'Precision-tailored garments that redefine high-net-worth identity through rare fibers and architectural silhouettes.',
                'items' => [[
                    ['name' => 'The Meridian Suite', 'label' => 'Limited Release 01', 'image' => '/images/content/product-meridian-suite.jpg', 'tag' => 'Reserve'],
                    ['name' => 'Artisanal Accents', 'label' => 'Fiber Innovation', 'image' => '/images/content/product-artisanal-accents.jpg', 'tag' => 'Explore'],
                ], 'json'],

                'labs_title' => 'AKARRA Labs',
                'labs_body' => 'Ruang eksperimen desain dan pengembangan produk, tempat ide diuji sebelum menjadi karya.',
                'labs' => [[
                    ['title' => 'Material Bio-Synthesis', 'body' => 'Developing sustainable, lab-grown alternatives to rare earth materials for luxury interiors.'],
                    ['title' => 'Cognitive Branding', 'body' => 'A methodology for creating brand resonance through neuro-aesthetic principles and sensory mapping.'],
                ], 'json'],
                'whitepaper' => [[
                    'label' => 'Experimental Case 042',
                    'title' => 'Spatial Intelligence',
                    'body' => 'Revolutionizing human-interface interaction through biological feedback loops and predictive spatial modeling.',
                    'image' => '/images/content/product-whitepaper-spatial-intelligence.jpg',
                ], 'json'],

                'digital_title' => 'Strategic Dominance in Digital Realms',
                'digital_body' => 'Perencanaan dan eksekusi kampanye digital yang terukur, dari penempatan media hingga pengelolaan performa.',
                'digital_items' => [[
                    ['title' => 'Omnichannel Mastery', 'body' => 'Seamlessly integrating brand narrative across 12+ touchpoints for a unified, elite user experience.'],
                    ['title' => 'Data-Driven Narratives', 'body' => 'Leveraging proprietary algorithms to forecast cultural shifts and position brands ahead of the curve.'],
                    ['title' => 'High-Conversion Visuals', 'body' => 'Cinematic production standards applied to programmatic advertising for maximum prestige and ROI.'],
                ], 'json'],

                'cta_title' => 'Ready to redefine your baseline?',
                'cta_subtitle' => 'Our limited-client engagement model ensures each partnership receives the full weight of AKARRA\'s strategic and creative machinery.',
                'cta_label' => 'Request Audit',
                'cta_secondary_label' => 'Join the Waitlist',
            ],

            // ---------------------------------------------------------------
            'services' => [
                'hero_title' => 'Architecting Excellence.',
                'hero_title_emphasis' => 'Excellence',
                'hero_subtitle' => 'Apa yang kami kerjakan bersama Anda, dari ide pertama hingga brand yang dikenal.',
                'hero_image' => '/images/content/services-hero.jpg',

                'hero_eyebrow' => 'Our Capabilities',

                'pillars' => [[
                    [
                        'name' => 'Fashionpreneur',
                        'label' => 'Infrastructure',
                        'body' => 'A comprehensive ecosystem for established designers and emerging labels to scale with integrity. We handle the complexities of the supply chain so you can focus on the soul of the brand.',
                        'items' => ['Industri Pakaian Jadi', 'Perdagangan Besar Pakaian', 'Distribusi & Retail'],
                        'bullets' => ['Brand Development', 'Textile Sourcing', 'Atelier Manufacturing', 'Distribution Strategy'],
                        'subcards' => [
                            [
                                'title' => 'The Atelier',
                                'body' => 'Bespoke sample making and technical pattern drafting for high-fashion silhouettes.',
                                'bullets' => ['Haute Couture Sampling', 'Tech Pack Development'],
                            ],
                            [
                                'title' => 'Global Production',
                                'body' => 'Ethical, small-batch manufacturing and large-scale textile sourcing with a focus on sustainability.',
                                'bullets' => ['Ethical Sourcing', 'QC Management'],
                            ],
                        ],
                        'image' => '/images/content/services-pillar-fashionpreneur.jpg',
                    ],
                    [
                        'name' => 'Creative Labs',
                        'label' => 'Identity',
                        'body' => 'The intellectual engine of AKARRA. We translate brand ethos into visual and experiential narratives that resonate with a discerning global audience.',
                        'items' => ['Desain Grafis & Branding', 'Produksi Konten', 'Event & Pertunjukan'],
                        'bullets' => ['Visual Storytelling', 'UI/UX Innovation', 'Photography & Cinema', 'Experimental Design'],
                        'subcards' => [
                            [
                                'title' => 'Art Direction',
                                'body' => 'Curation of visual identity, campaign imagery, and high-fidelity brand guidelines.',
                                'bullets' => ['Visual Strategy', 'Identity Design'],
                            ],
                            [
                                'title' => 'Immersive Events',
                                'body' => 'Bespoke product launches and runway shows designed to evoke emotional intelligence.',
                                'bullets' => ['Spatial Design', 'Guest Curation'],
                            ],
                        ],
                        'image' => '/images/content/services-pillar-creative-labs.jpg',
                    ],
                    [
                        'name' => 'Advertising',
                        'label' => 'Periklanan & Strategi Digital',
                        'body' => 'Strategi digital dan periklanan inovatif untuk memperkuat posisi brand di pasar.',
                        'items' => ['Strategi Digital', 'Media Placement', 'Social Media Management'],
                        'bullets' => ['Brand Positioning', 'Market Penetration', 'Digital Growth', 'Strategic Media'],
                        'image' => '',
                    ],
                ], 'json'],

                // Galeri gabungan (bukan per-pillar) yang tampil auto-slide di halaman
                // Services dan sebagai preview di beranda — hingga 10 foto (lihat
                // GalleryField di admin, MAX_PHOTOS).
                'gallery' => [],

                'growth_title' => 'Digital Strategy & Growth',
                'growth_body' => 'Data-driven precision meets creative intuition. We don\'t just find your audience; we cultivate a community of advocates.',
                'amplification_cards' => [[
                    [
                        'title' => 'Digital Strategy',
                        'body' => 'Comprehensive market analysis and growth mapping for the luxury sector.',
                        'bullets' => ['Market Intelligence', 'Funnel Optimization'],
                    ],
                    [
                        'title' => 'Content Production',
                        'body' => 'High-end video, editorial photography, and interactive storytelling.',
                        'bullets' => ['4K Editorial Video', 'Social Narratives'],
                    ],
                    [
                        'title' => 'Brand Growth',
                        'body' => 'Strategic partnerships, influencer seeding, and global expansion.',
                        'bullets' => ['Strategic PR', 'Cross-Border Scaling'],
                    ],
                ], 'json'],

                'why_title' => 'Mengapa AKARRA',
                'why_items' => [[
                    ['title' => 'Ekosistem lengkap dalam satu atap', 'body' => 'Produksi fashion, desain kreatif, event, hingga periklanan digital ditangani satu mitra.'],
                    ['title' => 'Kualitas premium & elegan', 'body' => 'Standar tertinggi di setiap produk dan layanan.'],
                    ['title' => 'Berakar pada budaya lokal', 'body' => 'Brand berkelas dunia tanpa melepaskan akar budaya Indonesia.'],
                    ['title' => 'Kolaboratif & transparan', 'body' => 'Kami tumbuh bersama klien, mitra, dan komunitas kreatif.'],
                    ['title' => 'Solusi holistik & terukur', 'body' => 'Pendampingan dari ide pertama hingga eksekusi.'],
                ], 'json'],

                'cta_title' => 'Ready to redefine your legacy?',
                'cta_subtitle' => 'Konsultasi awal gratis, tanpa komitmen.',
                'cta_label' => 'Mulai kolaborasi',
                'cta_secondary_label' => 'Concierge@akarra.com',
            ],

            // ---------------------------------------------------------------
            'founders' => [
                'hero_eyebrow' => 'Architects of Value',
                'hero_title' => 'The Stewardship of Legacy.',
                'hero_title_emphasis' => 'Legacy',
                'hero_subtitle' => 'AKARRA was founded on the principle that excellence is not an act, but a habit. Our leadership is dedicated to the meticulous cultivation of wealth, wisdom, and lasting heritage for the modern visionary.',

                'people' => [[
                    [
                        'name' => 'Febri Khoirul Imam',
                        'role' => 'Direktur Utama',
                        'body' => 'With over two decades of experience in strategic investment and institutional management, Febri Khoirul Imam leads AKARRA with a focus on structural resilience and long-term capital preservation. His background in global financial markets provides the analytical backbone for AKARRA’s most ambitious ecosystems.',
                        'portrait' => '/images/content/founder-febri-portrait.jpg',
                        'quote' => 'Legacy is not what we leave for people, it is what we leave within them. At AKARRA, we build the frameworks where that impact can endure.',
                        'legacy_body' => 'Febri believes that building a legacy requires more than just financial success; it requires a commitment to excellence in every detail. His philosophy centers on ‘Integrated Stewardship,’ the belief that wealth and influence must be managed as a cohesive, purposeful whole.',
                    ],
                    [
                        'name' => 'Nanda Fifia Putri',
                        'role' => 'Komisaris',
                        'body' => 'Nanda Fifia Putri brings a refined perspective to AKARRA’s board, specializing in brand heritage and philanthropic governance. Her career has been defined by the intersection of high-culture and high-finance, ensuring that AKARRA’s products and services maintain their soul as they scale.',
                        'portrait' => '/images/content/founder-nanda-portrait.jpg',
                        'quote' => 'Visionary leadership is about seeing the invisible threads that connect today’s decisions to tomorrow’s heritage.',
                        'legacy_body' => 'Nanda’s philosophy is rooted in ‘Cultural Capital.’ She advocates for the preservation of values alongside value, ensuring that the AKARRA brand serves as a hallmark of prestige and intellectual depth for generations to come.',
                    ],
                ], 'json'],

                'quote' => 'A foundation built on integrity, a future shaped by vision.',

                'cta_title' => 'Join the Inner Circle.',
                'cta_subtitle' => 'Experience the bespoke advisory and ecosystem services that define the AKARRA lifestyle.',
                'cta_label' => 'Request Consultation',
                'cta_secondary_label' => 'View Ecosystem',
            ],

        ];
    }
}
