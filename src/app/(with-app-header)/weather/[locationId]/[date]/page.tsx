import { fetchSpecificDayForecast } from "@/backend/weather/fetch";
import { LocationNotFoundCard } from "@/components/location-not-found-card";
import { Routes } from "@/routes";
import { IconChevronRight } from "@tabler/icons-react";
import { css } from "../../../../../../styled-system/css";
import { format } from "date-fns";
import { Metadata } from "next";
import { HStack } from "@/components/ui/stack";
import { SpecificDayForecastCard } from "@/components/specific-day-forecast";
import { Anchor } from "@/components/ui/anchor";
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
          <Anchor
            href={Routes.weatherSummary({ locationId })}
            className={css({ wordBreak: "break-all" })}
          >
            {location.name}
          </Anchor>
          <IconChevronRight size={14} className={css({ flexShrink: 0 })} />
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
          <HStack
            className={css({
              gap: "var(--space-xs)",
              alignItems: "end",
              lineHeight: 1,
            })}
          >
            {beforeDate}
            <div
              className={css({
                fontSize: "20px",
                fontWeight: "bold",
                wordBreak: "keep-all",
                color: "var(--color-primary-500)",
              })}
            >
              {format(date, "M月d日")}
            </div>
            <span className={css({ wordBreak: "keep-all" })}>の天気予報</span>
          </HStack>
        </h2>
      }
    >
      {children}
    </PageLayout>
  );
}
