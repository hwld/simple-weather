import { format } from "date-fns/format";
import { SpecificForecast } from "./specific-forecast";
import { LocationHeading } from "../location-heading";
import { css } from "../../../styled-system/css";
import { fetchSpecificForecast } from "@/api";
import { LocationNotFoundPage } from "../location-not-found-page";
import { DetailSearchParamsSchema } from "@/routes";

type Props = { searchParams: Promise<unknown> };

export default async function Detail({ searchParams }: Props) {
  const { location, date } = DetailSearchParamsSchema.parse(await searchParams);

  const specificForecast = await fetchSpecificForecast(location, date);
  if (specificForecast === undefined) {
    return <LocationNotFoundPage locationName={location} />;
  }

  return (
    <div
      className={css({ display: "flex", flexDirection: "column", gap: "1rem" })}
    >
      <h2
        className={css({
          display: "flex",
          flexDirection: "column",
        })}
      >
        <div className={css({ lineHeight: 1 })}>{format(date, "M月dd日")}</div>
        <LocationHeading location={location} />
      </h2>
      <SpecificForecast forecastDay={specificForecast} />
    </div>
  );
}
