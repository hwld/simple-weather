import {
  CurrentWeather,
  ForecastDay,
  ForecastResponse,
  Location,
} from "@/api/schema";

export const mockLocation: Location = { name: "mockLocation" };

const mockImageUrl =
  "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

export const mockCurrentWeather: CurrentWeather = {
  condition: {
    icon: mockImageUrl,
    text: "mockCurrentWeatherCondition",
  },
  last_updated_epoch: 0,
  temp_c: 1,
  humidity: 2,
  wind_kph: 3,
  precip_mm: 4,
  last_updated_date: "1970-01-01",
};

const mockForecastDay: ForecastDay = {
  date: "1970-01-01",
  day: {
    condition: {
      icon: mockImageUrl,
      text: "mockForecastDayCondition",
    },
    maxtemp_c: 5,
    mintemp_c: 6,
    daily_chance_of_rain: 7,
  },
  hour: [
    {
      time_epoch: 8,
      condition: { icon: mockImageUrl, text: "mockForecastDayHourCondition" },
      temp_c: 9,
      humidity: 10,
      wind_kph: 11,
      precip_mm: 12,
    },
  ],
};

export const mockForecast: ForecastResponse["forecast"] = {
  // 最初の要素は読み飛ばされるの
  forecastday: [mockForecastDay, mockForecastDay],
};
