import "server-only";

import {
  CurrentWeather,
  ForecastDay,
  WeatherAPIErrorCode,
  WeatherApiErrorResopnseSchema,
  ForecastResponseSchema,
  ForecastLocation,
} from "@/api/schema";
import { format } from "date-fns";
import ky, { HTTPError } from "ky";
import { ForecastApiUrl } from "@/api/url";
import { WeatherApiKey } from "@/api/consts";
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
          key: WeatherApiKey,
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
    if (e instanceof HTTPError) {
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

type FetchSpecificForecastResult = Promise<
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
    if (e instanceof HTTPError) {
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
