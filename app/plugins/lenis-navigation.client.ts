export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("page:finish", () => {
    const { $lenis } = useNuxtApp();
    $lenis.scrollTo(0, {
      immediate: true,
    });
  });
});
