import { IconQuestionMark } from "@tabler/icons-react";
import { css } from "../../styled-system/css";
import { VStack } from "./ui/stack";
import { Card } from "@/components/ui/card";

export async function LocationNotFoundPage() {
  return (
    <Card>
      <VStack
        className={css({
          height: "300px",
          gap: "16px",
          justifyContent: "center",
          alignItems: "center",
        })}
      >
        <IconQuestionMark
          size={50}
          className={css({ color: "var(--color-gray-500)" })}
        />
        <div className={css({ textAlign: "center" })}>
          <p>地域が見つかりませんでした</p>
          <p>上の検索バーからもう一度検索してみてください</p>
        </div>
      </VStack>
    </Card>
  );
}
