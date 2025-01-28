import { css } from "../../styled-system/css";
import { CurrentWeather } from "./current-weather";
import { FutureForecastList } from "./future-forecast-list";
import { LocationHeading } from "./location-heading";

type SearchParams = { [key: string]: string | string[] | undefined };
type Props = { searchParams: Promise<SearchParams> };

export default async function Home({ searchParams }: Props) {
  const location = (await searchParams).location as string;

  return (
    <div
      className={css({
        h: "100%",
        display: "grid",
        gridTemplateRows: "auto auto 1fr",
        gap: "40px",
      })}
    >
      <h2>
        <LocationHeading location={location} />
      </h2>
      <CurrentWeather location={location} />
      <FutureForecastList location={location} />
    </div>
  );
}
