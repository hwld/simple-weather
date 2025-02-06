/* eslint-disable @next/next/no-img-element */
import { ReactNode } from "react";
import { ForecastDay } from "@/backend/weather/schema";
import { Card } from "@/components/ui/card";
import {
  Icon,
  IconClock,
  IconDroplet,
  IconSun,
  IconTemperature,
  IconUmbrella,
  IconWind,
} from "@tabler/icons-react";
import { clsx } from "clsx";

type Props = { forecastDay: ForecastDay };

export async function SpecificDayForecastCard({ forecastDay }: Props) {
  return (
    <Card p="none">
      <div className="grid grid-cols-[repeat(6,auto)_1fr]">
        <Tr>
          <Th icon={IconClock}> 時間</Th>
          <Th icon={IconSun}>天候</Th>
          <Th icon={IconTemperature}>気温</Th>
          <Th icon={IconUmbrella}>降水量</Th>
          <Th icon={IconWind}>風速</Th>
          <Th icon={IconDroplet}>湿度</Th>
          <Th icon={IconSun}>詳細な天候</Th>
        </Tr>
        {forecastDay.hour.map((h, i) => {
          return (
            <Tr key={i}>
              <Td>{`${i}`.padStart(2, "0")}:00</Td>
              <Td>
                <img
                  src={h.condition.icon}
                  alt="condition"
                  className="min-w-[30px] min-h-[30px] size-[30px]"
                />
              </Td>
              <Td>{h.temp_c}℃</Td>
              <Td>{h.precip_mm}mm</Td>
              <Td>{h.wind_kph}km/h</Td>
              <Td>{h.humidity}％</Td>
              <Td alignStart>
                <span className="truncate">{h.condition.text}</span>
              </Td>
            </Tr>
          );
        })}
      </div>
    </Card>
  );
}

function Tr({ children }: { children: ReactNode }) {
  return (
    <div
      className={clsx(
        "grid grid-cols-subgrid col-[1_/_-1] items-center border-b border-base-200 last:border-transparent"
      )}
    >
      {children}
    </div>
  );
}

function Th({
  icon: Icon,
  children,
  alignStart,
}: {
  icon?: Icon;
  children?: ReactNode;
  alignStart?: boolean;
}) {
  return (
    <div
      className={clsx(
        "flex items-center text-base-500 text-xs gap-1 break-keep p-2 bg-base-100 h-full border-r border-base-200 last:border-transparent",
        alignStart ? "text-start" : "text-end"
      )}
    >
      {Icon ? <Icon className="hidden sm:block size-4" /> : null}
      <span className="leading-none">{children}</span>
    </div>
  );
}

function Td({
  children,
  alignStart,
}: {
  children: ReactNode;
  alignStart?: boolean;
}) {
  return (
    <div
      className={clsx(
        "px-2 flex items-center text-xs sm:text-sm h-full border-r border-base-200 last:border-transparent",
        alignStart ? "text-start" : "text-end"
      )}
    >
      {children}
    </div>
  );
}
