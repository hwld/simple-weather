import { fetchForecast } from "@/api";
import Link from "next/link";

type Props = { location: string };

export async function ForecastList({ location }: Props) {
  const forecasts = await fetchForecast(location);

  return (
    <div>
      <div>今後の天気</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {forecasts.map((forecast, i) => {
          return (
            <div key={i}>
              <Link href={`detail?location=${location}&date=${forecast.date}`}>
                {forecast.date}
              </Link>
              <div>{forecast.day.condition.text}</div>
              <div>
                {forecast.day.maxtemp_c}/{forecast.day.mintemp_c}℃
              </div>
              <div>{forecast.day.daily_chance_of_rain}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
