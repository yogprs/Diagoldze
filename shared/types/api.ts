import type { Page } from "./anilist";

export interface APIResponse<T = unknown> {
  error?: boolean;
  statusCode: number;
  statusMessage?: string;
  message: string;
  data?: T;
}

export interface APIResponseWithPage<T = unknown> {
  error?: boolean;
  statusCode: number;
  statusMessage?: string;
  message: string;
  data?: {
    page: Page;
    data?: T;
  };
}
