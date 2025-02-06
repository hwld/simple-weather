import { fetchSpecificDayForecast } from "@/backend/weather/fetch";
import { LocationNotFoundCard } from "@/components/location-not-found-card";
import { Routes } from "@/routes";
import { IconChevronRight } from "@tabler/icons-react";
import { format } from "date-fns";
import { Metadata } from "next";
import { SpecificDayForecastCard } from "@/components/specific-day-forecast";
import { TextLink } from "@/components/ui/text-link";
import { ReactNode } from "react";
import { WeatherDataNotFoundCard } from "@/components/weather-data-not-found-card";
import { isErr } from "@/utils/result";
import { WeatherDetailParamsSchema } from "@/app/(with-app-header)/weather/[locationId]/[date]/schema";
import { PageLayout } from "@/components/ui/page-layout";

export const metadata: Metadata = {
  title: "指定日の天気 - SimpleWeather",
};

type Props = { params: Promise<unknown> };

export default async function WeatherDetailPage({ params }: Props) {
  const { locationId, date } = WeatherDetailParamsSchema.parse(await params);

  const specificDayForecastResult = await fetchSpecificDayForecast(
    locationId,
    date
  );

  if (isErr(specificDayForecastResult)) {
    switch (specificDayForecastResult.error) {
      case "LocationNotFound": {
        return (
          <WeatherDetailPageLayout date={date}>
            <LocationNotFoundCard />
          </WeatherDetailPageLayout>
        );
      }
      case "DataNotFound": {
        return (
          <WeatherDetailPageLayout date={date}>
            <WeatherDataNotFoundCard date={date} />
          </WeatherDetailPageLayout>
        );
      }
      default: {
        throw new Error(specificDayForecastResult.error satisfies never);
      }
    }
  }

  const { forecastDay, location } = specificDayForecastResult.value;

  return (
    <WeatherDetailPageLayout
      date={date}
      beforeDate={
        <>
          <TextLink href={Routes.weatherSummary({ locationId })}>
            {location.name}
          </TextLink>
          <IconChevronRight size={14} className="shrink-0" />
        </>
      }
    >
      <SpecificDayForecastCard forecastDay={forecastDay} />
    </WeatherDetailPageLayout>
  );
}

function WeatherDetailPageLayout({
  children,
  date,
  beforeDate,
}: {
  children: ReactNode;
  date: string;
  beforeDate?: ReactNode;
}) {
  return (
    <PageLayout
      title={
        <h2>
          <div className="flex gap-1 items-end leading-none">
            {beforeDate}
            <div className="text-xl font-bold break-keep text-primary-500 leading-none">
              {format(date, "M月d日")}
            </div>
            <div className="break-keep">の天気予報</div>
          </div>
        </h2>
      }
    >
      {children}
    </PageLayout>
  );
}
