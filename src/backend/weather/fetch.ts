import "server-only";

import {
  CurrentWeather,
  ForecastDay,
  WeatherAPIErrorCode,
  WeatherApiErrorResopnseSchema,
  ForecastResponseSchema,
  ForecastLocation,
  SearchResponseSchema,
  Location,
} from "@/backend/weather/schema";
import { format } from "date-fns";
import ky, { HTTPError } from "ky";
import { ForecastApiUrl, SearchApiUrl } from "@/backend/weather/url";
import { Result } from "@/utils/result";

type FetchForecastResult = Promise<
  Result<
    {
      location: ForecastLocation;
      current: CurrentWeather;
      forecastdays: ForecastDay[];
    },
    string
  >
>;

/**
 * 位置情報、現在の天気、明日以降の天気予報を取得
 */
export async function fetchForecast(locationId: string): FetchForecastResult {
  try {
    const json = await ky
      .get(ForecastApiUrl, {
        searchParams: {
          key: process.env.WEATHER_API_KEY,
          lang: "ja",
          q: `id:${locationId}`,
          days: 7,
        },
      })
      .json();

    const data = ForecastResponseSchema.parse(json);
    return Result.ok({
      location: data.location,
      current: {
        ...data.current,
        last_updated_date: format(
          data.current.last_updated_epoch,
          "yyyy-MM-dd"
        ),
      },
      forecastdays: data.forecast.forecastday,
    });
  } catch (e) {
    console.error(e);

    if (
      e instanceof HTTPError &&
      e.response.status >= 400 &&
      e.response.status < 500
    ) {
      const { error } = WeatherApiErrorResopnseSchema.parse(
        await e.response.json()
      );
      if (error.code === WeatherAPIErrorCode.LocationNotFound) {
        return Result.err("LocationNotFound");
      }
    }
    throw e;
  }
}

type FetchSpecificDayForecastResult = Promise<
  Result<
    { location: ForecastLocation; forecastDay: ForecastDay },
    "LocationNotFound" | "DataNotFound"
  >
>;

/**
 *  指定された地域の指定された日の予報を取得する
 *
 * @param locationId 検索の結果得られた地域のID
 * @param date yyyy-MM-dd形式の日付
 */
export async function fetchSpecificDayForecast(
  locationId: string,
  date: string
): FetchSpecificDayForecastResult {
  try {
    const json = await ky
      .get(ForecastApiUrl, {
        searchParams: {
          key: process.env.WEATHER_API_KEY,
          lang: "ja",
          q: `id:${locationId}`,
          dt: date,
        },
      })
      .json();

    const data = ForecastResponseSchema.parse(json);

    // 指定された日付のデータが存在しないと空になる
    if (!data.forecast.forecastday[0]) {
      return Result.err("DataNotFound");
    }

    return Result.ok({
      location: data.location,
      forecastDay: data.forecast.forecastday[0],
    });
  } catch (e) {
    console.error(e);

    if (
      e instanceof HTTPError &&
      e.response.status >= 400 &&
      e.response.status < 500
    ) {
      const { error } = WeatherApiErrorResopnseSchema.parse(
        await e.response.json()
      );
      // locationが見つからなかった場合にはundefinedを返す
      if (error.code === WeatherAPIErrorCode.LocationNotFound) {
        return Result.err("LocationNotFound");
      }
    }
    throw e;
  }
}

type FetchLocationsResult = Promise<{ locations: Location[] }>;

/**
 * 地域を検索する
 *
 * @param query
 * @returns
 */
export async function fetchLocations(query: string): FetchLocationsResult {
  try {
    const json = await ky
      .get(SearchApiUrl, {
        searchParams: {
          key: process.env.WEATHER_API_KEY,
          q: query,
        },
      })
      .json();

    const data = SearchResponseSchema.parse(json);
    return { locations: data };
  } catch (e) {
    throw e;
  }
}
