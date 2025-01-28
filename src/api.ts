import ky from "ky";
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

/**
 * 1日分の天気情報
 */
const ForecastDaySchema = z.object({
  // yyyy-mm-dd
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

const CurrentResponseSchema = z.object({ current: CurrentWeatherSchema });
const ForecastResponseSchema = z.object({
  forecast: z.object({ forecastday: z.array(ForecastDaySchema) }),
});

/**
 *  現在の天気情報を取得
 */
export async function fetchCurrentWeather(location: string) {
  const json = await ky
    .get("https://api.weatherapi.com/v1/current.json", {
      searchParams: {
        key: process.env.WEATHER_API_KEY ?? "",
        lang: "ja",
        q: location,
      },
    })
    .json();

  const data = CurrentResponseSchema.parse(json);
  return data.current;
}

/**
 * 明日以降の天気予報を取得
 */
export async function fetchForecast(location: string) {
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

  // 今日の天気を除く
  return data.forecast.forecastday.slice(1);
}

/**
 *  特定の日付の天気予報を取得
 */
export async function fetchSpecificForecast(location: string, date: string) {
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
}
