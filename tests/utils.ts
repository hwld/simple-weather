import { ForecastApiUrl, SearchApiUrl } from "@/backend/weather/url";
import { NextFixture } from "next/experimental/testmode/playwright";

export const createWeatherApiFetchHandler: (mocks: {
  forecastResponse?: Response;
  searchResponse?: Response;
}) => Parameters<NextFixture["onFetch"]>[0] = ({
  forecastResponse,
  searchResponse,
}) => {
  return (req) => {
    const url = new URL(req.url);
    url.search = "";

    if (url.toString() === ForecastApiUrl) {
      return forecastResponse ?? "abort";
    }

    if (url.toString() === SearchApiUrl) {
      return searchResponse ?? "abort";
    }

    return "abort";
  };
};
