import { IconSearch } from "@tabler/icons-react";
import { css } from "../../styled-system/css";

export function EmptySearchQueryPage() {
  return (
    <div
      className={css({
        bg: "var(--color-gray-50)",
        border: "solid 1px var(--color-primary-500)",
        padding: "32px",
        borderRadius: "8px",
        height: "300px",
        display: "flex",
        flexDir: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "24px",
      })}
    >
      <IconSearch
        size={50}
        className={css({ color: "var(--color-primary-500)" })}
      />
      <p className={css({ maxWidth: "300px", textAlign: "center" })}>
        天気を知りたい地域 (アルファベット)
        や経緯度を上の検索バーに入力してください
      </p>
    </div>
  );
}
