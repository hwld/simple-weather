import { IconMaximize } from "@tabler/icons-react";
import { css } from "../../styled-system/css";
import { VStack } from "./ui/stack";
import { format } from "date-fns";

type Props = { date: string };

export async function WeatherDataNotFoundPage({ date }: Props) {
  return (
    <VStack
      className={css({
        gap: "16px",
        justifyContent: "center",
        alignItems: "center",
        bg: "var(--color-gray-50)",
        border: "solid 1px var(--color-gray-300)",
        padding: "16px",
        borderRadius: "8px",
        height: "300px",
      })}
    >
      <IconMaximize
        size={50}
        className={css({ color: "var(--color-gray-500)" })}
      />
      <div className={css({ textAlign: "center" })}>
        <p>
          <span className={css({ fontWeight: "bold" })}>
            `{format(date, "yyyy年MM月dd日")}`
          </span>
          の天気予報が表示できませんでした。
        </p>
        <p>表示できるのは直近の天気予報のみです。</p>
      </div>
    </VStack>
  );
}
