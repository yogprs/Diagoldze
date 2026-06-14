// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  modules: ["@nuxtjs/tailwindcss", "@nuxt/icon", "@nuxtjs/google-fonts"],
  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700],
      "Spline Sans": [400, 500, 600, 700],
    },
    display: "swap",
    preload: true,
    prefetch: true,
  },
  tailwindcss: {
    configPath: "tailwind.config.ts",
  },
  vite: {
    optimizeDeps: {
      include: ["gsap", "gsap/ScrollTrigger"],
    },
  },
  nitro: {
    experimental: {
      openAPI: true,
    },
    externals: {
      inline: [],
      external: [],
    },
  },
  app: {
    head: {
      title: "Diagoldze — Anime Explorer",
      link: [{ rel: "icon", type: "image/svg+xml", href: "/diagoldze.svg" }],
      meta: [
        {
          name: "description",
          content:
            "Discover trending anime, top ratings, and personalized recommendations on Diagoldze.",
        },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          property: "og:type",
          content: "website",
        },
        {
          property: "og:url",
          content: "https://diagoldze.vercel.app/",
        },
        {
          property: "og:title",
          content: "Diagoldze — Anime Explorer",
        },
        {
          property: "og:description",
          content:
            "Discover trending anime, top ratings, and personalized recommendations on Diagoldze.",
        },
      ],
    },
  },
});
