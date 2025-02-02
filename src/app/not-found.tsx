"use client";
import { IconError404, IconHome } from "@tabler/icons-react";
import { css } from "../../styled-system/css";
import { ButtonLink } from "@/components/ui/button";
import { Routes } from "@/routes";
import { VStack } from "@/components/ui/stack";

export default function NotFoundPage() {
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
      <IconError404
        size={80}
        className={css({ color: "var(--color-gray-700)" })}
      />
      <div className={css({ textAlign: "center", maxW: "350px" })}>
        <p>URLが見つかりませんでした。</p>
        <p>ホーム画面に戻ってもう一度試してみてください。</p>
      </div>
      <ButtonLink
        className={css({
          background: "var(--color-gray-700)",
          color: "var(--color-gray-100)",
          _hover: {
            background: "var(--color-gray-800)",
          },
        })}
        icon={IconHome}
        href={Routes.home()}
      >
        ホーム画面に戻る
      </ButtonLink>
    </VStack>
  );
}
