/* eslint-disable @next/next/no-img-element */
import { fetchCurrentWeather } from "@/api";
import { format } from "date-fns";
import Link from "next/link";

type Props = { location: string };

export async function CurrentWeather({ location }: Props) {
  const current = await fetchCurrentWeather(location);

  return (
    <div>
      <div>
        {`今の天気 (${format(
          current.last_updated_epoch,
          "hh時mm分ss秒"
        )} 時点)`}
      </div>
      <img
        src={current.condition.icon}
        alt="condition"
        width={128}
        height={128}
      />
      <Link
        href={`/detail?location=${location}?date=${format(
          current.last_updated_epoch,
          "yyyy-MM-dd"
        )}`}
      >
        詳細を見る
      </Link>
      <div>天候: {current.condition.text}</div>
      <div>気温: {current.temp_c}</div>
      <div>湿度: {current.humidity}</div>
      <div>降水量: {current.precip_mm}</div>
      <div>風速: {current.wind_kph}</div>
    </div>
  );
}
