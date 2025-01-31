import { css } from "../../../styled-system/css";
import { fetchForecast } from "@/api/fetch";
import { HomeSearchParamsSchema } from "@/routes";
import { Metadata } from "next";
import { HStack } from "@/components/ui/stack";
import { CurrentWeather } from "@/components/current-weather";
import { EmptyLocationIdPage } from "@/components/empty-location-id-page";
import { FutureForecastList } from "@/components/future-forecast-list";
import { LocationNotFoundPage } from "@/components/location-not-found-page";

export const metadata: Metadata = {
  title: "現在の天気 - SimpleWeather",
};

type Props = { searchParams: Promise<unknown> };

export default async function HomePage({ searchParams }: Props) {
  const { locationId } = HomeSearchParamsSchema.parse(await searchParams);

  if (locationId === "") {
    return <EmptyLocationIdPage />;
  }

  const forecastResult = await fetchForecast(locationId);
  if (forecastResult === undefined) {
    return <LocationNotFoundPage />;
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
      <CurrentWeather locationId={locationId} current={current} />
      <FutureForecastList
        locationId={locationId}
        forecastdays={forecastdays.slice(1)}
      />
    </div>
  );
}
