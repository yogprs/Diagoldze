<script setup lang="ts">
const props = defineProps<{
  anime: AnimeGlobal;
}>();

const { $gsap } = useNuxtApp();

const title = computed(
  () => props.anime.title.english || props.anime.title.romaji,
);
const score = computed(() =>
  props.anime.averageScore ? (props.anime.averageScore / 10).toFixed(1) : null,
);

function onEnter(el: HTMLElement) {
  $gsap.to(el, { scale: 1.04, duration: 0.3, ease: "power2.out" });
}
function onLeave(el: HTMLElement) {
  $gsap.to(el, { scale: 1, duration: 0.3, ease: "power2.out" });
}
</script>

<template>
  <NuxtLink
    :to="`/anime/${anime.id}`"
    ref="cardRef"
    class="anime-card group relative flex-shrink-0 w-40 md:w-44 lg:w-48 cursor-pointer rounded-xl overflow-hidden bg-surface block"
    @mouseenter="onEnter($el as HTMLElement)"
    @mouseleave="onLeave($el as HTMLElement)"
  >
    <!-- Cover Image -->
    <div class="relative aspect-[3/4] overflow-hidden">
      <img
        :src="anime.coverImage.large || anime.coverImage.extraLarge"
        :alt="title"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />
      <!-- Overlay -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />

      <!-- Score Badge -->
      <div
        v-if="score"
        class="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5"
      >
        <Icon name="material-symbols:star" class="w-3 h-3 text-yellow-400" />
        <span class="text-yellow-400 text-xs font-bold">{{ score }}</span>
      </div>

      <!-- Format Badge -->
      <div
        class="absolute top-2 left-2 flex items-center gap-1 bg-tertiary-foreground border border-tertiary-container text-tertiary rounded-full px-2 py-0.5"
      >
        <span class="text-xs font-medium">{{ anime.format }}</span>
      </div>
    </div>

    <!-- Info -->
    <div class="p-3">
      <h3
        class="text-white text-sm font-semibold line-clamp-2 leading-tight mb-1.5"
      >
        {{ title }}
      </h3>
      <div class="flex flex-wrap gap-1">
        <span
          v-for="genre in anime.genres.slice(0, 2)"
          :key="genre"
          class="text-[10px] text-white/50 bg-white/5 rounded-full px-2 py-0.5"
        >
          {{ genre }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>
