import { apiResponse } from "~~/server/utils/api";

export default defineEventHandler(async () => {
  const data = await fetchAniList(
    POPULAR_QUERY,
    { page: 1, perPage: 10 },
    "anilist:popular",
  );
  return apiResponse(
    200,
    "Data retrieved successfully!",
    (data as any)?.Page?.media ?? [],
  );
});
