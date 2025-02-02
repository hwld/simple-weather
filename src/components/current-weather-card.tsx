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
import { css } from "../../styled-system/css";
import { Routes } from "@/routes";
import { VStack, HStack } from "@/components/ui/stack";
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
      <VStack className={css({ gap: "var(--space-lg)" })}>
        <CardLabel label={`現在の天気 (${lastUpdatedTime} 時点)`} />
        <Link
          href={Routes.weatherDetail({
            locationId: locationId,
            date: current.last_updated_date,
          })}
          className={css({
            cursor: "pointer",
            display: "flex",
            flexDir: "column",
            gap: "var(--space-xl)",
            border: "1px solid var(--color-gray-200)",
            borderRadius: "var(--rounded-md)",
            p: "var(--space-md)",
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
          <VStack className={css({ gap: "var(--space-sm)" })}>
            <HStack className={css({ gap: "var(--space-md)" })}>
              <div
                className={css({
                  flexShrink: 0,
                  width: "100px",
                  height: "100px",
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
                <HStack className={css({ color: "var(--color-link)" })}>
                  <span className={css({ fontSize: "12px" })}>詳細を見る</span>
                  <IconArrowRight size={16} />
                </HStack>
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
          <div
            className={css({
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: "var(--space-md)",
              sm: {
                display: "flex",
                alignItems: "center",
              },
            })}
          >
            <WeatherSubItem
              icon={IconMan}
              label="体感気温"
              value={`${current.feelslike_c}℃`}
            />
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
          </div>
        </Link>
      </VStack>
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
        <div
          className={css({
            color: "var(--color-gray-500)",
            wordBreak: "keep-all",
          })}
        >
          {label}
        </div>
        <div>{value}</div>
      </VStack>
    </HStack>
  );
}
