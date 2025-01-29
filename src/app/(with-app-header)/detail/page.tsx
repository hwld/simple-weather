import { fetchSpecificForecast } from "@/api";
import { EmptySearchQueryPage } from "@/components/empty-search-page";
import { LocationNotFoundPage } from "@/components/location-not-found-page";
import { DetailSearchParamsSchema, Routes } from "@/routes";
import { IconChevronRight } from "@tabler/icons-react";
import { css } from "../../../../styled-system/css";
import { format } from "date-fns";
import { Metadata } from "next";
import { HStack, VStack } from "@/components/ui/stack";
import { SpecificForecast } from "@/components/specific-forecast";
import { Anchor } from "@/components/ui/anchor";

export const metadata: Metadata = {
  title: "指定日の天気 - SimpleWeather",
};

type Props = { searchParams: Promise<unknown> };

export default async function DetailPage({ searchParams }: Props) {
  const { locationQuery, date } = DetailSearchParamsSchema.parse(
    await searchParams
  );

  return (
    <VStack className={css({ gap: "24px" })}>
      <h2>
        <HStack
          className={css({ gap: "4px", alignItems: "end", lineHeight: 1 })}
        >
          {locationQuery !== "" ? (
            <>
              <Anchor href={Routes.home({ locationQuery })}>
                {locationQuery}
              </Anchor>
              <IconChevronRight size={14} />
            </>
          ) : null}
          <div className={css({ fontSize: "20px", fontWeight: "bold" })}>
            {format(date, "M月dd日")}
          </div>
          <span>の天気予報</span>
        </HStack>
      </h2>
      <DetailPageContent locationQuery={locationQuery} date={date} />
    </VStack>
  );
}

async function DetailPageContent({
  locationQuery,
  date,
}: {
  locationQuery: string;
  date: string;
}) {
  if (locationQuery === "") {
    return <EmptySearchQueryPage />;
  }

  const specificForecast = await fetchSpecificForecast(locationQuery, date);
  if (specificForecast === undefined) {
    return <LocationNotFoundPage locationName={locationQuery} />;
  }

  return <SpecificForecast forecastDay={specificForecast} />;
}
