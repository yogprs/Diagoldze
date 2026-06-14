interface Config {
  NODE_ENV: string;
  REDIS_URL: string;
  ANILIST_URL: string;
  CACHE_TTL: number;
}

export const config: Config = {
  NODE_ENV: process.env.NODE_ENV || "development",
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
  ANILIST_URL: process.env.ANILIST_URL!,
  CACHE_TTL: process.env.CACHE_TTL ? Number(process.env.CACHE_TTL) : 3600,
};
