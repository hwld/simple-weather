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
import { Anchor } from "@/components/ui/anchor";
import { Card, CardLabel } from "@/components/ui/card";

type Props = { locationId: string; forecastdays: ForecastDay[] };

export async function FutureForecastList({ locationId, forecastdays }: Props) {
  return (
    <Card className={css({ height: "100%" })}>
      <VStack className={css({ gap: "var(--space-md)" })}>
        <CardLabel label="これからの天気" />
        <VStack
          className={css({
            gap: { base: "var(--space-md)", sm: "var(--space-sm)" },
          })}
        >
          {forecastdays.map((forecast) => {
            return (
              <HStack
                key={forecast.date}
                className={css({
                  gap: "var(--space-sm)",
                  alignItems: "start",
                  borderBottom: "1px solid var(--color-gray-200)",
                  sm: { alignItems: "end", borderBottom: "none" },
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
                      fontSize: "10px",
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
                    <Anchor
                      href={Routes.weatherDetail({
                        locationId,
                        date: forecast.date,
                      })}
                      className={css({
                        width: "24px",
                        height: "24px",
                        display: "grid",
                        placeItems: "center",
                      })}
                    >
                      <IconArrowRight size={16} />
                    </Anchor>
                  </HStack>
                </div>
              </HStack>
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
