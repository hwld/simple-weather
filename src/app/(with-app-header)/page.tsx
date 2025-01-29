import { fetchForecast } from "@/api";
import { HomeSearchParamsSchema } from "@/routes";
import { CurrentWeather } from "../../components/current-weather";
import { EmptySearchQueryPage } from "../../components/empty-search-page";
import { FutureForecastList } from "../../components/future-forecast-list";
import { LocationNotFoundPage } from "../../components/location-not-found-page";
import { css } from "../../../styled-system/css";
import { Metadata } from "next";
import { HStack } from "@/components/ui/stack";

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
        <HStack
          className={css({ alignItems: "end", gap: "4px", lineHeight: 1 })}
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
        </HStack>
      </h2>
      <CurrentWeather location={location.name} current={current} />
      <FutureForecastList
        location={location.name}
        forecastdays={forecastdays.slice(1)}
      />
    </div>
  );
}
