import {
  WeatherDetailParams,
  WeatherDetailParamsSchema,
} from "@/app/(with-app-header)/weather/[locationId]/[date]/schema";
import { WeatherSummaryParams } from "@/app/(with-app-header)/weather/[locationId]/schema";
import { LocationSearchSearchParams } from "@/app/location-search/schema";

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

export const ApiRoutes = {
  locationSearch: (params: LocationSearchSearchParams) => {
    const searchParams = new URLSearchParams(params);
    return `/location-search?${searchParams.toString()}`;
  },
};

type DetectPageArgs<T = unknown> = { currentPath: string; params: T };

export function isWeatherDetailPage(
  args: DetectPageArgs
): args is DetectPageArgs<WeatherDetailParams> {
  const { params, currentPath } = args;

  const result = WeatherDetailParamsSchema.safeParse(params);
  return result.success && Routes.weatherDetail(result.data) === currentPath;
}
