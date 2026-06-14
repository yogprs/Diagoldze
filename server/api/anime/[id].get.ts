import { apiResponse } from "~~/server/utils/api";
import { ANIME_DETAIL_QUERY } from "~~/server/utils/query";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Anime ID is required",
    });
  }

  const data = await fetchAniList(
    ANIME_DETAIL_QUERY,
    { id: parseInt(id) },
    `anilist:detail:${id}`,
  );
  return apiResponse(
    200,
    "Data retrieved successfully!",
    (data as any)?.Media ?? {},
  );
});
