import { IconQuestionMark } from "@tabler/icons-react";
import { css } from "../../styled-system/css";
import { VStack } from "./ui/stack";

type Props = {
  locationName: string;
};

export async function LocationNotFoundPage({ locationName }: Props) {
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
        <p>
          <span
            className={css({ fontWeight: "bold" })}
          >{`"${locationName}"`}</span>
          が見つかりませんでした
        </p>
        <p>他の地域 (アルファベット) や経緯度で検索してみてください</p>
      </div>
    </VStack>
  );
}
