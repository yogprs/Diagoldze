<script setup lang="ts">
const isOpen = ref(false);
const query = ref("");
const results = ref<AnimeGlobal[]>([]);
const loading = ref(false);
const { $gsap } = useNuxtApp();
const inputRef = ref<HTMLInputElement | null>(null);

// Keyboard shortcut (Ctrl+K or /)
onMounted(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      toggleSearch();
    }
    if (
      e.key === "/" &&
      !isOpen.value &&
      document.activeElement?.tagName !== "INPUT"
    ) {
      e.preventDefault();
      toggleSearch();
    }
    if (e.key === "Escape" && isOpen.value) {
      closeSearch();
    }
  };
  window.addEventListener("keydown", handleKeyDown);
  onUnmounted(() => window.removeEventListener("keydown", handleKeyDown));
});

function toggleSearch() {
  if (isOpen.value) closeSearch();
  else openSearch();
}

function openSearch() {
  isOpen.value = true;
  document.body.style.overflow = "hidden";
  nextTick(() => {
    inputRef.value?.focus();
    $gsap.fromTo(
      ".search-content",
      { opacity: 0, scale: 0.95, y: -20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "power3.out" },
    );
    $gsap.fromTo(
      ".search-backdrop",
      { opacity: 0 },
      { opacity: 1, duration: 0.3 },
    );
  });
}

function closeSearch() {
  $gsap.to(".search-content", {
    opacity: 0,
    scale: 0.95,
    y: -20,
    duration: 0.3,
    ease: "power3.in",
    onComplete: () => {
      isOpen.value = false;
      document.body.style.overflow = "";
      query.value = "";
      results.value = [];
    },
  });
  $gsap.to(".search-backdrop", { opacity: 0, duration: 0.3 });
}

// Search Logic
let timeout: any = null;
watch(query, (newVal) => {
  if (timeout) clearTimeout(timeout);
  if (!newVal.trim()) {
    results.value = [];
    return;
  }

  loading.value = true;
  timeout = setTimeout(async () => {
    try {
      const data = await $fetch<APIResponseWithPage<AnimeGlobal[]>>(
        "/api/anime/search",
        {
          query: { search: newVal, perPage: 6 },
        },
      );
      results.value = data.data?.data || [];
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      loading.value = false;
    }
  }, 400);
});

defineExpose({ openSearch });
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 lenis-prevent"
    >
      <!-- Backdrop -->
      <div
        class="search-backdrop absolute inset-0 bg-[#0a0a0f]/80 backdrop-blur-md"
        @click="closeSearch"
      />

      <!-- Content -->
      <div
        ref="modalRef"
        class="search-content relative w-full max-w-2xl bg-[#12121a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
      >
        <!-- Input Area -->
        <div class="p-4 border-b border-white/5 flex items-center gap-4">
          <Icon name="material-symbols:search" class="w-6 h-6 text-primary" />

          <input
            ref="inputRef"
            v-model="query"
            type="text"
            placeholder="What are you looking for?"
            class="flex-1 bg-transparent border-none text-white text-lg placeholder:text-white/20 focus:ring-0 outline-none"
          />
          <div
            class="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/10"
          >
            <span class="text-[10px] font-bold text-white/40 uppercase"
              >ESC</span
            >
          </div>
          <button
            @click="closeSearch"
            class="p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <div class="w-5 h-5">
              <Icon
                name="material-symbols:close"
                class="w-5 h-5 text-white/40"
              />
            </div>
          </button>
        </div>

        <!-- Results Area -->
        <div class="max-h-[60vh] overflow-y-auto custom-scrollbar">
          <!-- Loading -->
          <div v-if="loading" class="p-12 flex flex-col items-center gap-3">
            <div
              class="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"
            />
            <p class="text-white/20 text-sm font-medium animate-pulse">
              Searching the multiverse...
            </p>
          </div>

          <!-- Result List -->
          <div v-else-if="results.length > 0" class="p-2">
            <div
              class="px-3 py-2 text-[10px] font-black text-white/20 uppercase tracking-widest"
            >
              Anime Results
            </div>
            <NuxtLink
              v-for="anime in results"
              :key="anime.id"
              :to="`/anime/${anime.id}`"
              @click="closeSearch"
              class="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-all group"
            >
              <div
                class="w-12 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-white/5 shadow-lg shadow-black/40"
              >
                <img
                  :src="anime.coverImage.large"
                  :alt="anime.title.romaji"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div class="flex-1 min-w-0">
                <h4
                  class="text-white font-bold text-sm truncate group-hover:text-primary transition-colors"
                >
                  {{ anime.title.english || anime.title.romaji }}
                </h4>
                <div class="flex items-center gap-2 mt-1">
                  <span
                    class="text-[10px] text-white/40 font-medium px-1.5 py-0.5 rounded bg-white/5"
                    >{{ anime.format }}</span
                  >
                  <span class="text-white/20 text-[10px]">•</span>
                  <span class="text-[10px] text-white/40 font-medium">{{
                    anime.seasonYear
                  }}</span>
                  <span class="text-white/20 text-[10px]">•</span>
                  <div class="flex items-center gap-1">
                    <Icon
                      name="material-symbols:star"
                      class="w-2.5 h-2.5 text-yellow-400"
                    />

                    <span class="text-yellow-500/80 text-[10px] font-bold">{{
                      anime.averageScore
                        ? (anime.averageScore / 10).toFixed(1)
                        : "0"
                    }}</span>
                  </div>
                </div>
              </div>
              <Icon
                name="material-symbols:keyboard-arrow-right"
                class="w-5 h-5 text-white/10 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0"
              />
            </NuxtLink>

            <!-- See All -->
            <div class="p-2 border-t border-white/5 mt-2">
              <NuxtLink
                :to="`/browse?search=${query}`"
                @click="closeSearch"
                class="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest hover:bg-primary/20 transition-all"
              >
                View all results for "{{ query }}"
              </NuxtLink>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="query && !loading" class="p-12 text-center">
            <span class="text-4xl mb-4 block">👻</span>
            <p class="text-white/40 text-sm">
              We couldn't find any anime named "{{ query }}"
            </p>
          </div>

          <!-- Initial State / Recommendations -->
          <div v-else-if="!query" class="p-8 text-center">
            <p class="text-white/20 text-sm">
              Start typing to discover anime...
            </p>
            <div class="flex flex-wrap justify-center gap-2 mt-4">
              <button
                v-for="tag in [
                  'One Piece',
                  'Naruto',
                  'Solo Leveling',
                  'Jujutsu Kaisen',
                ]"
                :key="tag"
                @click="query = tag"
                class="px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-[10px] text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
              >
                # {{ tag }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
