<script setup lang="ts">
const { $gsap } = useNuxtApp();

const navRef = ref<HTMLElement | null>(null);
const searchModalRef = ref<any>(null);
const scrolled = ref(false);

const links = [
  { label: "Home", href: "/" },
  { label: "Browse", href: "/browse" },
  { label: "Top Anime", href: "/browse?sort=SCORE_DESC" },
  { label: "Popular", href: "/browse?sort=POPULARITY_DESC" },
];

onMounted(async () => {
  // await auth.login({});
  // Entrance animation
  $gsap.fromTo(
    navRef.value,
    { x: -80, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.2 },
  );

  // Scroll listener
  window.addEventListener("scroll", () => {
    scrolled.value = window.scrollY > 50;
  });
});
</script>

<template>
  <header
    ref="navRef"
    :class="[
      'fixed top-0 z-50 flex justify-between items-center px-6 md:px-8 lg:px-12 py-4 w-full border-none',
      scrolled
        ? 'bg-slate-950/80 backdrop-blur-md border-b border-white/10 shadow-[0_10px_30px_-10px_rgba(106,90,205,0.2)] transition-all duration-500'
        : 'bg-transparent',
    ]"
  >
    <div class="flex items-center gap-12">
      <NuxtLink
        to="/"
        class="text-2xl font-black text-indigo-500 uppercase tracking-tighter"
      >
        Diagoldze
      </NuxtLink>
      <div
        class="hidden md:flex items-center gap-8 font-['Spline_Sans'] text-sm font-bold tracking-wide"
      >
        <NuxtLink
          v-for="link in links"
          :key="link.href"
          :to="link.href"
          class="text-slate-400 hover:text-slate-100 hover:bg-white/5 pb-1 rounded-lg px-2 py-1 duration-300 transition-all"
          active-class="!text-indigo-400 border-b-2 border-indigo-500 scale-95"
        >
          {{ link.label }}
        </NuxtLink>
      </div>
    </div>
    <div class="flex items-center gap-3">
      <button
        @click="searchModalRef?.openSearch()"
        class="hidden md:flex items-center gap-3 bg-slate-900 border border-white/10 focus:outline-none ocus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-xs font-medium px-4 py-2.5 rounded-xl transition-all duration-300 group"
      >
        <div class="flex items-center gap-2">
          <Icon name="material-symbols:search" class="w-5 h-5 text-primary" />

          <span class="group-hover:text-white transition-colors"
            >Search anime...</span
          >
        </div>
        <div class="flex items-center gap-1 opacity-40">
          <span
            class="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-[9px] font-bold"
            >CTRL K</span
          >
        </div>
      </button>

      <!-- Mobile Search Icon -->
      <button
        @click="searchModalRef?.openSearch()"
        class="md:hidden p-2 text-white/60 hover:text-white"
      >
        <Icon name="material-symbols:search" class="w-6 h-6" />
      </button>
    </div>
  </header>

  <LayoutNavbarSearch ref="searchModalRef" />
</template>
