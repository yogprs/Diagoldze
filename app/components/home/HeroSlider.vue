<script setup lang="ts">
const props = defineProps<{ anime: AnimeGlobal[] }>();

const { $gsap } = useNuxtApp();

// Pick 5 random items from trending data (use useState to prevent Hydration Mismatch)
const slides = useState<AnimeGlobal[]>("hero-slides", () => {
  const arr = [...props.anime];

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    const temp = arr[i]!;
    arr[i] = arr[j]!;
    arr[j] = temp;
  }

  return arr.slice(0, 5);
});

const currentIndex = ref(0);
const isAnimating = ref(false);
const progressBar = ref<HTMLElement | null>(null);
let autoTimer: ReturnType<typeof setInterval> | null = null;
let progressTween: gsap.core.Tween | null = null;

function stripHtml(html: string) {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&[^;]+;/g, " ")
    .trim();
}

function animateSlide(from: number, to: number) {
  if (isAnimating.value) return;
  isAnimating.value = true;

  const tl = $gsap.timeline({
    onComplete: () => {
      isAnimating.value = false;
    },
  });

  // Fade out current slide content
  tl.to(`.slide-content-${from}`, {
    opacity: 0,
    duration: 0.4,
    ease: "power2.in",
  });
  // Fade out current background
  tl.to(
    `.slide-bg-${from}`,
    { opacity: 0, duration: 0.5, ease: "power2.inOut" },
    "-=0.2",
  );
  // Fade in new background
  tl.fromTo(
    `.slide-bg-${to}`,
    { opacity: 0 },
    { opacity: 1, duration: 0.6, ease: "power2.out" },
    "-=0.3",
  );

  // Ensure the new parent container becomes visible
  tl.set(`.slide-content-${to}`, { opacity: 1 });

  // Stagger in new content
  tl.fromTo(
    `.slide-content-${to} .reveal-item`,
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" },
    "-=0.3",
  );

  currentIndex.value = to;
  startProgress();
}

function goToSlide(index: number) {
  if (index === currentIndex.value || isAnimating.value) return;
  if (autoTimer) clearInterval(autoTimer);
  animateSlide(currentIndex.value, index);
  startAutoPlay();
}

function startProgress() {
  if (progressTween) progressTween.kill();
  if (!progressBar.value) return;
  $gsap.set(progressBar.value, { scaleX: 0, transformOrigin: "left center" });
  progressTween = $gsap.to(progressBar.value, {
    scaleX: 1,
    duration: 5,
    ease: "none",
  });
}

function startAutoPlay() {
  if (autoTimer) clearInterval(autoTimer);
  autoTimer = setInterval(() => {
    const next = (currentIndex.value + 1) % slides.value.length;
    animateSlide(currentIndex.value, next);
  }, 5000);
}

onMounted(() => {
  // Set initial opacity for slides
  slides.value.forEach((_, i) => {
    if (i === 0) {
      $gsap.set(`.slide-bg-${i}`, { opacity: 1 });
      $gsap.set(`.slide-content-${i}`, { opacity: 1 });
    } else {
      $gsap.set(`.slide-bg-${i}`, { opacity: 0 });
      $gsap.set(`.slide-content-${i}`, { opacity: 0 });
    }
  });

  // Init first slide content
  $gsap.fromTo(
    `.slide-content-0 .reveal-item`,
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: "power3.out",
      delay: 0.5,
    },
  );
  startProgress();
  startAutoPlay();
});

onBeforeUnmount(() => {
  if (autoTimer) clearInterval(autoTimer);
  if (progressTween) progressTween.kill();
});
</script>

<template>
  <section class="relative w-full h-screen overflow-hidden bg-[#0a0a0f]">
    <!-- Slides -->
    <div
      v-for="(item, index) in slides"
      :key="item.id"
      class="absolute inset-0"
    >
      <!-- Slide Background -->
      <div
        :class="`slide-bg-${index}`"
        class="absolute inset-0 transition-none opacity-0"
      >
        <img
          :src="item.bannerImage || item.coverImage.extraLarge"
          :alt="item.title.english || item.title.romaji"
          class="w-full h-full object-cover object-center"
        />
        <!-- Gradients -->
        <div
          class="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/75 to-transparent"
        />
        <div
          class="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-[#0a0a0f]/40"
        />
      </div>

      <!-- Slide Content -->
      <div
        :class="`slide-content-${index} absolute inset-0 z-10 flex flex-col justify-end mb-10 lg:mb-0 opacity-0`"
        :style="{
          pointerEvents: index === currentIndex ? 'auto' : 'none',
        }"
      >
        <div class="px-6 md:px-8 lg:px-12 pb-28 max-w-3xl">
          <!-- Badges -->
          <div class="reveal-item flex flex-wrap items-center gap-2 mb-5">
            <span
              class="flex items-center gap-1.5 bg-yellow-400/15 border border-yellow-400/30 text-yellow-400 text-xs font-bold px-3 py-1 rounded-full"
            >
              <Icon
                name="material-symbols:star"
                class="w-3 h-3 text-yellow-400"
              />

              {{
                item.averageScore ? (item.averageScore / 10).toFixed(1) : "N/A"
              }}
            </span>
            <span
              v-if="item.season"
              class="bg-white/10 border border-white/15 text-white/80 text-xs font-medium px-3 py-1 rounded-full capitalize"
            >
              {{ item.season.toLowerCase() }} {{ item.seasonYear }}
            </span>
            <span
              class="bg-primary/20 border border-primary/30 text-primary text-xs font-semibold px-3 py-1 rounded-full"
            >
              {{ item.format }}
            </span>
            <span
              v-if="item.episodes"
              class="bg-white/10 border border-white/15 text-white/70 text-xs font-medium px-3 py-1 rounded-full"
            >
              {{ item.episodes }} eps
            </span>
          </div>

          <!-- Title -->
          <h1
            class="reveal-item text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight mb-4 line-clamp-2"
          >
            {{ item.title.english || item.title.romaji }}
          </h1>

          <!-- Genres -->
          <div class="reveal-item flex flex-wrap gap-2 mb-5">
            <span
              v-for="genre in item.genres.slice(0, 4)"
              :key="genre"
              class="text-xs font-medium px-3 py-1 rounded-full bg-white/8 border border-white/10 text-white/70"
            >
              {{ genre }}
            </span>
          </div>

          <!-- Description -->
          <p
            class="reveal-item text-white/65 text-sm md:text-base leading-relaxed line-clamp-3 mb-8"
          >
            {{ stripHtml(item.description || "No description available.") }}
          </p>

          <!-- Actions -->
          <div class="reveal-item flex items-center gap-4">
            <NuxtLink
              :to="`/anime/${item.id}`"
              class="flex items-center gap-2.5 bg-gradient-to-r from-primary-container to-secondary-container text-white font-bold px-7 py-3.5 rounded-2xl hover:opacity-90 active:scale-95 transition-all duration-200 shadow-lg shadow-primary-container/30"
            >
              <Icon name="material-symbols:info" class="w-4 h-4 text-white" />
              See Detail
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Dot Navigation -->
    <div
      class="absolute bottom-10 left-6 md:left-8 lg:left-12 flex items-center gap-2.5 z-20"
    >
      <button
        v-for="(_, i) in slides"
        :key="i"
        @click="goToSlide(i)"
        :class="[
          'dot transition-all duration-400 rounded-full',
          currentIndex === i
            ? 'w-8 h-2.5 bg-gradient-to-r from-primary-container to-secondary-container'
            : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/60',
        ]"
      />
    </div>

    <!-- Slide Counter -->
    <div
      class="absolute bottom-10 right-8 md:right-16 z-20 flex items-center gap-1 text-white/40 text-sm font-mono"
    >
      <span class="text-white font-bold text-base">{{
        String(currentIndex + 1).padStart(2, "0")
      }}</span>
      <span>/</span>
      <span>{{ String(slides.length).padStart(2, "0") }}</span>
    </div>

    <!-- Progress Bar -->
    <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 z-20">
      <div
        ref="progressBar"
        class="h-full bg-gradient-to-r from-primary to-secondary"
      />
    </div>
  </section>
</template>
