"use client";
import { IconExclamationCircle, IconHome } from "@tabler/icons-react";
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
        width: "100%",
        height: "100dvh",
        display: "grid",
        placeItems: "center",
        placeContent: "center",
        gap: "16px",
        padding: "24px",
      })}
    >
      <IconExclamationCircle
        size={50}
        className={css({ color: "var(--color-error)" })}
      />
      <div className={css({ textAlign: "center", maxW: "300px" })}>
        <p>アプリケーションでエラーが発生しました。</p>
        <p>
          URLが正しくない可能性があるため、ホーム画面に戻ってもう一度試してみてください。
        </p>
      </div>
      <button
        className={css({
          bg: "var(--color-error)",
          color: "var(--color-gray-100)",
          rounded: "4px",
          height: "28px",
          paddingInline: "8px",
          lineHeight: 1,
          cursor: "pointer",
          transition: "background",
          transitionDuration: "0.1s",
          _hover: {
            bg: "var(--color-error-hover)",
          },
          display: "flex",
          alignItems: "center",
          gap: "2px",
          fontWeight: "bold",
        })}
        onClick={handleGoToHome}
      >
        <IconHome size={18} />
        ホーム画面に戻る
      </button>
    </div>
  );
}
