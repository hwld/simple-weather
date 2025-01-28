/* eslint-disable @next/next/no-img-element */
import { fetchSpecificForecast } from "@/api";

type Props = { location: string; date: string };

export async function SpecificForecast({ location, date }: Props) {
  const specific = await fetchSpecificForecast(location, date);

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {specific.hour.map((h, i) => {
          return (
            <div key={i}>
              <div>{`${i}`.padStart(2, "0")}:00</div>
              <img
                src={h.condition.icon}
                width={50}
                height={50}
                alt="condition"
              />
              <div>{h.condition.text}</div>
              <div>気温: {h.temp_c}</div>
              <div>湿度: {h.humidity}</div>
              <div>降水量: {h.precip_mm}</div>
              <div>風速: {h.wind_kph}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
