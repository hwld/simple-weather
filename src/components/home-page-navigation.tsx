"use client";

import Link from "next/link";
import { Routes } from "@/routes";
import { usePathname } from "next/navigation";
import { IconHome, IconHomeFilled } from "@tabler/icons-react";
import { tv } from "tailwind-variants";

const nav = tv({
  base: "grid grid-cols-[auto_1fr] gap-1 leading-none px-2 rounded-sm font-bold break-keep transition-colors duration-100 h-7 items-center",
  variants: {
    isHome: {
      true: "bg-primary-50 border border-primary-500 text-primary-500",
      false: "text-base-500 hover:bg-stone-200",
    },
  },
});

export function HomePageNavigation() {
  const currentPath = usePathname();
  const isHome = currentPath === Routes.home();

  const className = nav({ isHome });

  if (isHome) {
    return (
      <div className={className}>
        <IconHomeFilled className="size-4" />
        ホーム
      </div>
    );
  } else {
    return (
      <Link className={className} href={Routes.home()}>
        <IconHome className="size-4" />
        ホームへ戻る
      </Link>
    );
  }
}
