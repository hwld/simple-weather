import { css } from "../../../../../styled-system/css";
import { fetchForecast } from "@/backend/weather/fetch";
import { WeatherSummaryParamsSchema } from "@/routes";
import { Metadata } from "next";
import { HStack, VStack } from "@/components/ui/stack";
import { CurrentWeather } from "@/components/current-weather";
import { FutureForecastList } from "@/components/future-forecast-list";
import { LocationNotFoundPage } from "@/components/location-not-found-page";
import { isErr } from "@/utils/result";

export const metadata: Metadata = {
  title: "現在の天気 - SimpleWeather",
};

type Props = { params: Promise<unknown> };

export default async function WeatherSummaryPage({ params }: Props) {
  const { locationId } = WeatherSummaryParamsSchema.parse(await params);

  const forecastResult = await fetchForecast(locationId);
  if (isErr(forecastResult)) {
    return <LocationNotFoundPage />;
  }

  const { location, current, forecastdays } = forecastResult.value;

  return (
    <VStack className={css({ h: "100%", gap: "var(--space-lg)" })}>
      <h2>
        <HStack
          className={css({
            alignItems: "end",
            gap: "var(--space-sm)",
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
        </HStack>
      </h2>
      <CurrentWeather locationId={locationId} current={current} />
      <div className={css({ flexGrow: 1 })}>
        <FutureForecastList
          locationId={locationId}
          forecastdays={forecastdays.slice(1)}
        />
      </div>
    </VStack>
  );
}
