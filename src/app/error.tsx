"use client";
import { css } from "../../styled-system/css";
import { useEffect } from "react";

type Props = { error: Error; reset: () => void };

export default function UnhandledErrorPage({ error }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const handleGoToHome = () => {
    // useRouter()を使用してもエラー画面がリセットされないので、windowを直接操作する
    window.location.replace("/");
  };

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
        gap: "24px",
        justifyContent: "center",
        alignItems: "center",
      })}
    >
      <div>エラーが発生しました</div>
      <button
        className={css({
          bg: "var(--color-primary-500)",
          color: "var(--color-gray-100)",
          rounded: "4px",
          height: "28px",
          paddingInline: "8px",
          lineHeight: 1,
          cursor: "pointer",
          _hover: {
            bg: "var(--color-primary-600)",
          },
        })}
        onClick={handleGoToHome}
      >
        ホーム画面に戻る
      </button>
    </div>
  );
}
