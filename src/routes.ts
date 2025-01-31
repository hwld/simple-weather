import { isValid, parse } from "date-fns";
import { z } from "zod";

export const HomeSearchParamsSchema = z.object({
  locationQuery: z.string().default(""),
});
export type HomeSearchParams = z.infer<typeof HomeSearchParamsSchema>;

export const DetailSearchParamsSchema = z.object({
  locationQuery: z.string().default(""),

  /** yyyy-MM-dd形式の日付 */
  date: z.string().refine((val) => {
    const date = parse(val, "yyyy-MM-dd", new Date());
    return isValid(date);
  }),
});
export type DetailSearchParams = z.infer<typeof DetailSearchParamsSchema>;

export const BasePaths = {
  home: "/",
  detail: "/detail",
};

export const Routes = {
  home: (params: HomeSearchParams) => {
    const searchParams = new URLSearchParams(params);
    return `${BasePaths.home}?${searchParams.toString()}`;
  },
  detail: (params: DetailSearchParams) => {
    const searchParams = new URLSearchParams(params);
    return `${BasePaths.detail}?${searchParams.toString()}`;
  },
};

export const LocationSearchApiSearchParamsSchema = z.object({
  query: z.string(),
});

type LocationSearchApiSearchParams = z.infer<
  typeof LocationSearchApiSearchParamsSchema
>;

// TODO: api/schemaと被っちゃう
const LocationSchema = z.object({
  id: z.number(),
  name: z.string(),
  region: z.string(),
  country: z.string(),
  lat: z.number(),
  lon: z.number(),
});

export type Location = z.infer<typeof LocationSchema>;

export const LocationSearchResponseSchema = z.object({
  locations: LocationSchema.array(),
});

export type LocationSearchResponse = z.infer<
  typeof LocationSearchResponseSchema
>;

export const ApiRoutes = {
  locationSearch: (params: LocationSearchApiSearchParams) => {
    const searchParams = new URLSearchParams(params);
    return `/location-search?${searchParams.toString()}`;
  },
};
