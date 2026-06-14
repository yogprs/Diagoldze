<script setup lang="ts">
useHead({
  title: "Diagoldze — Anime Explorer",
  meta: [
    {
      name: "description",
      content:
        "Discover trending anime, top ratings, and the best recommendations on Diagoldze.",
    },
  ],
});

const [
  { data: trending },
  { data: recommendations },
  { data: top },
  { data: popular },
] = await Promise.all([
  useFetch<APIResponse<AnimeTrending[]>>("/api/anime/trending"),
  useFetch<APIResponse<AnimeGlobal[]>>("/api/anime/recommendations"),
  useFetch<APIResponse<AnimeGlobal[]>>("/api/anime/top"),
  useFetch<APIResponse<AnimeGlobal[]>>("/api/anime/popular"),
]);
</script>

<template>
  <div class="w-full h-full overflow-hidden">
    <div>
      <HomeHeroSlider v-if="trending?.data?.length" :anime="trending?.data" />

      <main class="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        <!-- Trending Carousel -->
        <HomeCarousel
          v-if="trending?.data?.length"
          :anime="trending?.data"
          title="Now Trending"
          subtitle="🔥 Hot Right Now"
        />

        <!-- Recommendation Carousel -->
        <HomeCarousel
          v-if="recommendations?.data?.length"
          :anime="recommendations?.data"
          title="Recommendation For You"
          subtitle="⭐ Recommended"
        />

        <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <HomeAnimeGrid
            v-if="top?.data?.length"
            :anime="top?.data"
            title="Top 10 Anime"
            subtitle="Ranked"
            sort="SCORE_DESC"
          />
          <HomeAnimeGrid
            v-if="popular?.data?.length"
            :anime="popular?.data"
            title="All Time Popular"
            subtitle="Popularity"
            sort="POPULARITY_DESC"
          />
        </div>
      </main>
    </div>
  </div>
</template>
