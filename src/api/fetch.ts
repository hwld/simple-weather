import {
  CurrentWeather,
  ForecastDay,
  ForecastErrorCode,
  ForecastErrorResopnseSchema,
  ForecastResponseSchema,
  Location,
} from "@/api/schema";
import { format } from "date-fns";
import ky, { HTTPError } from "ky";

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
export async function fetchForecast(location: string): FetchForecastResult {
  try {
    const json = await ky
      .get("https://api.weatherapi.com/v1/forecast.json", {
        searchParams: {
          key: process.env.WEATHER_API_KEY ?? "",
          lang: "ja",
          q: location,
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
      const { error } = ForecastErrorResopnseSchema.parse(
        await e.response.json()
      );
      // locationが見つからなかった場合にはundefinedを返す
      if (error.code === ForecastErrorCode.LocationNotFound) {
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
 * @param location 地域の名前
 * @param date yyyy-MM-dd形式の日付
 */
export async function fetchSpecificForecast(
  location: string,
  date: string
): FetchSpecificForecastResult {
  try {
    const json = await ky
      .get("https://api.weatherapi.com/v1/forecast.json", {
        searchParams: {
          key: process.env.WEATHER_API_KEY ?? "",
          lang: "ja",
          q: location,
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
      const { error } = ForecastErrorResopnseSchema.parse(
        await e.response.json()
      );
      // locationが見つからなかった場合にはundefinedを返す
      if (error.code === ForecastErrorCode.LocationNotFound) {
        return undefined;
      }
    }
    throw e;
  }
}
