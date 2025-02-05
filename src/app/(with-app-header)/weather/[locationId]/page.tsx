import { fetchForecast } from "@/backend/weather/fetch";
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
          <div className="grid grid-cols-[auto_1fr] items-end gap-2">
            <div className="text-xl font-bold break-all text-primary-500">
              {location.name}
            </div>
            <div className="break-keep">の天気予報</div>
          </div>
        </h2>
      }
    >
      <div className="grid grid-rows-[auto_1fr] gap-4 min-w-fit h-full">
        <CurrentWeatherCard locationId={locationId} current={current} />
        <FutureForecastsCard
          locationId={locationId}
          forecastdays={forecastdays.slice(1)}
        />
      </div>
    </PageLayout>
  );
}
