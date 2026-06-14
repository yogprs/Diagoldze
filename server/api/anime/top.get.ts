export default defineEventHandler(async () => {
  const data = await fetchAniList(
    TOP_ANIME_QUERY,
    { page: 1, perPage: 10 },
    "anilist:top",
  );
  return apiResponse(
    200,
    "Data retrieved successfully!",
    (data as any)?.Page?.media ?? [],
  );
});
