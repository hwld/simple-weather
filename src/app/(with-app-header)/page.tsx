import { fetchForecast } from "@/api";
import { HomeSearchParamsSchema } from "@/routes";
import { CurrentWeather } from "../current-weather";
import { EmptySearchQueryPage } from "../empty-search-page";
import { FutureForecastList } from "../future-forecast-list";
import { LocationNotFoundPage } from "../location-not-found-page";
import { css } from "../../../styled-system/css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "現在の天気 - SimpleWeather",
};

type Props = { searchParams: Promise<unknown> };

export default async function Home({ searchParams }: Props) {
  const { locationQuery } = HomeSearchParamsSchema.parse(await searchParams);

  if (locationQuery === "") {
    return <EmptySearchQueryPage />;
  }

  const forecastResult = await fetchForecast(locationQuery);
  if (forecastResult === undefined) {
    return <LocationNotFoundPage locationName={locationQuery} />;
  }

  const { location, current, forecastdays } = forecastResult;

  return (
    <div
      className={css({
        h: "100%",
        display: "grid",
        gridTemplateRows: "auto auto 1fr",
        gap: "24px",
      })}
    >
      <h2>
        <div
          className={css({
            display: "flex",
            alignItems: "end",
            gap: "4px",
            lineHeight: 1,
          })}
        >
          <div
            className={css({
              fontSize: "20px",
              fontWeight: "bold",
              flexWrap: "wrap",
            })}
          >
            {location.name}
          </div>
          <div className={css({ wordBreak: "keep-all" })}>の天気予報</div>
        </div>
      </h2>
      <CurrentWeather location={location.name} current={current} />
      <FutureForecastList
        location={location.name}
        forecastdays={forecastdays.slice(1)}
      />
    </div>
  );
}
