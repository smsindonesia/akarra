<?php

return [

    'encoding' => 'UTF-8',
    'finalize' => true,
    'ignoreNonStrings' => false,
    'cachePath' => storage_path('app/purifier'),
    'cacheFileMode' => 0755,

    'settings' => [

        'default' => [
            'HTML.Doctype' => 'HTML 4.01 Transitional',
            'HTML.Allowed' => 'div,b,strong,i,em,u,a[href|title],ul,ol,li,p[style],br,span,img[width|height|alt|src]',
            'CSS.AllowedProperties' => 'font,font-size,font-weight,font-style,text-align',
            'AutoFormat.AutoParagraph' => true,
            'AutoFormat.RemoveEmpty' => true,
        ],

        /*
        |----------------------------------------------------------------------
        | Profil 'article' — untuk isi artikel yang dibuat editor Trix
        |----------------------------------------------------------------------
        |
        | Tag disesuaikan dengan apa yang benar-benar dihasilkan Trix:
        | heading (h1), bold, italic, strike, link, list, blockquote, pre,
        | dan figure untuk lampiran gambar.
        |
        | Yang sengaja TIDAK diizinkan: script, iframe, style, form, dan
        | atribut on* — inilah inti perlindungan dari XSS.
        |
        */
        'article' => [
            'HTML.Doctype' => 'HTML 4.01 Transitional',
            'HTML.Allowed' => 'h1,h2,h3,h4,p,br,strong,b,em,i,u,s,del,a[href|title|target|rel],'
                .'ul,ol,li,blockquote,pre,code,hr,'
                .'figure[class],figcaption,img[src|alt|width|height|loading],'
                .'div[class],span[class]',
            'HTML.TargetBlank' => true,
            'HTML.Nofollow' => true,
            'CSS.AllowedProperties' => '',
            'AutoFormat.AutoParagraph' => false,
            'AutoFormat.RemoveEmpty' => true,
            'AutoFormat.RemoveEmpty.RemoveNbsp' => true,
            'Attr.AllowedFrameTargets' => ['_blank'],
        ],

        /*
        | Profil 'plain' — untuk field settings yang hanya boleh penekanan ringan
        | (headline, subheadline). Mencegah admin tanpa sengaja menempel HTML
        | dari Word yang merusak tipografi editorial.
        */
        'plain' => [
            'HTML.Doctype' => 'HTML 4.01 Transitional',
            'HTML.Allowed' => 'em,i,strong,b,br,a[href|title]',
            'AutoFormat.AutoParagraph' => false,
            'AutoFormat.RemoveEmpty' => true,
        ],

        /*
        | HTMLPurifier tidak mengenal elemen HTML5 seperti figure/figcaption
        | secara bawaan — mendaftarkannya di HTML.Allowed saja tidak cukup dan
        | justru membuat HTMLPurifier gagal (trigger_error "Element 'figure'
        | is not supported"). Definisi manual di bawah ini yang membuat
        | profil 'article' benar-benar bisa memakainya untuk lampiran gambar.
        */
        'custom_definition' => [
            'id' => 'akarra-article-html5',
            'rev' => 2,
            'debug' => false,
            'elements' => [
                ['figure', 'Block', 'Optional: (img | figcaption)*', 'Common'],
                ['figcaption', 'Inline', 'Optional: #PCDATA | Inline', 'Common'],
            ],
            'attributes' => [
                ['img', 'loading', 'Enum#lazy,eager,auto'],
            ],
        ],

    ],

];
