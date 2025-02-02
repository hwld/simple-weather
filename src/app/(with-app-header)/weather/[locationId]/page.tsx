import { css } from "../../../../../styled-system/css";
import { fetchForecast } from "@/backend/weather/fetch";
import { HStack } from "@/components/ui/stack";
import { CurrentWeatherCard } from "@/components/current-weather-card";
import { FutureForecastsCard } from "@/components/future-forecasts-card";
import { LocationNotFoundCard } from "@/components/location-not-found-card";
import { isErr } from "@/utils/result";
import { Metadata } from "next";
import { WeatherSummaryParamsSchema } from "@/app/(with-app-header)/weather/[locationId]/schema";
import { PageLayout } from "@/components/ui/page-layout";

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
    <PageLayout
      title={
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
      }
    >
      <div
        className={css({
          height: "100%",
          minWidth: "fit-content",
          display: "grid",
          gridTemplateColumns: "1fr",
          gridTemplateRows: "auto 1fr",
          gap: "var(--space-md)",
        })}
      >
        <CurrentWeatherCard locationId={locationId} current={current} />
        <FutureForecastsCard
          locationId={locationId}
          forecastdays={forecastdays.slice(1)}
        />
      </div>
    </PageLayout>
  );
}
