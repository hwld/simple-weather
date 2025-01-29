/* eslint-disable @next/next/no-img-element */
import {
  Icon,
  IconArrowRight,
  IconTemperature,
  IconUmbrella,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import Link from "next/link";
import { css } from "../../styled-system/css";
import { type ForecastDay } from "@/api";
import { Routes } from "@/routes";

type Props = { location: string; forecastdays: ForecastDay[] };

export async function FutureForecastList({ location, forecastdays }: Props) {
  return (
    <div
      className={css({
        display: "grid",
        gridTemplateRows: "auto 1fr",
        gap: "8px",
      })}
    >
      <div
        className={css({ fontSize: "12px", color: "var(--color-gray-500)" })}
      >
        今後の天気
      </div>
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          border: "1px solid",
          borderRadius: "8px",
          borderColor: "var(--color-gray-300)",
          backgroundColor: "var(--color-gray-50)",
          padding: "16px",
        })}
      >
        {forecastdays.map((forecast, i) => {
          return (
            <div
              key={i}
              className={css({
                display: "grid",
                gridTemplateColumns: "auto 1fr auto auto auto",
                alignItems: "center",
                gap: "8px",
              })}
            >
              <div
                className={css({
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "end",
                  width: "30px",
                })}
              >
                <div
                  className={css({
                    color: "var(--color-gray-500)",
                    fontSize: "10px",
                  })}
                >
                  {format(new Date(forecast.date), "M/d")}
                </div>
                <div>
                  {format(new Date(forecast.date), "E", { locale: ja })}
                </div>
              </div>
              <div
                className={css({
                  display: "flex",
                  alignItems: "center",
                  gap: "2px",
                })}
              >
                <img
                  src={forecast.day.condition.icon}
                  alt="condition"
                  width={30}
                  height={30}
                />
                <span
                  className={css({
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  })}
                >
                  {forecast.day.condition.text}
                </span>
              </div>

              <Info
                icon={IconTemperature}
                value={`${forecast.day.maxtemp_c} / ${forecast.day.mintemp_c} ℃`}
              />
              <Info
                icon={IconUmbrella}
                value={`${forecast.day.daily_chance_of_rain} %`}
              />
              <Link
                href={Routes.detail({
                  location,
                  date: forecast.date,
                })}
              >
                <IconArrowRight
                  size={16}
                  className={css({ color: "var(--color-link)" })}
                />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Info({ icon: Icon, value }: { icon: Icon; value: string }) {
  return (
    <div
      className={css({
        display: "flex",
        alignItems: "center",
        gap: "2px",
        color: "var(--color-gray-500)",
      })}
    >
      <Icon size={16} />
      <span className={css({ fontSize: "12px" })}>{value}</span>
    </div>
  );
}
