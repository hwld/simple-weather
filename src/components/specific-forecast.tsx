import { ReactNode } from "react";
import { css } from "../../styled-system/css";
import { ForecastDay } from "@/api";

/* eslint-disable @next/next/no-img-element */
type Props = { forecastDay: ForecastDay };

export async function SpecificForecast({ forecastDay }: Props) {
  return (
    <div
      className={css({
        border: "1px solid",
        borderRadius: "8px",
        borderColor: "var(--color-gray-300)",
        backgroundColor: "var(--color-gray-50)",
        overflow: "hidden",
      })}
    >
      <table>
        <thead
          className={css({
            backgroundColor: "var(--color-gray-200)",
            fontSize: "12px",
          })}
        >
          <Tr>
            <Th>時間 (時)</Th>
            <Th isFullWidth>天候</Th>
            <Th>気温 (℃)</Th>
            <Th>湿度 (%)</Th>
            <Th>降水量 (mm)</Th>
            <Th lastInRow>風速 (km/h)</Th>
          </Tr>
        </thead>
        <tbody>
          {forecastDay.hour.map((h, i) => {
            return (
              <Tr key={i} isLast={i === forecastDay.hour.length - 1}>
                <Td>{`${i}`.padStart(2, "0")}</Td>
                <Td>
                  <div
                    className={css({
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    })}
                  >
                    <img
                      src={h.condition.icon}
                      width={30}
                      height={30}
                      alt="condition"
                    />
                    <span
                      className={css({
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      })}
                    >
                      {h.condition.text}
                    </span>
                  </div>
                </Td>
                <Td>{h.temp_c}</Td>
                <Td>{h.humidity}</Td>
                <Td>{h.precip_mm}</Td>
                <Td lastInRow>{h.wind_kph}</Td>
              </Tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Tr({ children, isLast }: { children: ReactNode; isLast?: boolean }) {
  return (
    <tr
      className={css({
        borderBottom: isLast ? "" : "1px solid var(--color-gray-300)",
      })}
    >
      {children}
    </tr>
  );
}

function Th({
  children,
  isFullWidth,
  lastInRow,
}: {
  children: ReactNode;
  isFullWidth?: boolean;
  lastInRow?: boolean;
}) {
  return (
    <th
      className={css({
        fontWeight: "normal",
        textAlign: "start",
        wordBreak: "keep-all",
        paddingInline: "8px",
        paddingBlock: "4px",
        width: isFullWidth ? "100%" : "auto",
        borderRight: lastInRow ? "" : "1px solid",
        borderColor: "var(--color-gray-300)",
      })}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  lastInRow,
}: {
  children: ReactNode;
  lastInRow?: boolean;
}) {
  return (
    <td
      className={css({
        paddingInline: "8px",
        borderRight: lastInRow ? "" : "1px solid",
        textAlign: "end",
        borderColor: "var(--color-gray-300)",
      })}
    >
      {children}
    </td>
  );
}
