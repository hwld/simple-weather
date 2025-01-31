import "server-only";

import {
  CurrentWeather,
  ForecastDay,
  WeatherAPIErrorCode,
  WeatherApiErrorResopnseSchema,
  ForecastResponseSchema,
  Location,
} from "@/api/schema";
import { format } from "date-fns";
import ky, { HTTPError } from "ky";
import { ForecastApiUrl } from "@/api/url";
import { WeatherApiKey } from "@/api/consts";

type FetchForecastResult = Promise<
  | {
      location: Location;
      current: CurrentWeather;
      forecastdays: ForecastDay[];
    }
  | undefined
>;

/**
 * 位置情報、現在の天気、明日以降の天気予報を取得
 */
export async function fetchForecast(locationId: string): FetchForecastResult {
  try {
    const json = await ky
      .get(ForecastApiUrl, {
        searchParams: {
          key: WeatherApiKey,
          lang: "ja",
          q: `id:${locationId}`,
          days: 7,
        },
      })
      .json();

    const data = ForecastResponseSchema.parse(json);
    return {
      location: data.location,
      current: {
        ...data.current,
        last_updated_date: format(
          data.current.last_updated_epoch,
          "yyyy-MM-dd"
        ),
      },
      forecastdays: data.forecast.forecastday,
    };
  } catch (e) {
    if (e instanceof HTTPError) {
      const { error } = WeatherApiErrorResopnseSchema.parse(
        await e.response.json()
      );
      // locationが見つからなかった場合にはundefinedを返す
      if (error.code === WeatherAPIErrorCode.LocationNotFound) {
        return undefined;
      }
    }
    throw e;
  }
}

type FetchSpecificForecastResult = Promise<
  { location: Location; forecastDay: ForecastDay } | undefined
>;

/**
 *  指定された地域の指定された日の予報を取得する
 *
 * @param locationId 検索の結果得られた地域のID
 * @param date yyyy-MM-dd形式の日付
 */
export async function fetchSpecificForecast(
  locationId: string,
  date: string
): FetchSpecificForecastResult {
  try {
    const json = await ky
      .get(ForecastApiUrl, {
        searchParams: {
          key: WeatherApiKey,
          lang: "ja",
          q: `id:${locationId}`,
          d: date,
        },
      })
      .json();

    const data = ForecastResponseSchema.parse(json);
    return {
      location: data.location,
      forecastDay: data.forecast.forecastday[0],
    };
  } catch (e) {
    if (e instanceof HTTPError) {
      const { error } = WeatherApiErrorResopnseSchema.parse(
        await e.response.json()
      );
      // locationが見つからなかった場合にはundefinedを返す
      if (error.code === WeatherAPIErrorCode.LocationNotFound) {
        return undefined;
      }
    }
    throw e;
  }
}
