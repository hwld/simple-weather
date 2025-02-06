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
import { Kbd } from "@/components/ui/kbd";
import { isServer } from "@tanstack/react-query";
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
        className="flex items-center transition-all duration-100 hover:border-primary-500 hover:outline hover:outline-primary-500 border border-base-300 h-8 rounded-sm px-2 cursor-pointer justify-between group"
        ref={refs.setReference}
        {...getReferenceProps()}
      >
        <div className="grid grid-cols-[auto_1fr] gap-2">
          <IconSearch
            size={20}
            className="group-hover:text-primary-500 transition-colors duration-100"
          />
          <div className="truncate text-base-500">{triggerText}</div>
        </div>
        <Kbd>
          <div className="flex gap-1 items-center">
            {isMac() ? <IconCommand size={12} /> : "Ctrl"}
            <span>+</span>
            <span>K</span>
          </div>
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
