export default defineEventHandler(async (event) => {
  const queryParams = getQuery(event);

  const variables = {
    page: parseInt(queryParams.page as string) || 1,
    perPage: parseInt(queryParams.perPage as string) || 20,
    sort: queryParams.sort || undefined,
    status: queryParams.status || undefined,
    type: queryParams.type || "ANIME",
    format: queryParams.format || undefined,
    genre: queryParams.genre || undefined,
    search: queryParams.search || undefined,
  };

  // Fetch directly from AniList without Redis caching as requested
  const response = await $fetch<{ data: any }>("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: {
      query: ANIME_BROWSE_QUERY,
      variables,
    },
  });

  const data = {
    page: response.data?.Page?.pageInfo ?? {},
    data: response.data?.Page?.media ?? [],
  };

  return apiResponse(200, "Data retrieved successfully!", data);
});
