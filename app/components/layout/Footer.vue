<script setup lang="ts"></script>

<template>
  <footer class="mt-12 border-t border-white/5 py-10">
    <div
      class="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4"
    >
      <div class="flex items-center gap-2.5">
        <div
          class="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-container to-secondary-container flex items-center justify-center"
        >
          <span class="text-white font-black text-xs">K</span>
        </div>
        <span class="text-white/80 font-bold">Diagoldze</span>
      </div>
      <p class="text-white/30 text-xs text-center">
        Anime data from
        <a
          href="https://anilist.co"
          target="_blank"
          class="text-primary hover:underline"
          >AniList</a
        >. Built with ❤️ using Nuxt 4.
      </p>
      <p class="text-white/20 text-xs">© 2026 Diagoldze</p>
    </div>
  </footer>
</template>
