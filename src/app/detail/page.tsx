import { SpecificForecast } from "./specific-forecast";

type SearchParams = { [key: string]: string | string[] | undefined };
type Props = { searchParams: Promise<SearchParams> };

export default async function Home({ searchParams }: Props) {
  const location = (await searchParams).location as string;
  const date = (await searchParams).date as string;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <SpecificForecast location={location} date={date} />
    </div>
  );
}
