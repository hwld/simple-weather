import { CurrentWeather } from "./current-weather";
import { ForecastList } from "./forecast-list";

type SearchParams = { [key: string]: string | string[] | undefined };
type Props = { searchParams: Promise<SearchParams> };

export default async function Home({ searchParams }: Props) {
  const location = (await searchParams).location as string;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <CurrentWeather location={location} />
      <ForecastList location={location} />
    </div>
  );
}
