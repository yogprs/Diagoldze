<script setup lang="ts">
const route = useRoute();
const { $gsap } = useNuxtApp();

const id = computed(() => route.params.id as string);

const {
  data: anime,
  pending,
  error,
} = await useFetch<APIResponse<Anime>>(`/api/anime/${id.value}`);

// Watch Now States
const showWatchModal = ref(false);
const activeSiteTab = ref("");

const groupedEpisodes = computed(() => {
  if (!anime.value?.data?.streamingEpisodes) return {};
  const groups: Record<string, any[]> = {};

  anime.value?.data?.streamingEpisodes.forEach((ep) => {
    if (!groups[ep.site]) {
      groups[ep.site] = [];
    }
    groups[ep.site]!.push(ep);
  });
  return groups;
});

const siteTabs = computed(() => Object.keys(groupedEpisodes.value));

const openWatchModal = () => {
  if (siteTabs.value.length > 0) {
    activeSiteTab.value = siteTabs.value[0]!;
  }
  showWatchModal.value = true;
};

function stripHtml(html: string | null | undefined) {
  if (!html) return "No description available.";
  return html
    .replace(/<[^>]*>?/gm, "")
    .replace(/&[^;]+;/g, " ")
    .trim();
}

onMounted(() => {
  if (!pending.value && anime.value) {
    animateEntrance();
  }
});

watch(pending, (newPending) => {
  if (!newPending && anime.value) {
    nextTick(() => {
      animateEntrance();
    });
  }
});

function animateEntrance() {
  const tl = $gsap.timeline();

  // Animate Banner
  tl.fromTo(
    ".anime-banner",
    { opacity: 0 },
    { opacity: 1, duration: 1, ease: "power2.out" },
  );

  // Staggered reveal for sidebar and content
  tl.fromTo(
    ".reveal-item",
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" },
    "-=0.5",
  );
}
</script>

<template>
  <div class="min-h-screen bg-[#0a0a0f] font-sans text-white pb-20">
    <!-- Loading State -->
    <div
      v-if="pending"
      class="min-h-screen flex items-center justify-center pt-16"
    >
      <div
        class="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin"
      />
    </div>

    <!-- Error State -->
    <div
      v-else-if="error || !anime"
      class="min-h-screen flex items-center justify-center pt-16"
    >
      <div class="text-center">
        <h2 class="text-2xl font-bold mb-2">Anime not found</h2>
        <NuxtLink to="/" class="text-primary hover:underline"
          >Back to Home</NuxtLink
        >
      </div>
    </div>

    <template v-else>
      <!-- Banner -->
      <div
        class="anime-banner relative w-full h-[40vh] md:h-[50vh] lg:h-[60vh] overflow-hidden"
      >
        <img
          :src="anime?.data?.bannerImage || anime?.data?.coverImage.extraLarge"
          :alt="anime?.data?.title.english || anime?.data?.title.romaji"
          class="w-full h-full object-cover object-center"
        />
        <div
          class="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent"
        />
      </div>
      <!-- Main Content Container -->
      <main
        class="max-w-6xl mx-auto px-6 lg:px-8 relative -mt-32 md:-mt-48 lg:-mt-64 z-10"
      >
        <div class="flex flex-col md:flex-row gap-8 lg:gap-12">
          <!-- Left Sidebar (Sticky) -->
          <div class="w-full md:w-64 lg:w-72 flex-shrink-0">
            <div class="sticky top-24">
              <!-- Cover Image -->
              <div
                class="reveal-item w-48 md:w-full mx-auto aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10 mb-6"
              >
                <img
                  :src="anime?.data?.coverImage.extraLarge"
                  :alt="anime?.data?.title.romaji"
                  class="w-full h-full object-cover"
                />
              </div>

              <!-- Action Buttons -->
              <div class="reveal-item flex flex-col gap-3">
                <button
                  @click="openWatchModal"
                  :disabled="
                    !anime?.data?.streamingEpisodes ||
                    anime?.data?.streamingEpisodes.length === 0
                  "
                  class="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3.5 rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Icon
                    name="material-symbols:play-arrow"
                    class="w-5 h-5 text-white"
                  />

                  {{
                    anime?.data?.streamingEpisodes?.length
                      ? "Watch Now"
                      : "No Stream Available"
                  }}
                </button>
              </div>

              <!-- Information Grid (Sidebar) -->
              <div
                class="reveal-item mt-8 bg-white/5 border border-white/5 rounded-2xl p-5 space-y-4 text-sm"
              >
                <div>
                  <span
                    class="text-white/40 block text-xs uppercase tracking-wider font-semibold mb-1"
                    >Format</span
                  >
                  <span class="text-white/90">{{ anime?.data?.format }}</span>
                </div>
                <div>
                  <span
                    class="text-white/40 block text-xs uppercase tracking-wider font-semibold mb-1"
                    >Episodes</span
                  >
                  <span class="text-white/90">{{
                    anime?.data?.episodes || "TBA"
                  }}</span>
                </div>
                <div>
                  <span
                    class="text-white/40 block text-xs uppercase tracking-wider font-semibold mb-1"
                    >Status</span
                  >
                  <span class="text-white/90 capitalize">{{
                    anime?.data?.status.toLowerCase()
                  }}</span>
                </div>
                <div v-if="anime?.data?.season">
                  <span
                    class="text-white/40 block text-xs uppercase tracking-wider font-semibold mb-1"
                    >Season</span
                  >
                  <span class="text-white/90 capitalize"
                    >{{ anime?.data?.season.toLowerCase() }}
                    {{ anime?.data?.seasonYear }}</span
                  >
                </div>
                <div>
                  <span
                    class="text-white/40 block text-xs uppercase tracking-wider font-semibold mb-1"
                    >Studios</span
                  >
                  <span class="text-white/90">{{
                    anime?.data?.studios.nodes.map((s) => s.name).join(", ") ||
                    "-"
                  }}</span>
                </div>
                <div>
                  <span
                    class="text-white/40 block text-xs uppercase tracking-wider font-semibold mb-1"
                    >Source</span
                  >
                  <span class="text-white/90 capitalize">{{
                    anime?.data?.source
                      ? anime?.data?.source.toLowerCase().replace("_", " ")
                      : "-"
                  }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Content -->
          <div class="flex-1 min-w-0 pt-4 md:pt-32 lg:pt-48 pb-10">
            <!-- Header Info -->
            <div class="reveal-item mb-6">
              <div class="flex flex-wrap items-center gap-3 mb-4">
                <div
                  class="flex items-center gap-1.5 bg-yellow-400/15 border border-yellow-400/30 px-3 py-1.5 rounded-full"
                >
                  <Icon
                    name="material-symbols:star"
                    class="w-4 h-4 text-yellow-400"
                  />

                  <span class="text-yellow-400 font-bold text-sm">{{
                    anime?.data?.averageScore
                      ? (anime?.data?.averageScore / 10).toFixed(1)
                      : "N/A"
                  }}</span>
                </div>
                <span class="text-white/40 text-sm font-medium"
                  >{{ anime?.data?.popularity.toLocaleString() }} users</span
                >
              </div>

              <h1
                class="text-3xl md:text-5xl font-black text-white leading-tight mb-2"
              >
                {{ anime?.data?.title.english || anime?.data?.title.romaji }}
              </h1>
              <h2
                v-if="anime?.data?.title.english && anime?.data?.title.romaji"
                class="text-lg text-white/50 font-medium mb-5"
              >
                {{ anime?.data?.title.romaji }}
              </h2>

              <!-- Genres -->
              <div class="flex flex-wrap gap-2 mb-8">
                <span
                  v-for="genre in anime?.data?.genres"
                  :key="genre"
                  class="bg-white/10 text-white/90 text-xs font-semibold px-3 py-1.5 rounded-lg"
                >
                  {{ genre }}
                </span>
              </div>
            </div>

            <!-- Synopsis -->
            <div class="reveal-item mb-12">
              <h3 class="text-xl font-bold mb-4 flex items-center gap-2">
                <span
                  class="w-1 h-6 rounded-full bg-gradient-to-b from-primary to-secondary block"
                ></span>
                Description
              </h3>
              <p
                class="text-white/70 leading-relaxed text-sm md:text-base whitespace-pre-line"
              >
                {{ stripHtml(anime?.data?.description) }}
              </p>
            </div>

            <!-- Characters -->
            <div
              v-if="
                anime?.data?.characters &&
                anime?.data?.characters.edges.length > 0
              "
              class="reveal-item mb-12"
            >
              <h3 class="text-xl font-bold mb-6 flex items-center gap-2">
                <span
                  class="w-1 h-6 rounded-full bg-gradient-to-b from-primary to-secondary block"
                ></span>
                Characters
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div
                  v-for="edge in anime?.data?.characters.edges"
                  :key="edge.node.id"
                  class="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl p-3 transition-colors"
                >
                  <img
                    :src="edge.node.image.large"
                    :alt="edge.node.name.full"
                    class="w-12 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h4 class="text-white text-sm font-bold line-clamp-1">
                      {{ edge.node.name.full }}
                    </h4>
                    <p class="text-primary text-xs">{{ edge.role }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Trailer -->
            <div
              v-if="
                anime?.data?.trailer && anime?.data?.trailer.site === 'youtube'
              "
              class="reveal-item"
            >
              <h3 class="text-xl font-bold mb-6 flex items-center gap-2">
                <span
                  class="w-1 h-6 rounded-full bg-gradient-to-b from-primary to-secondary block"
                ></span>
                Trailer
              </h3>
              <div
                class="aspect-video w-full rounded-2xl overflow-hidden shadow-xl border border-white/10 bg-black"
              >
                <iframe
                  class="w-full h-full"
                  :src="`https://www.youtube.com/embed/${anime?.data?.trailer.id}`"
                  title="Anime Trailer"
                  frameborder="0"
                  allow="
                    accelerometer;
                    autoplay;
                    clipboard-write;
                    encrypted-media;
                    gyroscope;
                    picture-in-picture;
                  "
                  allowfullscreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Watch Now Modal -->
      <div
        v-if="showWatchModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto lenis-prevent"
      >
        <div
          class="bg-[#12121a] border border-white/10 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl my-auto"
        >
          <div
            class="p-6 md:p-8 border-b border-white/10 flex justify-between items-center sticky top-0 bg-[#12121a] z-10"
          >
            <div>
              <h2 class="text-2xl font-bold text-white mb-1">
                Choose Streaming Platform
              </h2>
              <p class="text-white/50 text-sm">
                Official source to watch
                {{ anime?.data?.title.english || anime?.data?.title.romaji }}
              </p>
            </div>
            <button
              @click="showWatchModal = false"
              class="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white"
            >
              <Icon name="material-symbols:close" class="w-6 h-4" />
            </button>
          </div>

          <div class="p-6 md:p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
            <!-- Platform Tabs -->
            <div
              class="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide border-b border-white/10 mb-6"
            >
              <button
                v-for="site in siteTabs"
                :key="site"
                @click="activeSiteTab = site"
                :class="[
                  'whitespace-nowrap pb-4 font-bold text-lg transition-colors relative capitalize',
                  activeSiteTab === site
                    ? 'text-primary'
                    : 'text-white/40 hover:text-white/70',
                ]"
              >
                {{ site }}
                <span
                  v-if="activeSiteTab === site"
                  class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                ></span>
              </button>
            </div>

            <!-- Episodes Grid -->
            <div
              v-if="activeSiteTab && groupedEpisodes[activeSiteTab]"
              class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
            >
              <a
                v-for="ep in groupedEpisodes[activeSiteTab]"
                :key="ep.url"
                :href="ep.url"
                target="_blank"
                rel="noopener noreferrer"
                class="group flex flex-col gap-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/50 rounded-xl p-3 transition-all cursor-pointer"
              >
                <div
                  class="w-full aspect-video rounded-lg overflow-hidden relative bg-black/50"
                >
                  <img
                    v-if="ep.thumbnail"
                    :src="ep.thumbnail"
                    :alt="ep.title"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div
                    v-else
                    class="absolute inset-0 flex items-center justify-center text-white/20"
                  >
                    <div class="w-10 h-10">
                      <Icon
                        name="clarity:video-camera-line"
                        class="w-10 h-10"
                      />
                    </div>
                  </div>
                  <div
                    class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm"
                  >
                    <div
                      class="bg-primary text-white rounded-full p-3 shadow-[0_0_20px_rgba(var(--primary),0.5)]"
                    >
                      <div class="w-6 h-6">
                        <Icon
                          name="material-symbols:play-arrow"
                          class="text-white size-6"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4
                    class="text-white text-sm font-bold line-clamp-2 leading-snug group-hover:text-primary transition-colors"
                  >
                    {{ ep.title || "Episode" }}
                  </h4>
                  <p class="text-xs text-white/40 mt-1 flex items-center gap-1">
                    Via <span class="capitalize">{{ ep.site }}</span>
                    <span class="w-3 h-3">
                      <Icon name="carbon:launch" class="w-3 h-3" />
                    </span>
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>

  <LayoutNavbarSearch ref="searchModalRef" />
</template>
