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
        <div className="space-y-1">
          {forecastdays.map((forecast) => {
            return (
              <Link
                key={forecast.date}
                href={Routes.weatherDetail({
                  locationId,
                  date: forecast.date,
                })}
                className="grid grid-cols-[auto_1fr] gap-2 border rounded-sm border-base-200 py-1 px-2 transition-colors duration-100 hover:bg-base-100 active:bg-base-100 items-start sm:items-end"
              >
                <div className="flex flex-col items-end w-[30px]">
                  <div className="text-base-500 text-xs">
                    {format(new Date(forecast.date), "MM/dd")}
                  </div>
                  <div>
                    {format(new Date(forecast.date), "E", { locale: ja })}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <div className="grid grid-cols-[auto_1fr] items-center gap-1">
                    <img
                      src={forecast.day.condition.icon}
                      alt="condition"
                      className="size-[30px]"
                    />
                    <span className="truncate">
                      {forecast.day.condition.text}
                    </span>
                  </div>
                  <div className="grid grid-cols-[1fr_auto] items-center gap-2 pl-2">
                    <div className="flex gap-2">
                      <ForecastValue
                        icon={IconTemperature}
                        value={`${forecast.day.maxtemp_c} / ${forecast.day.mintemp_c} ℃`}
                      />
                      <ForecastValue
                        icon={IconUmbrella}
                        value={`${forecast.day.daily_chance_of_rain} %`}
                      />
                    </div>
                    <IconArrowRight size={18} className="text-sky-500" />
                  </div>
                </div>
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
