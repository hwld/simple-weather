"use client";

import Link from "next/link";
import { css } from "../../styled-system/css";
import { Routes } from "@/routes";
import { usePathname } from "next/navigation";

export function HomePageNavigation() {
  const currentPath = usePathname();

  const isHome = currentPath === Routes.home();

  const className = css({
    ...(isHome
      ? {
          bg: "var(--color-primary-100)",
          color: "var(--color-primary-700)",
        }
      : {
          color: "var(--color-gray-500)",
          _hover: {
            bg: "var(--color-primary-100)",
          },
        }),
    transition: "background",
    transitionDuration: "0.1s",
    height: "28px",
    display: "flex",
    alignItems: "center",
    paddingInline: "8px",
    borderRadius: "4px",
    fontWeight: "bold",
  });

  if (isHome) {
    return <div className={className}>ホーム画面</div>;
  } else {
    return (
      <Link className={className} href={Routes.home()}>
        ホーム画面
      </Link>
    );
  }
}
