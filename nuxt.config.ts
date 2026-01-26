// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxtjs/seo'
  ],

  colorMode: {
    classSuffix: ''
  },

  devServer: {
    host: '0.0.0.0',
    port: 3000
  },

  site: {
    url: 'https://mark.photix.cc',
    name: 'Photix Mark',
    description: '为你的摄影作品，优雅地附上专属水印与参数。纯前端处理，隐私安全，支持批量操作和实时预览。',
    defaultLocale: 'zh-CN'
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'zh-CN'
      },
      title: 'Photix Mark',
      titleTemplate: '%s | Photix Mark',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '为你的摄影作品，优雅地附上专属水印与参数。纯前端处理，隐私安全，支持批量操作和实时预览。' },
        { name: 'keywords', content: '摄影水印,图片水印,批量水印,EXIF信息,摄影参数,照片处理,在线工具,纯前端' },
        { name: 'author', content: 'Photix Mark' },
        { name: 'theme-color', content: '#f59e0b' },

        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Photix Mark' },
        { property: 'og:title', content: 'Photix Mark' },
        { property: 'og:description', content: '为你的摄影作品，优雅地附上专属水印与参数。纯前端处理，隐私安全，支持批量操作和实时预览。' },
        { property: 'og:image', content: 'https://mark.photix.cc/og-image.jpg' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:locale', content: 'zh_CN' },

        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Photix Mark' },
        { name: 'twitter:description', content: '为你的摄影作品，优雅地附上专属水印与参数。纯前端处理，隐私安全，支持批量操作和实时预览。' },
        { name: 'twitter:image', content: 'https://mark.photix.cc/og-image.jpg' },

        // 移动端优化
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'Photix Mark' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'canonical', href: 'https://mark.photix.cc' }
      ],
      script: [
        // Google Analytics
        {
          src: 'https://www.googletagmanager.com/gtag/js?id=G-ZCR913SBT5',
          async: true
        },
        {
          children: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ZCR913SBT5');
          `
        },
        // 百度统计
        {
          children: `
            var _hmt = _hmt || [];
            (function() {
              var hm = document.createElement("script");
              hm.src = "https://hm.baidu.com/hm.js?817c44f99e67980939eeb8a03d52222b";
              var s = document.getElementsByTagName("script")[0];
              s.parentNode.insertBefore(hm, s);
            })();
          `
        }
      ]
    }
  },

  // Sitemap 配置
  sitemap: {
    hostname: 'https://mark.photix.cc',
    gzip: true,
    routes: [
      '/'
    ]
  },

  // Robots 配置
  robots: {
    UserAgent: '*',
    Allow: '/',
    Sitemap: 'https://mark.photix.cc/sitemap.xml'
  },

  // OG Image 配置
  ogImage: {
    enabled: true,
    defaults: {
      width: 1200,
      height: 630,
      extension: 'jpg',
      alt: 'Photix Mark - 为你的摄影作品，优雅地附上专属水印与参数'
    }
  }
})
