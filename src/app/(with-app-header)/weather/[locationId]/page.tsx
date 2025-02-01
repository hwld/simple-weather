import { css } from "../../../../../styled-system/css";
import { fetchForecast } from "@/backend/weather/fetch";
import { HStack, VStack } from "@/components/ui/stack";
import { CurrentWeatherCard } from "@/components/current-weather-card";
import { FutureForecastsCard } from "@/components/future-forecasts-card";
import { LocationNotFoundCard } from "@/components/location-not-found-card";
import { isErr } from "@/utils/result";
import { Metadata } from "next";
import { WeatherSummaryParamsSchema } from "@/app/(with-app-header)/weather/[locationId]/schema";
import { CardContainer } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "現在の天気 - SimpleWeather",
};

type Props = { params: Promise<unknown> };

export default async function WeatherSummaryPage({ params }: Props) {
  const { locationId } = WeatherSummaryParamsSchema.parse(await params);

  const forecastResult = await fetchForecast(locationId);
  if (isErr(forecastResult)) {
    return <LocationNotFoundCard />;
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
              wordBreak: "break-all",
              color: "var(--color-primary-500)",
            })}
          >
            {location.name}
          </div>
          <div className={css({ wordBreak: "keep-all" })}>の天気予報</div>
        </HStack>
      </h2>
      <CardContainer>
        <CurrentWeatherCard locationId={locationId} current={current} />
        <div className={css({ flexGrow: 1 })}>
          <FutureForecastsCard
            locationId={locationId}
            forecastdays={forecastdays.slice(1)}
          />
        </div>
      </CardContainer>
    </VStack>
  );
}
