"use client";
import { IconExclamationCircle, IconHome } from "@tabler/icons-react";
import { css } from "../../styled-system/css";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Routes } from "@/routes";
import { VStack } from "@/components/ui/stack";

type Props = { error: Error; reset: () => void };

export default function UnhandledErrorPage({ error }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const handleGoToHome = () => {
    // useRouter()を使用してもエラー画面がリセットされないので、windowを直接操作する
    window.location.replace(Routes.home());
  };

  return (
    <VStack
      className={css({
        width: "100%",
        height: "100dvh",
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--space-md)",
        padding: "var(--space-md)",
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
      <Button
        className={css({
          background: "var(--color-error)",
          color: "var(--color-gray-100)",
          _hover: {
            background: "var(--color-error-hover)",
          },
        })}
        icon={IconHome}
        onClick={handleGoToHome}
      >
        ホーム画面に戻る
      </Button>
    </VStack>
  );
}
