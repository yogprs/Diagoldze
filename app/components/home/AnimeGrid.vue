<script setup lang="ts">
const props = defineProps<{
  anime: AnimeGlobal[];
  title: string;
  subtitle: string;
  sort: string;
}>();

const { $gsap } = useNuxtApp();
const sectionRef = ref<HTMLElement | null>(null);
const listRef = ref<HTMLElement | null>(null);

function rankStyle(index: number) {
  if (index === 0) return "from-[#FFD700] to-[#FFA500] text-[#1a1000]";
  if (index === 1) return "from-[#C0C0C0] to-[#A0A0A0] text-[#0a0a0a]";
  if (index === 2) return "from-[#CD7F32] to-[#A0522D] text-white";
  return "from-secondary/70 to-secondary/40 text-white";
}

onMounted(() => {
  $gsap.fromTo(
    listRef.value?.children ? Array.from(listRef.value.children) : [],
    { opacity: 0, x: 40 },
    {
      opacity: 1,
      x: 0,
      duration: 0.5,
      stagger: 0.08,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sectionRef.value,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    },
  );
});
</script>

<template>
  <section ref="sectionRef" class="py-12 pb-20">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center gap-3">
        <div
          class="w-1 h-8 rounded-full bg-gradient-to-b from-secondary to-primary"
        />
        <div>
          <p
            class="text-secondary text-xs font-semibold uppercase tracking-widest"
          >
            {{ subtitle }}
          </p>
          <h2 class="text-white text-2xl md:text-3xl font-extrabold">
            {{ title }}
          </h2>
        </div>
      </div>
      <NuxtLink
        :to="`/browse?sort=${sort}`"
        class="text-white/40 hover:text-primary text-xs font-bold uppercase tracking-widest transition-colors"
      >
        View All
      </NuxtLink>
    </div>

    <!-- List -->
    <div ref="listRef" class="flex flex-col gap-3">
      <NuxtLink
        :to="`/anime/${item.id}`"
        v-for="(item, index) in anime.slice(0, 10)"
        :key="item.id"
        class="group relative flex items-center gap-4 bg-surface hover:bg-surface-dim border border-white/5 hover:border-white/10 rounded-2xl p-3 transition-all duration-300 cursor-pointer"
      >
        <!-- Background hover banner -->
        <div
          class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden rounded-2xl pointer-events-none"
        >
          <img
            :src="item.bannerImage || item.coverImage.extraLarge"
            class="w-full h-full object-cover blur-sm scale-110"
          />
          <div class="absolute inset-0 bg-[#12121a]/85" />
        </div>

        <!-- Rank Badge -->
        <div
          :class="`relative z-10 bg-gradient-to-br ${rankStyle(index)} w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center font-black text-lg shadow-lg`"
        >
          {{ String(index + 1).padStart(2, "0") }}
        </div>

        <!-- Cover -->
        <div
          class="relative z-10 w-10 h-14 rounded-lg overflow-hidden flex-shrink-0"
        >
          <img
            :src="item.coverImage.large"
            :alt="item.title.english || item.title.romaji"
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        <!-- Info -->
        <div class="relative z-10 flex-1 min-w-0">
          <h3 class="text-white font-bold text-sm md:text-base truncate">
            {{ item.title.english || item.title.romaji }}
          </h3>
          <div class="flex items-center gap-2 mt-1 flex-wrap">
            <span class="text-white/50 text-xs">{{ item.format }}</span>
            <span class="text-white/20 text-xs">•</span>
            <span v-if="item.popularity" class="text-white/50 text-xs"
              >{{ item.popularity.toLocaleString() }} users</span
            >
            <span class="text-white/20 text-xs">•</span>
            <span class="text-white/50 text-xs capitalize">{{
              item.status?.toLowerCase()
            }}</span>
          </div>
          <div class="flex flex-wrap gap-1 mt-1.5">
            <span
              v-for="genre in item.genres.slice(0, 3)"
              :key="genre"
              class="text-[10px] text-white/40 bg-white/5 rounded-full px-2 py-0.5"
            >
              {{ genre }}
            </span>
          </div>
        </div>

        <!-- Score -->
        <div
          class="relative z-10 flex-shrink-0 flex flex-col items-center gap-0.5"
        >
          <div class="flex items-center gap-1">
            <Icon
              name="material-symbols:star"
              class="w-3.5 h-3.5 text-yellow-400"
            />

            <span class="text-yellow-400 font-bold text-sm">
              {{
                item.averageScore ? (item.averageScore / 10).toFixed(1) : "N/A"
              }}
            </span>
          </div>
          <span class="text-white/30 text-[10px]">score</span>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>
