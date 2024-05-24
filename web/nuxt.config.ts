// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/eslint',
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
