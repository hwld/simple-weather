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
import { VStack, HStack } from "@/components/ui/stack";

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
      <VStack
        className={css({
          gap: "8px",
          border: "1px solid",
          borderRadius: "8px",
          borderColor: "var(--color-gray-300)",
          backgroundColor: "var(--color-gray-50)",
          padding: "16px",
        })}
      >
        {forecastdays.map((forecast) => {
          return (
            <HStack key={forecast.date} className={css({ gap: "8px" })}>
              <VStack
                className={css({
                  alignItems: "end",
                  width: "30px",
                  flexShrink: 0,
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
              </VStack>
              <HStack className={css({ gap: "2px", flexGrow: 1 })}>
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
              </HStack>
              <ForecastValue
                icon={IconTemperature}
                value={`${forecast.day.maxtemp_c} / ${forecast.day.mintemp_c} ℃`}
              />
              <ForecastValue
                icon={IconUmbrella}
                value={`${forecast.day.daily_chance_of_rain} %`}
              />
              <Link
                href={Routes.detail({
                  locationQuery: location,
                  date: forecast.date,
                })}
                className={css({
                  width: "24px",
                  height: "24px",
                  display: "grid",
                  placeItems: "center",
                  color: "var(--color-link)",
                  transition: "colors",
                  transitionDuration: "0.1s",
                  _hover: {
                    color: "var(--color-link-hover)",
                  },
                })}
              >
                <IconArrowRight size={16} />
              </Link>
            </HStack>
          );
        })}
      </VStack>
    </div>
  );
}

function ForecastValue({ icon: Icon, value }: { icon: Icon; value: string }) {
  return (
    <HStack
      className={css({
        gap: "2px",
        color: "var(--color-gray-500)",
        whiteSpace: "nowrap",
      })}
    >
      <Icon size={16} />
      <span className={css({ fontSize: "12px" })}>{value}</span>
    </HStack>
  );
}
