import { fetchSpecificForecast } from "@/api/fetch";
import { LocationNotFoundPage } from "@/components/location-not-found-page";
import { WeatherDetailParamsSchema, Routes } from "@/routes";
import { IconChevronRight } from "@tabler/icons-react";
import { css } from "../../../../../../styled-system/css";
import { format } from "date-fns";
import { Metadata } from "next";
import { HStack, VStack } from "@/components/ui/stack";
import { SpecificForecast } from "@/components/specific-forecast";
import { Anchor } from "@/components/ui/anchor";
import { ReactNode } from "react";
import { WeatherDataNotFoundPage } from "@/components/weather-data-not-found-page";
import { isErr } from "@/utils/result";

export const metadata: Metadata = {
  title: "指定日の天気 - SimpleWeather",
};

type Props = { params: Promise<unknown> };

export default async function WeatherDetailPage({ params }: Props) {
  const { locationId, date } = WeatherDetailParamsSchema.parse(await params);

  const specificForecastResult = await fetchSpecificForecast(locationId, date);

  if (isErr(specificForecastResult)) {
    switch (specificForecastResult.error) {
      case "LocationNotFound": {
        return (
          <DetailPageLayout date={date}>
            <LocationNotFoundPage />
          </DetailPageLayout>
        );
      }
      case "DataNotFound": {
        return (
          <DetailPageLayout date={date}>
            <WeatherDataNotFoundPage date={date} />
          </DetailPageLayout>
        );
      }
      default: {
        throw new Error(specificForecastResult.error satisfies never);
      }
    }
  }

  const { forecastDay, location } = specificForecastResult.value;

  return (
    <DetailPageLayout
      date={date}
      beforeDate={
        <>
          <Anchor href={Routes.weatherSummary({ locationId })}>
            {location.name}
          </Anchor>
          <IconChevronRight size={14} />
        </>
      }
    >
      <SpecificForecast forecastDay={forecastDay} />
    </DetailPageLayout>
  );
}

function DetailPageLayout({
  children,
  date,
  beforeDate,
}: {
  children: ReactNode;
  date: string;
  beforeDate?: ReactNode;
}) {
  return (
    <VStack className={css({ gap: "var(--space-lg)" })}>
      <h2>
        <HStack
          className={css({
            gap: "var(--space-xs)",
            alignItems: "end",
            lineHeight: 1,
          })}
        >
          {beforeDate}
          <div className={css({ fontSize: "20px", fontWeight: "bold" })}>
            {format(date, "M月dd日")}
          </div>
          <span>の天気予報</span>
        </HStack>
      </h2>
      {children}
    </VStack>
  );
}
