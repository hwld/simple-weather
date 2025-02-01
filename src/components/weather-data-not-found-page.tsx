import { IconMaximize } from "@tabler/icons-react";
import { css } from "../../styled-system/css";
import { VStack } from "./ui/stack";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";

type Props = { date: string };

export async function WeatherDataNotFoundPage({ date }: Props) {
  return (
    <Card>
      <VStack
        className={css({
          gap: "var(--space-md)",
          justifyContent: "center",
          alignItems: "center",
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
    </Card>
  );
}
