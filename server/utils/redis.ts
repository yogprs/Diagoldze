import { Redis } from "ioredis";
import { config } from "../config";

let redis: Redis | null = null;

export const redisClient = (): Redis => {
  if (!redis) {
    const url = config.REDIS_URL;

    redis = new Redis(url, {
      lazyConnect: true,
      maxRetriesPerRequest: 2,
      connectTimeout: 5000,
    });

    redis.on("connect", () => console.log("[Redis] ✅ Connected"));
    redis.on("error", (err) => console.error("[Redis] ❌ Error:", err.message));
  }

  return redis;
};
