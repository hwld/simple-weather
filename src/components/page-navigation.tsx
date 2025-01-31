"use client";

import Link from "next/link";
import { css } from "../../styled-system/css";
import { BasePaths, Routes } from "@/routes";
import { usePathname } from "next/navigation";

export function PageNavigation() {
  const currentPath = usePathname();

  return (
    <div>
      <Link
        className={css({
          ...(currentPath === BasePaths.home
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
        })}
        href={Routes.home({ locationId: "" })}
      >
        現在の天気
      </Link>
    </div>
  );
}
