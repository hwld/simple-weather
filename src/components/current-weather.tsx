/* eslint-disable @next/next/no-img-element */
import { format } from "date-fns";
import {
  Icon,
  IconArrowRight,
  IconDroplet,
  IconUmbrella,
  IconWind,
} from "@tabler/icons-react";
import { css } from "../../styled-system/css";
import { Routes } from "@/routes";
import { VStack, HStack } from "@/components/ui/stack";
import { Anchor } from "@/components/ui/anchor";
import { type CurrentWeather } from "@/backend/weather/schema";
import { Card } from "@/components/ui/card";

type Props = {
  locationId: string;
  current: CurrentWeather;
};

export async function CurrentWeather({ locationId, current }: Props) {
  const lastUpdatedTime = format(
    current.last_updated_epoch,
    "MM月dd日 HH時mm分ss秒"
  );

  return (
    <VStack className={css({ gap: "var(--space-sm)" })}>
      <div
        className={css({ fontSize: "12px", color: "var(--color-gray-500)" })}
      >
        {`今の天気 (${lastUpdatedTime} 時点)`}
      </div>
      <Card>
        <VStack className={css({ gap: "var(--space-lg)" })}>
          <VStack className={css({ gap: "var(--space-sm)" })}>
            <Anchor
              className={css({
                width: "fit",
                height: "24px",
                display: "flex",
                alignItems: "center",
                lineHeight: 1,
              })}
              href={Routes.weatherDetail({
                locationId: locationId,
                date: current.last_updated_date,
              })}
            >
              <span className={css({ fontSize: "12px" })}>詳細を見る</span>
              <IconArrowRight size={16} />
            </Anchor>
            <HStack className={css({ gap: "var(--space-md)" })}>
              <div
                className={css({
                  flexShrink: 0,
                  width: "100px",
                  height: "100px",
                  border: "1px solid var(--color-gray-200)",
                  borderRadius: "var(--rounded-md)",
                })}
              >
                <img
                  src={current.condition.icon}
                  alt="condition"
                  className={css({
                    width: "100%",
                    height: "100%",
                  })}
                />
              </div>
              <VStack className={css({ gap: "var(--space-sm)" })}>
                <HStack
                  className={css({
                    gap: "var(--space-sm)",
                    alignItems: "end",
                    lineHeight: 1,
                  })}
                >
                  <div
                    className={css({
                      fontSize: "40px",
                      fontWeight: "bold",
                    })}
                  >
                    {current.temp_c}
                  </div>
                  <div className={css({ fontSize: "32px" })}>℃</div>
                </HStack>
                <div>{current.condition.text}</div>
              </VStack>
            </HStack>
          </VStack>
          <HStack
            className={css({
              gap: "var(--space-md)",
              paddingInline: "var(--space-md)",
            })}
          >
            <WeatherSubItem
              icon={IconDroplet}
              label="湿度"
              value={`${current.humidity}%`}
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
          </HStack>
        </VStack>
      </Card>
    </VStack>
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
    <HStack className={css({ gap: "var(--space-sm)" })}>
      <Icon
        className={css({
          color: "var(--color-gray-500)",
          width: "20px",
          height: "20px",
          flexShrink: 0,
        })}
      />
      <VStack className={css({ gap: "var(--space-xs)", lineHeight: 1 })}>
        <div className={css({ color: "var(--color-gray-500)" })}>{label}</div>
        <div>{value}</div>
      </VStack>
    </HStack>
  );
}
