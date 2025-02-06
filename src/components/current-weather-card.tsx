/* eslint-disable @next/next/no-img-element */
import { format } from "date-fns";
import {
  Icon,
  IconArrowRight,
  IconDroplet,
  IconMan,
  IconUmbrella,
  IconWind,
} from "@tabler/icons-react";
import { Routes } from "@/routes";
import { type CurrentWeather } from "@/backend/weather/schema";
import { Card, CardLabel } from "@/components/ui/card";
import Link from "next/link";

type Props = {
  locationId: string;
  current: CurrentWeather;
};

export async function CurrentWeatherCard({ locationId, current }: Props) {
  const lastUpdatedTime = format(
    current.last_updated_epoch,
    "MM月dd日 HH時mm分ss秒"
  );

  return (
    <Card>
      <div className="space-y-4">
        <CardLabel label={`現在の天気 (${lastUpdatedTime} 時点)`} />
        <Link
          href={Routes.weatherDetail({
            locationId: locationId,
            date: current.last_updated_date,
          })}
          className="grid grid-rows-[auto_1fr] gap-8 p-4 border-base-200 border rounded-lg transition-colors duration-100 active:bg-base-100 hover:bg-base-100"
        >
          <div className="grid grid-cols-[auto_1fr] gap-4">
            <div className="size-[100px]">
              <img
                src={current.condition.icon}
                alt="condition"
                className="size-full"
              />
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-[max-content_auto] text-sky-500">
                <span className="text-xs">詳細を見る</span>
                <IconArrowRight className="size-4" />
              </div>
              <div className="grid grid-cols-[auto_1fr] items-end gap-2 leading-none">
                <div className="font-bold text-[40px]">{current.temp_c}</div>
                <div className="text-[32px]">℃</div>
              </div>
              <div>{current.condition.text}</div>
            </div>
          </div>
          <div className="grid sm:flex grid-cols-[auto_1fr] gap-4">
            <WeatherSubItem
              icon={IconMan}
              label="体感気温"
              value={`${current.feelslike_c}℃`}
            />
            <WeatherSubItem
              icon={IconUmbrella}
              label="降水量"
              value={`${current.precip_mm}mm`}
            />
            <WeatherSubItem
              icon={IconWind}
              label="風速"
              value={`${current.wind_kph}km/h`}
            />
            <WeatherSubItem
              icon={IconDroplet}
              label="湿度"
              value={`${current.humidity}%`}
            />
          </div>
        </Link>
      </div>
    </Card>
  );
}

function WeatherSubItem({
  icon: Icon,
  label,
  value,
}: {
  icon: Icon;
  label: string;
  value: string;
}) {
  return (
    <div className="grid grid-cols-[auto_1fr] items-center gap-2">
      <Icon className="text-base-500 size-5" />
      <div className="grid grid-rows-2 leading-none gap-1">
        <div className="text-base-500 break-keep">{label}</div>
        <div>{value}</div>
      </div>
    </div>
  );
}
