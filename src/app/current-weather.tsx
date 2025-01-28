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
import { fetchCurrentWeather } from "@/api";

type Props = { location: string };

export async function CurrentWeather({ location }: Props) {
  const current = await fetchCurrentWeather(location);
  const lastUpdatedTime = format(current.last_updated_epoch, "HH時mm分ss秒");

  return (
    <div className={css({ display: "flex", flexDir: "column", gap: "8px" })}>
      <div
        className={css({ fontSize: "12px", color: "var(--color-gray-500)" })}
      >
        {`今の天気 (${lastUpdatedTime} 時点)`}
      </div>
      <div
        className={css({
          display: "flex",
          flexDir: "column",
          gap: "24px",
          border: "1px solid var(--color-gray-300)",
          borderRadius: "8px",
          backgroundColor: "var(--color-gray-50)",
          padding: "16px",
        })}
      >
        <div className={css({ display: "flex", flexDir: "column" })}>
          <Link
            className={css({
              display: "flex",
              alignItems: "center",
              color: "var(--color-link)",
              lineHeight: 1,
            })}
            href={`/detail?location=${location}&date=${format(
              current.last_updated_epoch,
              "yyyy-MM-dd"
            )}`}
          >
            <span className={css({ fontSize: "12px" })}>詳細を見る</span>
            <IconArrowRight size={16} />
          </Link>
          <div
            className={css({
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: "8px",
              alignItems: "end",
            })}
          >
            <img
              src={current.condition.icon}
              alt="condition"
              width={100}
              height={100}
            />
            <div
              className={css({
                display: "flex",
                flexDir: "column",
                gap: "4px",
              })}
            >
              <div
                className={css({
                  display: "flex",
                  alignItems: "end",
                  gap: "4px",
                })}
              >
                <div
                  className={css({
                    fontSize: "40px",
                    lineHeight: 1,
                    fontWeight: "bold",
                  })}
                >
                  {current.temp_c}
                </div>
                <div className={css({ fontSize: "32px", lineHeight: 1 })}>
                  ℃
                </div>
              </div>
              <div>{current.condition.text}</div>
            </div>
          </div>
        </div>
        <div
          className={css({
            display: "flex",
            alignItems: "center",
            paddingInline: "16px",
            gap: "8px",
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
        </div>
      </div>
    </div>
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
    <div className={css({ display: "flex", alignItems: "center", gap: "4px" })}>
      <Icon
        className={css({
          color: "var(--color-gray-500)",
          width: "20px",
          height: "20px",
        })}
      />
      <div className={css({ display: "flex", flexDir: "column", gap: "4px" })}>
        <div
          className={css({
            fontSize: "12px",
            color: "var(--color-gray-500)",
            lineHeight: 1,
          })}
        >
          {label}
        </div>
        <div className={css({ lineHeight: 1 })}>{value}</div>
      </div>
    </div>
  );
}
