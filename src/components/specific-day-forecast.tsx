/* eslint-disable @next/next/no-img-element */
import { ReactNode } from "react";
import { css } from "../../styled-system/css";
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
import { HStack } from "@/components/ui/stack";

type Props = { forecastDay: ForecastDay };

export async function SpecificDayForecastCard({ forecastDay }: Props) {
  return (
    <Card noPadding className={css({ overflow: "hidden" })}>
      <div
        className={css({
          display: "grid",
          // 最後の列は画面幅を小さくしていくと隠れるので優先度が低い情報を置く
          gridTemplateColumns: "auto auto auto auto auto auto minmax(0,1fr)",
        })}
      >
        <Tr>
          <Th icon={IconClock}> 時間</Th>
          {/* 画面幅が小さいとアイコンが縮んでしまうため、アイコンとテキストで列を分けてnoBorderを使用する */}
          <Th icon={IconSun}>天候</Th>
          <Th icon={IconTemperature}>気温</Th>
          <Th icon={IconDroplet}>湿度</Th>
          <Th icon={IconUmbrella}>降水量</Th>
          <Th icon={IconWind}>風速</Th>
          <Th icon={IconSun} lastInRow>
            詳細な天候
          </Th>
        </Tr>
        {forecastDay.hour.map((h, i) => {
          return (
            <Tr key={i} lastRow={i === forecastDay.hour.length - 1}>
              <Td>{`${i}`.padStart(2, "0")}:00</Td>
              <Td>
                <img
                  src={h.condition.icon}
                  alt="condition"
                  className={css({
                    minW: "30px",
                    minH: "30px",
                    width: "30px",
                    height: "30px",
                  })}
                />
              </Td>
              <Td>{h.temp_c}℃</Td>
              <Td>{h.humidity}％</Td>
              <Td>{h.precip_mm}mm</Td>
              <Td>{h.wind_kph}km/h</Td>
              <Td lastInRow alignStart>
                <span
                  className={css({
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  })}
                >
                  {h.condition.text}
                </span>
              </Td>
            </Tr>
          );
        })}
      </div>
    </Card>
  );
}

function Tr({ children, lastRow }: { children: ReactNode; lastRow?: boolean }) {
  return (
    <div
      className={css({
        display: "grid",
        gridTemplateColumns: "subgrid",
        gridColumn: "1 / -1",
        borderBottom: lastRow ? "" : "1px solid var(--color-gray-200)",
        alignItems: "center",
      })}
    >
      {children}
    </div>
  );
}

function Th({
  icon: Icon,
  children,
  lastInRow,
  alignStart,
  noBorder,
}: {
  icon?: Icon;
  children?: ReactNode;
  lastInRow?: boolean;
  alignStart?: boolean;
  noBorder?: boolean;
}) {
  return (
    <HStack
      className={css({
        color: "var(--color-gray-500)",
        fontSize: "12px",
        gap: "var(--space-xs)",
        textAlign: alignStart ? "start" : "end",
        wordBreak: "keep-all",
        paddingInline: "var(--space-sm)",
        paddingBlock: "var(--space-sm)",
        borderRight:
          lastInRow || noBorder ? "" : "1px solid var(--color-gray-200)",
        height: "100%",
        backgroundColor: "var(--color-gray-100)",
      })}
    >
      {Icon ? (
        <Icon
          size={16}
          className={css({ display: { base: "none", sm: "block" } })}
        />
      ) : null}
      <span className={css({ lineHeight: 1 })}>{children}</span>
    </HStack>
  );
}

function Td({
  children,
  lastInRow,
  alignStart,
}: {
  children: ReactNode;
  lastInRow?: boolean;
  alignStart?: boolean;
}) {
  return (
    <div
      className={css({
        paddingInline: "var(--space-sm)",
        borderRight: lastInRow ? "" : "1px solid var(--color-gray-200)",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: alignStart ? "start" : "end",
        fontSize: { base: "12px", sm: "inherit" },
      })}
    >
      {children}
    </div>
  );
}
