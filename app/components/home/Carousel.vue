<script setup lang="ts">
const props = defineProps<{
  anime: AnimeGlobal[];
  title: string;
  subtitle?: string;
}>();

const { $gsap } = useNuxtApp();
const sectionRef = ref<HTMLElement | null>(null);
const trackRef = ref<HTMLElement | null>(null);
const offset = ref(0);
const cardWidth = 208; // w-48 + gap

const maxOffset = computed(() =>
  Math.max(
    0,
    props.anime.length * cardWidth -
      (trackRef.value?.parentElement?.clientWidth ?? 0),
  ),
);

function prev() {
  offset.value = Math.max(0, offset.value - cardWidth * 3);
  animateTrack();
}

function next() {
  offset.value = Math.min(maxOffset.value, offset.value + cardWidth * 3);
  animateTrack();
}

function animateTrack() {
  $gsap.to(trackRef.value, {
    x: -offset.value,
    duration: 0.6,
    ease: "power3.out",
  });
}

onMounted(() => {
  $gsap.fromTo(
    sectionRef.value,
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sectionRef.value,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    },
  );
});
</script>

<template>
  <section ref="sectionRef" class="py-12">
    <!-- Header -->
    <div class="flex items-end justify-between mb-6">
      <div>
        <p
          v-if="subtitle"
          class="text-primary text-xs font-semibold uppercase tracking-widest mb-1"
        >
          {{ subtitle }}
        </p>
        <h2 class="text-white text-2xl md:text-3xl font-extrabold">
          {{ title }}
        </h2>
      </div>
      <!-- Nav Buttons -->
      <div class="flex gap-2">
        <button
          @click="prev"
          class="w-10 h-10 flex items-center justify-center rounded-xl bg-white/8 hover:bg-white/15 border border-white/10 text-white transition-colors"
        >
          <Icon name="material-symbols:keyboard-arrow-left" class="w-5 h-5" />
        </button>
        <button
          @click="next"
          class="w-10 h-10 flex items-center justify-center rounded-xl bg-white/8 hover:bg-white/15 border border-white/10 text-white transition-colors"
        >
          <Icon name="material-symbols:keyboard-arrow-right" class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Carousel Track -->
    <div class="overflow-hidden">
      <div ref="trackRef" class="flex gap-4 will-change-transform">
        <UiCard v-for="item in anime" :key="item.id" :anime="item" />
      </div>
    </div>
  </section>
</template>
