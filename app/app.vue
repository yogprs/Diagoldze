<script setup lang="ts">
useHead({
  bodyAttrs: {
    class:
      "bg-background text-on-background selection:bg-primary-container selection:text-white font-inter",
  },
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
