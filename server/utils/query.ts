// ============================================================
// AniList GraphQL Queries
// Used by server/utils/anilist.ts via fetchAniList()
// ============================================================

export const TRENDING_QUERY = `
  query TrendingAnime($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(sort: TRENDING_DESC, type: ANIME, isAdult: false) {
        id
        title { romaji english native }
        coverImage { extraLarge large color }
        bannerImage
        description(asHtml: false)
        genres
        averageScore
        popularity
        episodes
        status
        season
        seasonYear
        format
        studios(isMain: true) { nodes { name } }
        trailer { id site }
      }
    }
  }
`;

export const RECOMMENDATIONS_QUERY = `
  query RecommendedAnime($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(sort: POPULARITY_DESC, type: ANIME, isAdult: false, status: FINISHED) {
        id
        title { romaji english native }
        coverImage { extraLarge large color }
        bannerImage
        description(asHtml: false)
        genres
        averageScore
        popularity
        episodes
        status
        season
        seasonYear
        format
        studios(isMain: true) { nodes { name } }
      }
    }
  }
`;

export const TOP_ANIME_QUERY = `
  query TopAnime($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(sort: SCORE_DESC, type: ANIME, isAdult: false) {
        id
        title { romaji english native }
        coverImage { extraLarge large color }
        bannerImage
        description(asHtml: false)
        genres
        averageScore
        popularity
        episodes
        status
        season
        seasonYear
        format
        studios(isMain: true) { nodes { name } }
      }
    }
  }
`;

export const POPULAR_QUERY = `
  query AllTimePopular($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(sort: POPULARITY_DESC, type: ANIME, isAdult: false) {
        id
        title { romaji english native }
        coverImage { extraLarge large color }
        bannerImage
        description(asHtml: false)
        genres
        averageScore
        popularity
        episodes
        status
        season
        seasonYear
        format
        studios(isMain: true) { nodes { name } }
      }
    }
  }
`;

export const ANIME_BROWSE_QUERY = `
  query Page($page: Int, $perPage: Int, $sort: [MediaSort], $status: MediaStatus, $type: MediaType, $format: MediaFormat, $genre: String, $search: String) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        currentPage
        hasNextPage
        lastPage
        perPage
        total
      }
      media(sort: $sort, status: $status, type: $type, format: $format, genre: $genre, search: $search, isAdult: false) {
        id
        title { romaji english native }
        coverImage { extraLarge large color }
        bannerImage
        description(asHtml: false)
        genres
        averageScore
        popularity
        episodes
        status
        season
        seasonYear
        format
        studios(isMain: true) { nodes { name } }
      }
    }
  }
`;

export const ANIME_DETAIL_QUERY = `
  query AnimeDetail($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      title { romaji english native }
      coverImage { extraLarge large color }
      bannerImage
      description(asHtml: false)
      genres
      averageScore
      popularity
      episodes
      status
      season
      seasonYear
      format
      source
      duration
      startDate { year month day }
      endDate { year month day }
      studios(isMain: true) { nodes { name } }
      trailer { id site }
      characters(sort: ROLE, page: 1, perPage: 6) {
        edges {
          role
          node {
            id
            name { full }
            image { large }
          }
        }
      }
      streamingEpisodes {
        site
        thumbnail
        title
        url
      }
    }
  }
`;

export const BATCH_ANIME_QUERY = `
  query BatchAnime($id_in: [Int], $page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(id_in: $id_in, type: ANIME) {
        id
        title { romaji english native }
        coverImage { extraLarge large color }
        bannerImage
        description(asHtml: false)
        genres
        averageScore
        popularity
        episodes
        status
        season
        seasonYear
        format
        studios(isMain: true) { nodes { name } }
      }
    }
  }
`;
