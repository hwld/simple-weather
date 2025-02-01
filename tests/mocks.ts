import {
  CurrentWeather,
  ForecastDay,
  ForecastResponse,
  ForecastLocation,
} from "@/backend/weather/schema";

export const mockForecastLocation: ForecastLocation = { name: "mockLocation" };

const mockImageUrl =
  "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

const count = (() => {
  let num = 0;
  return () => {
    num += 1;
    return num;
  };
})();

export const mockCurrentWeather: CurrentWeather = {
  condition: {
    icon: mockImageUrl,
    text: "mockCurrentWeatherCondition",
  },
  last_updated_epoch: count(),
  feelslike_c: count(),
  temp_c: count(),
  humidity: count(),
  wind_kph: count(),
  precip_mm: count(),
  last_updated_date: "1970-01-01",
};

const mockForecastDay: ForecastDay = {
  date: "1970-01-01",
  day: {
    condition: {
      icon: mockImageUrl,
      text: "mockForecastDayCondition",
    },
    maxtemp_c: count(),
    mintemp_c: count(),
    daily_chance_of_rain: count(),
  },
  hour: [
    {
      time_epoch: count(),
      condition: { icon: mockImageUrl, text: "mockForecastDayHourCondition" },
      temp_c: count(),
      humidity: count(),
      wind_kph: count(),
      precip_mm: count(),
    },
  ],
};

export const mockForecast: ForecastResponse["forecast"] = {
  // 最初の要素は読み飛ばされるので2つ作る
  forecastday: [mockForecastDay, mockForecastDay],
};
