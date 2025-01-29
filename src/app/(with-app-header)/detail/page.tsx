import { fetchSpecificForecast } from "@/api";
import { EmptySearchQueryPage } from "@/app/empty-search-page";
import { LocationNotFoundPage } from "@/app/location-not-found-page";
import { DetailSearchParamsSchema, Routes } from "@/routes";
import { IconChevronRight } from "@tabler/icons-react";
import Link from "next/link";
import { css } from "../../../../styled-system/css";
import { format } from "date-fns";
import { SpecificForecast } from "./specific-forecast";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "指定日の天気 - SimpleWeather",
};

type Props = { searchParams: Promise<unknown> };

export default async function Detail({ searchParams }: Props) {
  const { locationQuery, date } = DetailSearchParamsSchema.parse(
    await searchParams
  );

  if (locationQuery === "") {
    return <EmptySearchQueryPage />;
  }

  const specificForecast = await fetchSpecificForecast(locationQuery, date);
  if (specificForecast === undefined) {
    return <LocationNotFoundPage locationName={locationQuery} />;
  }

  return (
    <div
      className={css({ display: "flex", flexDirection: "column", gap: "24px" })}
    >
      <h2
        className={css({
          display: "flex",
          alignItems: "end",
          gap: "4px",
          lineHeight: 1,
        })}
      >
        <Link
          className={css({
            color: "var(--color-link)",
            transition: "colors",
            transitionDuration: "0.1s",
            _hover: {
              color: "var(--color-link-hover)",
            },
          })}
          href={Routes.home({ locationQuery: locationQuery })}
        >
          {locationQuery}
        </Link>
        <span>
          <IconChevronRight size={14} />
        </span>
        <div className={css({ fontSize: "20px", fontWeight: "bold" })}>
          {format(date, "M月dd日")}
        </div>
        <span>の天気予報</span>
      </h2>
      <SpecificForecast forecastDay={specificForecast} />
    </div>
  );
}
