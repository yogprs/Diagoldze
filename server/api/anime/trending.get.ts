export default defineEventHandler(async () => {
  const data = await fetchAniList(
    TRENDING_QUERY,
    { page: 1, perPage: 20 },
    "anilist:trending",
  );
  return apiResponse(
    200,
    "Data retrieved successfully!",
    (data as any)?.Page?.media ?? [],
  );
});
