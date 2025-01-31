import { fetchSpecificForecast } from "@/api/fetch";
import { EmptyLocationIdPage } from "@/components/empty-location-id-page";
import { LocationNotFoundPage } from "@/components/location-not-found-page";
import { DetailSearchParamsSchema, Routes } from "@/routes";
import { IconChevronRight } from "@tabler/icons-react";
import { css } from "../../../../styled-system/css";
import { format } from "date-fns";
import { Metadata } from "next";
import { HStack, VStack } from "@/components/ui/stack";
import { SpecificForecast } from "@/components/specific-forecast";
import { Anchor } from "@/components/ui/anchor";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "指定日の天気 - SimpleWeather",
};

type Props = { searchParams: Promise<unknown> };

export default async function DetailPage({ searchParams }: Props) {
  const { locationId, date } = DetailSearchParamsSchema.parse(
    await searchParams
  );

  if (locationId === "") {
    return (
      <DetailPageLayout date={date}>
        <EmptyLocationIdPage />
      </DetailPageLayout>
    );
  }

  const specificForecastResult = await fetchSpecificForecast(locationId, date);
  if (specificForecastResult === undefined) {
    return (
      <DetailPageLayout date={date}>
        <LocationNotFoundPage />
      </DetailPageLayout>
    );
  }

  const { forecastDay, location } = specificForecastResult;

  return (
    <DetailPageLayout
      date={date}
      beforeDate={
        <>
          <Anchor href={Routes.home({ locationId })}>{location.name}</Anchor>
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
    <VStack className={css({ gap: "24px" })}>
      <h2>
        <HStack
          className={css({ gap: "4px", alignItems: "end", lineHeight: 1 })}
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
