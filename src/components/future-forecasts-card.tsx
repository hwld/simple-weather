/* eslint-disable @next/next/no-img-element */
import {
  Icon,
  IconArrowRight,
  IconTemperature,
  IconUmbrella,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { type ForecastDay } from "@/backend/weather/schema";
import { Routes } from "@/routes";
import { Card, CardLabel } from "@/components/ui/card";
import Link from "next/link";

type Props = { locationId: string; forecastdays: ForecastDay[] };

export async function FutureForecastsCard({ locationId, forecastdays }: Props) {
  return (
    <Card>
      <div className="space-y-4">
        <CardLabel label="これからの天気" />
        <div className="gap-2 grid sm:grid-cols-[auto_1fr_auto_auto_auto] grid-cols-[max-content_max-content_max-content_1fr] grid-rows-2">
          {forecastdays.map((forecast) => {
            return (
              <Link
                key={forecast.date}
                href={Routes.weatherDetail({
                  locationId,
                  date: forecast.date,
                })}
                className="grid col-span-full grid-cols-subgrid grid-rows-[auto_auto] gap-2 sm:grid-rows-1 border rounded-sm border-base-200 p-2 transition-colors duration-100 hover:bg-base-100 active:bg-base-100 place-content-center items-start sm:items-center"
              >
                <div className="flex flex-col items-end row-span-full sm:row-span-1">
                  <div className="text-base-500 text-xs">
                    {format(new Date(forecast.date), "MM/dd")}
                  </div>
                  <div>
                    {format(new Date(forecast.date), "E", { locale: ja })}
                  </div>
                </div>
                <div className="grid grid-cols-[auto_1fr] items-center gap-1 col-[span_3] sm:col-span-1">
                  <img
                    src={forecast.day.condition.icon}
                    alt="condition"
                    className="size-[30px]"
                  />
                  <span className="truncate">
                    {forecast.day.condition.text}
                  </span>
                </div>
                <ForecastValue
                  icon={IconTemperature}
                  value={`${forecast.day.maxtemp_c} / ${forecast.day.mintemp_c} ℃`}
                />
                <ForecastValue
                  icon={IconUmbrella}
                  value={`${forecast.day.daily_chance_of_rain} %`}
                />
                <IconArrowRight
                  size={18}
                  className="text-sky-500 justify-self-end"
                />
              </Link>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

function ForecastValue({ icon: Icon, value }: { icon: Icon; value: string }) {
  return (
    <div className="grid grid-cols-[auto_1fr] items-center gap-1 text-base-500">
      <Icon size={16} />
      <span>{value}</span>
    </div>
  );
}
