/* eslint-disable @next/next/no-img-element */
import {
  Icon,
  IconArrowRight,
  IconTemperature,
  IconUmbrella,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { css } from "../../styled-system/css";
import { type ForecastDay } from "@/backend/weather/schema";
import { Routes } from "@/routes";
import { VStack, HStack } from "@/components/ui/stack";
import { Card, CardLabel } from "@/components/ui/card";
import Link from "next/link";

type Props = { locationId: string; forecastdays: ForecastDay[] };

export async function FutureForecastsCard({ locationId, forecastdays }: Props) {
  return (
    <Card>
      <VStack className={css({ gap: "var(--space-md)" })}>
        <CardLabel label="これからの天気" />
        <VStack className={css({ gap: "var(--space-xs)" })}>
          {forecastdays.map((forecast) => {
            return (
              <Link
                key={forecast.date}
                href={Routes.weatherDetail({
                  locationId,
                  date: forecast.date,
                })}
                className={css({
                  border: "1px solid var(--color-gray-200)",
                  padding: "var(--space-xs) var(--space-sm)",
                  borderRadius: "var(--space-xs)",
                  display: "flex",
                  alignContent: "center",
                  gap: "var(--space-sm)",
                  alignItems: { base: "start", sm: "end" },
                  transition: "background-color",
                  transitionDuration: "0.1s",
                  _supportHover: {
                    backgroundColor: "var(--color-gray-100)",
                  },
                  _active: {
                    backgroundColor: "var(--color-gray-100)",
                  },
                })}
              >
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
                      fontSize: "12px",
                    })}
                  >
                    {format(new Date(forecast.date), "MM/dd")}
                  </div>
                  <div>
                    {format(new Date(forecast.date), "E", { locale: ja })}
                  </div>
                </VStack>
                <div
                  className={css({
                    flexGrow: 1,
                    display: "flex",
                    flexDir: "column",
                    sm: { flexDir: "row", justifyContent: "space-between" },
                  })}
                >
                  <HStack
                    className={css({ gap: "var(--space-xs)", flexGrow: 1 })}
                  >
                    <img
                      src={forecast.day.condition.icon}
                      alt="condition"
                      className={css({ width: "30px", height: "30px" })}
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
                  <HStack
                    className={css({
                      gap: "var(--space-sm)",
                      paddingLeft: "var(--space-sm)",
                      justifyContent: "space-between",
                    })}
                  >
                    <HStack className={css({ gap: "var(--space-sm)" })}>
                      <ForecastValue
                        icon={IconTemperature}
                        value={`${forecast.day.maxtemp_c} / ${forecast.day.mintemp_c} ℃`}
                      />
                      <ForecastValue
                        icon={IconUmbrella}
                        value={`${forecast.day.daily_chance_of_rain} %`}
                      />
                    </HStack>
                    <IconArrowRight
                      size={18}
                      className={css({ color: "var(--color-link)" })}
                    />
                  </HStack>
                </div>
              </Link>
            );
          })}
        </VStack>
      </VStack>
    </Card>
  );
}

function ForecastValue({ icon: Icon, value }: { icon: Icon; value: string }) {
  return (
    <HStack
      className={css({
        gap: "var(--space-xs)",
        color: "var(--color-gray-500)",
        whiteSpace: "nowrap",
      })}
    >
      <Icon size={16} />
      <span>{value}</span>
    </HStack>
  );
}
