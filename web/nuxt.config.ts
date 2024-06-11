// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  routeRules: {
    '/role': {
      ssr: false
    }
  },
  runtimeConfig: {
    public: {
      baseURL: process.env.NUXT_BASE_URL || 'http://localhost:3000'
    }
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/eslint'
  ],
  css: [
    '@/assets/style/global.scss'
  ],
  eslint: {
    config: {
      stylistic: {
        indent: 2,
        commaDangle: 'never'
      }
    }
  }
})
