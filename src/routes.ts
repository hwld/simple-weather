import { SearchedLocationSchema } from "@/api/schema";
import { isValid, parse } from "date-fns";
import { z } from "zod";

// ParamsSchemaはプロパティ名をDynamic Routesのディレクトリ名に合わせる必要がある

export const WeatherSummaryParamsSchema = z
  .object({
    /** 地域検索の結果得られたID */
    locationId: z.string().min(1),
  })
  .strict();

export type WeatherSummaryParams = z.infer<typeof WeatherSummaryParamsSchema>;

export const WeatherDetailParamsSchema = z
  .object({
    /** 地域検索の結果得られたID */
    locationId: z.string().min(1),

    /** yyyy-MM-dd形式の日付 */
    date: z
      .string()
      .min(1)
      .refine((val) => {
        const date = parse(val, "yyyy-MM-dd", new Date());
        return isValid(date);
      }),
  })
  .strict();

export type WeatherDetailParams = z.infer<typeof WeatherDetailParamsSchema>;

type DetectPageArgs<T = unknown> = { currentPath: string; params: T };

export function isWeatherSummaryPage(
  args: DetectPageArgs
): args is DetectPageArgs<WeatherSummaryParams> {
  const { params, currentPath } = args;

  const result = WeatherSummaryParamsSchema.safeParse(params);
  return result.success && Routes.weatherSummary(result.data) === currentPath;
}

export function isWeatherDetailPage(
  args: DetectPageArgs
): args is DetectPageArgs<WeatherDetailParams> {
  const { params, currentPath } = args;

  const result = WeatherDetailParamsSchema.safeParse(params);
  return result.success && Routes.weatherDetail(result.data) === currentPath;
}

export const Routes = {
  home: () => {
    return `/`;
  },
  weatherSummary: (params: WeatherSummaryParams) => {
    return `/weather/${params.locationId}`;
  },
  weatherDetail: (params: WeatherDetailParams) => {
    return `/weather/${params.locationId}/${params.date}`;
  },
};

export const LocationSearchApiSearchParamsSchema = z.object({
  query: z.string(),
});

type LocationSearchApiSearchParams = z.infer<
  typeof LocationSearchApiSearchParamsSchema
>;

// TODO: api/schemaと名前が被っちゃう

// Route handlerが返すlocationをそのまま使う
// 将来的にスキーマを変えたくなっても分離するのは容易だと思う
const LocationSchema = SearchedLocationSchema;

export type Location = z.infer<typeof LocationSchema>;

export const LocationSearchResponseSchema = z.object({
  locations: z.array(LocationSchema),
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
