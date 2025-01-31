import { IconQuestionMark } from "@tabler/icons-react";
import { css } from "../../styled-system/css";
import { VStack } from "./ui/stack";

export async function LocationNotFoundPage() {
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
      <IconQuestionMark
        size={50}
        className={css({ color: "var(--color-gray-500)" })}
      />
      <div className={css({ textAlign: "center" })}>
        <p>地域が見つかりませんでした</p>
        <p>上の検索バーからもう一度検索してみてください</p>
      </div>
    </VStack>
  );
}
