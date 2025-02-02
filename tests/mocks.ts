import {
  ForecastDay,
  ForecastResponse,
  Location,
} from "@/backend/weather/schema";

const count = (() => {
  let num = 0;
  return () => {
    num += 1;
    return num;
  };
})();

const mockImageUrl =
  "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

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

export const mockForecastResponse: ForecastResponse = {
  current: {
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
  },
  forecast: {
    // 最初の要素は読み飛ばされるので2つ作る
    forecastday: [mockForecastDay, mockForecastDay],
  },
  location: { name: "mockLocation" },
};

export const mockLocation: Location = {
  id: count(),
  country: "mockCountry",
  region: "mockRegion",
  name: "mockName",
  lat: count(),
  lon: count(),
};
