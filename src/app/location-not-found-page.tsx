import { IconQuestionMark } from "@tabler/icons-react";
import { css } from "../../styled-system/css";

type Props = {
  locationName: string;
};

export async function LocationNotFoundPage({ locationName }: Props) {
  return (
    <div
      className={css({
        bg: "var(--color-gray-50)",
        border: "solid 1px var(--color-gray-300)",
        padding: "16px",
        borderRadius: "8px",
        height: "300px",
        display: "flex",
        flexDir: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "16px",
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
    </div>
  );
}
