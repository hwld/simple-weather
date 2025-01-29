import { fetchForecast } from "@/api";
import { css } from "../../styled-system/css";
import { CurrentWeather } from "./current-weather";
import { FutureForecastList } from "./future-forecast-list";
import { LocationHeading } from "./location-heading";
import { LocationNotFoundPage } from "./location-not-found-page";
import { HomeSearchParamsSchema } from "@/routes";

type Props = { searchParams: Promise<unknown> };

export default function Home({ searchParams }: Props) {
  return <Inner searchParams={searchParams} />;
}

async function Inner({ searchParams }: { searchParams: Promise<unknown> }) {
  const { locationQuery } = HomeSearchParamsSchema.parse(await searchParams);

  if (locationQuery === "") {
    return <EmptySearchQueryPage />;
  }

  const forecastResult = await fetchForecast(locationQuery);
  if (forecastResult === undefined) {
    return <LocationNotFoundPage locationName={locationQuery} />;
  }

  const { location, current, forecastdays } = forecastResult;

  return (
    <div
      className={css({
        h: "100%",
        display: "grid",
        gridTemplateRows: "auto auto auto 1fr",
        gap: "24px",
      })}
    >
      <h2>
        <LocationHeading location={location.name} />
      </h2>
      <CurrentWeather location={location.name} current={current} />
      <FutureForecastList
        location={location.name}
        forecastdays={forecastdays.slice(1)}
      />
    </div>
  );
}

function EmptySearchQueryPage() {
  return (
    <div
      className={css({
        bg: "var(--color-gray-50)",
        border: "solid 1px var(--color-gray-300)",
        padding: "16px",
        borderRadius: "8px",
        height: "300px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      })}
    >
      検索バーに地域(アルファベット)・経緯度を入力し、検索ボタンを押してください。
    </div>
  );
}
