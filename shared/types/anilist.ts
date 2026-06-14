export interface AnimeTitle {
  romaji: string;
  english: string;
  native: string;
}

export interface AnimeDate {
  year: number;
  month: number;
  day: number;
}

export interface AnimeTrailer {
  id: string;
  site: string;
}

export interface AnimeCharacters {
  edges: AnimeCharacterEdge[];
}

export interface AnimeCharacterEdge {
  role: CharacterRole;
  node: AnimeCharacter;
}

export interface AnimeCharacter {
  id: number;
  name: AnimeCharacterName;
  image: AnimeCharacterImage;
}

export interface AnimeCharacterName {
  full: string;
}

export interface AnimeCharacterImage {
  large: string;
}

export interface AnimeStreamingEpisode {
  site: string;
  thumbnail: string;
  title: string;
  url: string;
}

export type AnimeStatus =
  | "FINISHED"
  | "RELEASING"
  | "NOT_YET_RELEASED"
  | "CANCELLED"
  | "HIATUS";

export type AnimeSeason = "WINTER" | "SPRING" | "SUMMER" | "FALL";

export type AnimeFormat =
  | "TV"
  | "TV_SHORT"
  | "MOVIE"
  | "SPECIAL"
  | "OVA"
  | "ONA"
  | "MUSIC";

export type AnimeSource =
  | "ORIGINAL"
  | "MANGA"
  | "LIGHT_NOVEL"
  | "VISUAL_NOVEL"
  | "VIDEO_GAME"
  | "NOVEL"
  | "WEB_NOVEL"
  | "OTHER";

export type CharacterRole = "MAIN" | "SUPPORTING" | "BACKGROUND";

export interface AnimeTitle {
  romaji: string;
  english: string;
  native: string;
}

export interface CoverImage {
  extraLarge: string;
  large: string;
  color: string | null;
}

export interface Studios {
  nodes: Studio[];
}

export interface Studio {
  name: string;
}

export interface Page {
  currentPage: number;
  hasNextPage: boolean;
  lastPage: number;
  perPage: number;
  total: number;
}

export interface Anime {
  id: number;
  title: AnimeTitle;
  coverImage: CoverImage;
  bannerImage: string;
  description: string;
  genres: string[];
  averageScore: number;
  popularity: number;
  episodes: number;
  status: AnimeStatus;
  season: AnimeSeason;
  seasonYear: number;
  format: AnimeFormat;
  source: AnimeSource;
  duration: number;
  startDate: AnimeDate;
  endDate: AnimeDate;
  studios: Studios;
  trailer: AnimeTrailer | null;
  characters: AnimeCharacters;
  streamingEpisodes: AnimeStreamingEpisode[];
}

export type AnimeGlobal = Pick<
  Anime,
  | "id"
  | "title"
  | "coverImage"
  | "bannerImage"
  | "description"
  | "genres"
  | "averageScore"
  | "popularity"
  | "episodes"
  | "status"
  | "season"
  | "seasonYear"
  | "format"
  | "studios"
>;

export type AnimeTrending = Pick<
  Anime,
  | "id"
  | "title"
  | "coverImage"
  | "bannerImage"
  | "description"
  | "genres"
  | "averageScore"
  | "popularity"
  | "episodes"
  | "status"
  | "season"
  | "seasonYear"
  | "format"
  | "studios"
  | "trailer"
>;
