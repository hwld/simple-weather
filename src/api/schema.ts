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

export const ForecastResponseSchema = z.object({
  location: LocationSchema,
  current: CurrentWeatherSchema,
  forecast: z.object({ forecastday: z.array(ForecastDaySchema) }),
});

export type ForecastResponse = z.infer<typeof ForecastResponseSchema>;

export const ForecastErrorCode = {
  LocationNotFound: 1006,
} as const;

export const ForecastErrorResopnseSchema = z.object({
  error: z.object({ code: z.number() }),
});

export type ForecastErrorResopnse = z.infer<typeof ForecastErrorResopnseSchema>;
