import { format } from "date-fns";
import ky, { HTTPError } from "ky";
import { z } from "zod";

const ConditionSchema = z.object({
  text: z.string(),
  icon: z.string().transform((icon) => {
    return icon.replace(/^\/\//, "https://").replace(/64x64/, "128x128");
  }),
});

// 秒単位をミリ秒単位に変換する
const EpochSchema = z.number().transform((epoch) => epoch * 1000);

/**
 * 現在の天気情報
 */
const CurrentWeatherSchema = z.object({
  last_updated_epoch: EpochSchema,
  condition: ConditionSchema,
  temp_c: z.number(),
  humidity: z.number(),
  wind_kph: z.number(),
  precip_mm: z.number(),
});

export type CurrentWeather = z.infer<typeof CurrentWeatherSchema> & {
  /** yyyy-MM-dd形式の日付 */
  last_updated_date: string;
};

/**
 * 1日分の天気予報
 */
const ForecastDaySchema = z.object({
  /** yyyy-MM-dd形式の日付 */
  date: z.string(),
  day: z.object({
    condition: ConditionSchema,
    maxtemp_c: z.number(),
    mintemp_c: z.number(),
    daily_chance_of_rain: z.number(),
  }),

  // 0時から24時までのデータ
  hour: z.array(
    z.object({
      time_epoch: EpochSchema,
      condition: ConditionSchema,
      temp_c: z.number(),
      humidity: z.number(),
      wind_kph: z.number(),
      precip_mm: z.number(),
    })
  ),
});

export type ForecastDay = z.infer<typeof ForecastDaySchema>;

const LocationSchema = z.object({
  name: z.string(),
});

export type Location = z.infer<typeof LocationSchema>;

const ForecastResponseSchema = z.object({
  location: LocationSchema,
  current: CurrentWeatherSchema,
  forecast: z.object({ forecastday: z.array(ForecastDaySchema) }),
});

/**
 * 位置情報、現在の天気、明日以降の天気予報を取得
 */
export async function fetchForecast(location: string): Promise<
  | {
      location: Location;
      current: CurrentWeather;
      forecastdays: ForecastDay[];
    }
  | undefined
> {
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
      const errorJson = await e.response.json();
      // locationが見つからなかった場合にはundefinedを返す
      if (errorJson?.error?.code === 1006) {
        return undefined;
      }
    }
    throw e;
  }
}

/**
 *  指定された地域の指定された日の予報を取得する
 *
 * @param location 地域の名前
 * @param date yyyy-MM-dd形式の日付
 */
export async function fetchSpecificForecast(
  location: string,
  date: string
): Promise<ForecastDay | undefined> {
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
    return data.forecast.forecastday[0];
  } catch (e) {
    if (e instanceof HTTPError) {
      const errorJson = await e.response.json();
      if (errorJson?.error?.code === 1006) {
        return undefined;
      }
    }
    throw e;
  }
}
