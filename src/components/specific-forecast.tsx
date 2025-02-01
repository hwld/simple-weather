import { ReactNode } from "react";
import { css } from "../../styled-system/css";
import { ForecastDay } from "@/api/schema";
import { Card } from "@/components/ui/card";

/* eslint-disable @next/next/no-img-element */
type Props = { forecastDay: ForecastDay };

export async function SpecificForecast({ forecastDay }: Props) {
  return (
    <Card noPadding className={css({ overflow: "hidden" })}>
      <div
        className={css({
          display: "grid",
          gridTemplateColumns: "auto auto minmax(0,1fr) auto auto auto auto",
        })}
      >
        <Tr>
          <Th>時間</Th>
          {/* 画面幅が小さいとアイコンが縮んでしまうため、アイコンとテキストで列を分けてnoBorderを使用する */}
          <Th noBorder>天候</Th>
          <Th alignStart></Th>
          <Th>気温</Th>
          <Th>湿度</Th>
          <Th>降水量</Th>
          <Th lastInRow>風速</Th>
        </Tr>
        {forecastDay.hour.map((h, i) => {
          return (
            <Tr key={i} lastRow={i === forecastDay.hour.length - 1}>
              <Td>{`${i}`.padStart(2, "0")}:00</Td>
              {/* 画面幅が小さいとアイコンが縮んでしまうため、アイコンとテキストで列を分けてnoBorderとnoPadding使用する */}
              <Td noBorder>
                <img
                  src={h.condition.icon}
                  alt="condition"
                  className={css({ width: "30px", height: "30px" })}
                />
              </Td>
              <Td alignStart noPadding>
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
              <Td>{h.temp_c}℃</Td>
              <Td>{h.humidity}％</Td>
              <Td>{h.precip_mm}mm</Td>
              <Td lastInRow>{h.wind_kph}km/h</Td>
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
        borderBottom: lastRow ? "" : "1px solid var(--color-gray-300)",
        alignItems: "center",
      })}
    >
      {children}
    </div>
  );
}

function Th({
  children,
  lastInRow,
  alignStart,
  noBorder,
}: {
  children?: ReactNode;
  lastInRow?: boolean;
  alignStart?: boolean;
  noBorder?: boolean;
}) {
  return (
    <div
      className={css({
        textAlign: alignStart ? "start" : "end",
        wordBreak: "keep-all",
        paddingInline: "var(--space-sm)",
        paddingBlock: "var(--space-xs)",
        borderRight:
          lastInRow || noBorder ? "" : "1px solid var(--color-gray-300)",
        backgroundColor: "var(--color-gray-200)",
        height: "100%",
      })}
    >
      {children}
    </div>
  );
}

function Td({
  children,
  lastInRow,
  alignStart,
  noPadding,
  noBorder,
}: {
  children: ReactNode;
  lastInRow?: boolean;
  alignStart?: boolean;
  noPadding?: boolean;
  noBorder?: boolean;
}) {
  return (
    <div
      className={css({
        paddingInline: noPadding ? "0px" : "var(--space-sm)",
        borderRight:
          lastInRow || noBorder ? "" : "1px solid var(--color-gray-300)",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: alignStart ? "start" : "end",
      })}
    >
      {children}
    </div>
  );
}
