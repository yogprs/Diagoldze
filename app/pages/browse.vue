<script setup lang="ts">
const route = useRoute();
const { $gsap } = useNuxtApp();

const router = useRouter();

// Search state
const debouncedSearch = ref((route.query.search as string) || "");
let searchTimeout: any = null;

// Helper to update URL
const updateUrl = (newQuery: any) => {
  const query = { ...route.query, ...newQuery };
  // Clean up
  Object.keys(query).forEach((key) => {
    if (!query[key] || (key === "page" && query[key] == 1)) {
      delete query[key];
    }
  });
  router.push({ query });
};

// Search with debounce
watch(debouncedSearch, (val) => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    updateUrl({ search: val.trim(), page: 1 });
  }, 400);
});

// Fetch data directly watching route.query
const { data, pending, error } = await useFetch<
  APIResponseWithPage<AnimeGlobal[]>
>("/api/anime/search", {
  query: computed(() => ({
    search: route.query.search,
    sort: route.query.sort || "POPULARITY_DESC",
    status: route.query.status,
    format: route.query.format,
    genre: route.query.genre,
    page: route.query.page || 1,
  })),
  watch: [() => route.query],
});

// Reset logic
const resetFilters = () => {
  debouncedSearch.value = "";
  router.push({ path: route.path, query: {} });
};

// Pagination Logic
const handlePageChange = (val: number) => {
  const last = pageInfo.value.lastPage;
  let targetPage = val;
  if (isNaN(targetPage) || targetPage < 1) targetPage = 1;
  else if (targetPage > last) targetPage = last;
  updateUrl({ page: targetPage });
};

const animeList = computed(() => data.value?.data?.data || []);
const pageInfo = computed(() => {
  const rawData = data.value?.data;
  const info = rawData?.page || ({} as Page);

  // Ensure we use the actual lastPage from the latest successful API response
  const actualLastPage = info.lastPage || 1;
  const cappedLastPage = Math.min(actualLastPage, 100);

  return {
    ...info,
    lastPage: cappedLastPage,
    hasNextPage: info.hasNextPage && (info.currentPage || 1) < 100,
  };
});

const genres = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Mecha",
  "Music",
  "Mystery",
  "Psychological",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  "Supernatural",
  "Thriller",
];

const formats = [
  { label: "TV", value: "TV" },
  { label: "TV Short", value: "TV_SHORT" },
  { label: "Movie", value: "MOVIE" },
  { label: "Special", value: "SPECIAL" },
  { label: "OVA", value: "OVA" },
  { label: "ONA", value: "ONA" },
];

const sorts = [
  { label: "Popularity", value: "POPULARITY_DESC" },
  { label: "Trending", value: "TRENDING_DESC" },
  { label: "Score", value: "SCORE_DESC" },
  { label: "Latest Updated", value: "UPDATED_AT_DESC" },
  { label: "Newest", value: "START_DATE_DESC" },
];

const statuses = [
  { label: "Releasing", value: "RELEASING" },
  { label: "Finished", value: "FINISHED" },
  { label: "Not Yet Released", value: "NOT_YET_RELEASED" },
  { label: "Cancelled", value: "CANCELLED" },
  { label: "Hiatus", value: "HIATUS" },
];

watch(
  animeList,
  () => {
    nextTick(() => {
      $gsap.fromTo(
        ".anime-card-wrapper",
        { opacity: 0, y: 30, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.04,
          ease: "back.out(1.2)",
          clearProps: "all",
        },
      );
    });
  },
  { immediate: true },
);

useHead({
  title: "Browse Anime — Diagoldze",
  meta: [
    {
      name: "description",
      content:
        "Discover and filter thousands of anime titles on Diagoldze Explorer.",
    },
  ],
});
</script>

<template>
  <div class="text-white font-inter">
    <div class="max-w-[1400px] mx-auto px-6 lg:px-12 pt-24">
      <!-- Header Section -->
      <div class="mb-12">
        <h1
          class="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent"
        >
          Browse Anime
        </h1>
        <p class="text-white/50 max-w-2xl">
          Explore the vast world of anime. Filter by genre, status, format, or
          search for your favorite titles.
        </p>
      </div>

      <!-- Filter Bar -->
      <div class="top-20 z-40 mb-8">
        <div
          class="bg-surface backdrop-blur-2xl border border-surface-container p-4 md:p-6 rounded-3xl shadow-2xl flex flex-col lg:flex-row gap-4 items-end"
        >
          <!-- Search -->
          <div class="w-full lg:flex-1">
            <label
              class="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2 ml-1"
              >Search</label
            >
            <div class="relative group">
              <input
                v-model="debouncedSearch"
                type="text"
                placeholder="Search anime..."
                class="w-full bg-surface-container border border-surface-variant rounded-2xl px-5 py-3.5 pl-12 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
              />
              <Icon
                name="material-symbols:search"
                class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors"
              />
            </div>
          </div>

          <!-- Filters Grid -->
          <div
            class="grid grid-cols-2 md:grid-cols-4 gap-4 w-full lg:w-auto lg:flex-shrink-0"
          >
            <!-- Genre -->
            <div class="min-w-[140px]">
              <label
                class="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2 ml-1"
                >Genre</label
              >
              <select
                :value="route.query.genre || ''"
                @change="
                  (e: any) => updateUrl({ genre: e.target.value, page: 1 })
                "
                class="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:border-primary/50 cursor-pointer appearance-none"
              >
                <option value="">All Genres</option>
                <option v-for="g in genres" :key="g" :value="g">{{ g }}</option>
              </select>
            </div>

            <!-- Format -->
            <div class="min-w-[120px]">
              <label
                class="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2 ml-1"
                >Format</label
              >
              <select
                :value="route.query.format || ''"
                @change="
                  (e: any) => updateUrl({ format: e.target.value, page: 1 })
                "
                class="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:border-primary/50 cursor-pointer appearance-none"
              >
                <option value="">All Formats</option>
                <option v-for="f in formats" :key="f.value" :value="f.value">
                  {{ f.label }}
                </option>
              </select>
            </div>

            <!-- Status -->
            <div class="min-w-[120px]">
              <label
                class="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2 ml-1"
                >Status</label
              >
              <select
                :value="route.query.status || ''"
                @change="
                  (e: any) => updateUrl({ status: e.target.value, page: 1 })
                "
                class="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:border-primary/50 cursor-pointer appearance-none"
              >
                <option value="">All Status</option>
                <option v-for="s in statuses" :key="s.value" :value="s.value">
                  {{ s.label }}
                </option>
              </select>
            </div>

            <!-- Sort -->
            <div class="min-w-[140px]">
              <label
                class="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2 ml-1"
                >Sort By</label
              >
              <select
                :value="route.query.sort || 'POPULARITY_DESC'"
                @change="
                  (e: any) => updateUrl({ sort: e.target.value, page: 1 })
                "
                class="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:border-primary/50 cursor-pointer appearance-none"
              >
                <option v-for="s in sorts" :key="s.value" :value="s.value">
                  {{ s.label }}
                </option>
              </select>
            </div>
          </div>

          <!-- Reset -->
          <button
            @click="resetFilters"
            class="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 transition-all group"
            title="Reset Filters"
          >
            <Icon
              name="uil:sync"
              class="w-5 h-5 group-hover:rotate-180 transition-transform duration-500"
            />
          </button>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="relative min-h-[400px]">
        <!-- Loading Overlay -->
        <div
          v-if="pending"
          class="absolute inset-0 z-10 flex items-start justify-center bg-[#0a0a0f]/40 backdrop-blur-[2px] rounded-3xl pt-20"
        >
          <div
            class="flex flex-col items-center gap-4 bg-[#12121a]/90 p-6 rounded-2xl border border-white/10 shadow-2xl"
          >
            <div
              class="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin"
            />
            <p class="text-primary font-bold text-sm tracking-widest uppercase">
              Searching...
            </p>
          </div>
        </div>

        <!-- Error State -->
        <div
          v-if="error"
          class="bg-red-500/10 border border-red-500/20 rounded-3xl p-12 text-center"
        >
          <span class="text-4xl mb-4 block">🥀</span>
          <h2 class="text-xl font-bold text-red-400 mb-2">
            Ops! Failed to Load Anime
          </h2>
          <p class="text-white/40 mb-6">
            {{
              error?.message ||
              "An unexpected error occurred while fetching data."
            }}
          </p>
          <button
            @click="() => resetFilters()"
            class="bg-white/10 hover:bg-white/20 px-6 py-2 rounded-xl transition-colors"
          >
            Try Again
          </button>
        </div>

        <!-- Anime Grid -->
        <div v-else>
          <div
            v-if="animeList.length > 0"
            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 md:gap-5"
            ref="listRef"
          >
            <div
              v-for="anime in animeList"
              :key="anime.id"
              class="anime-card-wrapper"
            >
              <UiCard :anime="anime" class="!w-full" />
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="!pending" class="py-20 text-center">
            <div class="text-6xl mb-6 opacity-50">🛸</div>
            <h2 class="text-2xl font-bold mb-2">No Anime Found</h2>
            <p class="text-white/40">
              Try adjusting your filters or search terms.
            </p>
            <button
              @click="resetFilters"
              class="mt-8 text-primary font-semibold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        </div>
      </div>

      <!-- Enhanced Pagination -->
      <div
        v-if="animeList.length > 0 && pageInfo.lastPage > 1"
        class="mt-16 flex flex-wrap items-center justify-center gap-3 md:gap-4"
      >
        <!-- First Page -->
        <button
          :disabled="
            (parseInt(route.query.page as string) || 1) === 1 || pending
          "
          @click="updateUrl({ page: 1 })"
          class="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all group"
          title="First Page"
        >
          <Icon
            name="material-symbols:keyboard-double-arrow-left"
            class="w-5 h-5 group-hover:-translate-x-0.5 transition-transform"
          />
        </button>

        <!-- Prev -->
        <button
          :disabled="
            (parseInt(route.query.page as string) || 1) === 1 || pending
          "
          @click="
            updateUrl({ page: (parseInt(route.query.page as string) || 1) - 1 })
          "
          class="flex items-center gap-2 px-6 py-3 h-12 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <Icon name="material-symbols:keyboard-arrow-left" class="w-5 h-5" />

          <span class="hidden sm:inline">Prev</span>
        </button>

        <!-- Current Page Input -->
        <div
          class="flex items-center gap-2 bg-[#12121a] border border-white/10 rounded-2xl p-1.5 shadow-xl"
        >
          <input
            type="number"
            :value="parseInt(route.query.page as string) || 1"
            @change="(e: any) => handlePageChange(parseInt(e.target.value))"
            :min="1"
            :max="pageInfo.lastPage"
            class="w-14 bg-white/5 border border-white/10 rounded-xl px-2 py-1.5 text-center font-bold text-primary focus:outline-none focus:border-primary/50 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span class="text-white/20 font-bold px-1">/</span>
          <span class="text-white/60 font-medium pr-3">{{
            pageInfo.lastPage
          }}</span>
        </div>

        <!-- Next -->
        <button
          :disabled="!pageInfo.hasNextPage || pending"
          @click="
            updateUrl({ page: (parseInt(route.query.page as string) || 1) + 1 })
          "
          class="flex items-center gap-2 px-6 py-3 h-12 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <span class="hidden sm:inline">Next</span>

          <Icon name="material-symbols:keyboard-arrow-right" class="w-5 h-5" />
        </button>

        <!-- Last Page -->
        <button
          :disabled="
            (parseInt(route.query.page as string) || 1) === pageInfo.lastPage ||
            pending
          "
          @click="updateUrl({ page: pageInfo.lastPage })"
          class="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all group"
          title="Last Page"
        >
          <Icon
            name="material-symbols:keyboard-double-arrow-right"
            class="w-5 h-5 group-hover:translate-x-0.5 transition-transform"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom select styling to remove default arrow in some browsers and add custom look */
select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white' stroke-opacity='0.2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1.25rem;
}

option {
  background: #12121a;
  color: white;
}
</style>
