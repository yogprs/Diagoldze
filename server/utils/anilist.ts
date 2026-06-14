import { config } from "../config";
import { redisClient } from "./redis";

export async function fetchAniList<T>(
  query: string,
  variables: Record<string, unknown> = {},
  cacheKey: string,
): Promise<T> {
  const redis = redisClient();

  // 1. Try to fetch from Redis cache
  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log(`[AniList] Cache HIT → ${cacheKey}`);
      return JSON.parse(cached) as T;
    }
  } catch (err) {
    console.warn("[AniList] Cache read error:", err);
  }

  // 2. Fetch from AniList GraphQL
  console.log(`[AniList] Cache MISS → fetching ${cacheKey}`);
  const response = await $fetch<{ data: T }>(config.ANILIST_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: { query, variables },
  });

  const data = response.data;

  // 3. Save to Redis with default 1 hour TTL
  try {
    await redis.setex(cacheKey, config.CACHE_TTL, JSON.stringify(data));
    console.log(
      `[AniList] Cache SET → ${cacheKey} (TTL: ${config.CACHE_TTL}s)`,
    );
  } catch (err) {
    console.warn("[AniList] Cache write error:", err);
  }

  return data;
}
