/* eslint-disable @next/next/no-img-element */
import { format } from "date-fns";
import {
  Icon,
  IconArrowRight,
  IconDroplet,
  IconUmbrella,
  IconWind,
} from "@tabler/icons-react";
import Link from "next/link";
import { css } from "../../styled-system/css";
import { type CurrentWeather } from "@/api";
import { Routes } from "@/routes";
import { VStack, HStack } from "@/components/ui/stack";

type Props = { location: string; current: CurrentWeather };

export async function CurrentWeather({ location, current }: Props) {
  const lastUpdatedTime = format(
    current.last_updated_epoch,
    "MM月dd日 HH時mm分ss秒"
  );

  return (
    <VStack className={css({ gap: "8px" })}>
      <div
        className={css({ fontSize: "12px", color: "var(--color-gray-500)" })}
      >
        {`今の天気 (${lastUpdatedTime} 時点)`}
      </div>
      <VStack
        className={css({
          gap: "24px",
          border: "1px solid var(--color-gray-300)",
          borderRadius: "8px",
          backgroundColor: "var(--color-gray-50)",
          padding: "16px",
        })}
      >
        <VStack className={css({ gap: "4px" })}>
          <Link
            className={css({
              width: "fit",
              height: "24px",
              display: "flex",
              alignItems: "center",
              color: "var(--color-link)",
              lineHeight: 1,
              transition: "colors",
              transitionDuration: "0.1s",
              _hover: {
                color: "var(--color-link-hover)",
              },
            })}
            href={Routes.detail({
              locationQuery: location,
              date: current.last_updated_date,
            })}
          >
            <span className={css({ fontSize: "12px" })}>詳細を見る</span>
            <IconArrowRight size={16} />
          </Link>
          <HStack className={css({ gap: "8px", alignItems: "end" })}>
            <img
              src={current.condition.icon}
              alt="condition"
              className={css({ width: "100px", height: "100px" })}
            />
            <VStack className={css({ gap: "4px" })}>
              <HStack
                className={css({
                  gap: "4px",
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
        <HStack className={css({ gap: "16px", paddingInline: "16px" })}>
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
    <HStack className={css({ gap: "8px" })}>
      <Icon
        className={css({
          color: "var(--color-gray-500)",
          width: "20px",
          height: "20px",
          flexShrink: 0,
        })}
      />
      <VStack className={css({ gap: "4px", lineHeight: 1 })}>
        <div className={css({ color: "var(--color-gray-500)" })}>{label}</div>
        <div>{value}</div>
      </VStack>
    </HStack>
  );
}
