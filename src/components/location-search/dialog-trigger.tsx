"use client";

import { LocationSearchDialog } from "@/components/location-search/dialog";
import {
  useFloating,
  useClick,
  useDismiss,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import { IconCommand, IconSearch } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { css, cx } from "../../../styled-system/css";
import { Kbd } from "@/components/location-search/kbd";
import { isServer } from "@tanstack/react-query";
import { HStack } from "@/components/ui/stack";
import { useParams, usePathname } from "next/navigation";
import { isWeatherDetailPage, Routes } from "@/routes";
import { format } from "date-fns";
import { GetLocationNavRoute } from "@/components/location-search/result-item";

export function LocationSearchDialogTrigger() {
  const currentPath = usePathname();
  const params = useParams();

  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  // ショートカットキーでダイアログを開く
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        setIsOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  // 現在いるページによって検索後に遷移するページが異なるので、その情報をここで取得しておく
  const { triggerText, getLocationNavRoute } = useMemo((): {
    triggerText: string;
    getLocationNavRoute: GetLocationNavRoute;
  } => {
    const args = { currentPath, params };

    if (isWeatherDetailPage(args)) {
      return {
        triggerText: `${format(args.params.date, "M月d日")}の天気を知りたい地域を検索`,
        getLocationNavRoute: (locationId) =>
          Routes.weatherDetail({
            locationId: `${locationId}`,
            date: args.params.date,
          }),
      };
    }

    return {
      triggerText: "現在の天気を知りたい地域を検索",
      getLocationNavRoute: (locationId) =>
        Routes.weatherSummary({ locationId: `${locationId}` }),
    };
  }, [currentPath, params]);

  return (
    <>
      <button
        className={css({
          display: "flex",
          alignItems: "center",
          transition: "all",
          transitionDuration: "0.1s",
          _hover: {
            borderColor: "var(--color-primary-500)",
            outline: "1px solid var(--color-primary-500)",
            ["& .search-icon"]: {
              color: "var(--color-primary-500)",
            },
          },
          _focusVisible: {
            borderColor: "var(--color-primary-500)",
            outline: "1px solid var(--color-primary-500)",
            ["& .search-icon"]: {
              color: "var(--color-primary-500)",
            },
          },
          border: "1px solid var(--color-gray-300)",
          height: "32px",
          borderRadius: "var(--rounded-sm)",
          gap: "var(--space-sm)",
          justifyContent: "space-between",
          paddingInline: "var(--space-sm)",
          cursor: "pointer",
        })}
        ref={refs.setReference}
        {...getReferenceProps()}
      >
        <HStack className={css({ gap: "var(--space-sm)", minW: 0 })}>
          <IconSearch
            size={20}
            className={cx(
              css({
                flexShrink: 0,
                color: "var(--color-gray-500)",
                transition: "all",
                transitionDuration: "0.1s",
              }),
              "search-icon"
            )}
          />
          <div
            className={css({
              color: "var(--color-gray-500)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            })}
          >
            {triggerText}
          </div>
        </HStack>
        <Kbd>
          <HStack className={css({ gap: "var(--space-xs)" })}>
            {isMac() ? <IconCommand size={12} /> : "Ctrl"}
            <span>+</span>
            <span>K</span>
          </HStack>
        </Kbd>
      </button>
      {isOpen ? (
        <LocationSearchDialog
          floatingContext={context}
          floatingProps={{ getFloatingProps, setFloatingRef: refs.setFloating }}
          onGetLocationNavRoute={getLocationNavRoute}
          onClose={handleClose}
        />
      ) : null}
    </>
  );
}

function isMac() {
  if (isServer) {
    return true;
  }
  return window.navigator.userAgent.toLowerCase().includes("mac");
}
