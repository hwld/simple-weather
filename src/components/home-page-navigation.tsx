"use client";

import Link from "next/link";
import { css } from "../../styled-system/css";
import { Routes } from "@/routes";
import { usePathname } from "next/navigation";
import { IconHome, IconHomeFilled } from "@tabler/icons-react";

export function HomePageNavigation() {
  const currentPath = usePathname();

  const isHome = currentPath === Routes.home();

  const className = css({
    ...(isHome
      ? {
          bg: "var(--color-primary-50)",
          color: "var(--color-primary-500)",
          border: "1px solid var(--color-primary-500)",
        }
      : {
          color: "var(--color-gray-500)",
          _hover: {
            bg: "var(--color-gray-200)",
          },
        }),
    transition: "background",
    transitionDuration: "0.1s",
    height: "28px",
    display: "flex",
    alignItems: "center",
    lineHeight: 1,
    gap: "var(--space-xs)",
    paddingInline: "var(--space-sm)",
    borderRadius: "var(--rounded-sm)",
    fontWeight: "bold",
    wordBreak: "keep-all",
  });

  if (isHome) {
    return (
      <div className={className}>
        <IconHomeFilled size={16} />
        ホーム画面
      </div>
    );
  } else {
    return (
      <Link className={className} href={Routes.home()}>
        <IconHome size={16} />
        ホーム画面へ
      </Link>
    );
  }
}
