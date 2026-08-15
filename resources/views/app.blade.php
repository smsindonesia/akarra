<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Title, deskripsi, dan tag SEO lain sengaja tidak ditulis statis di
             sini. Semuanya diatur per halaman lewat komponen Seo.jsx (Inertia
             Head) dan dirender lewat @inertiaHead di bawah — baik lewat SSR
             maupun (saat SSR mati) diisi ulang oleh JS begitu halaman
             ter-hidrasi. Menulis default statis di sini akan dobel dengan
             tag yang sama begitu SSR aktif. --}}
        <link rel="icon" type="image/png" href="/favicon.png">
        <link rel="apple-touch-icon" href="/favicon.png">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link
            href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@300;400;500&family=Inter:wght@300;400;500&display=swap"
            rel="stylesheet"
        />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
