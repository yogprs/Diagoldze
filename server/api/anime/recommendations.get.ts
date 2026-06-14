export default defineEventHandler(async () => {
  const data = await fetchAniList(
    RECOMMENDATIONS_QUERY,
    { page: 1, perPage: 20 },
    "anilist:recommendations",
  );
  return apiResponse(
    200,
    "Data retrieved successfully!",
    (data as any)?.Page?.media ?? [],
  );
});
