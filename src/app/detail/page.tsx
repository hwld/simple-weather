import { format } from "date-fns/format";
import { SpecificForecast } from "./specific-forecast";
import { LocationHeading } from "../location-heading";
import { css } from "../../../styled-system/css";

type SearchParams = { [key: string]: string | string[] | undefined };
type Props = { searchParams: Promise<SearchParams> };

export default async function Home({ searchParams }: Props) {
  const location = (await searchParams).location as string;
  const date = (await searchParams).date as string;

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
      <SpecificForecast location={location} date={date} />
    </div>
  );
}
