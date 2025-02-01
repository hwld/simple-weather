"use client";

import { LocationSearchDialog } from "@/components/location-search/dialog";
import {
  useFloating,
  useClick,
  useDismiss,
  useInteractions,
} from "@floating-ui/react";
import { IconCommand, IconSearch } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { css } from "../../../styled-system/css";
import { Kbd } from "@/components/location-search/kbd";
import { isServer } from "@tanstack/react-query";
import { HStack } from "@/components/ui/stack";

export function LocationSearchDialogTrigger() {
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

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
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

  return (
    <>
      <button
        className={css({
          display: "flex",
          alignItems: "center",
          transition: "all",
          transitionDuration: "0.1s",
          _hover: {
            bg: "transparent",
            borderColor: "var(--color-primary-500)",
            outline: "1px solid var(--color-primary-500)",
            ["&:hover>svg"]: {
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
        <HStack className={css({ gap: "var(--space-sm)" })}>
          <IconSearch
            size={20}
            className={css({ color: "var(--color-gray-500)" })}
          />
          <div className={css({ color: "var(--color-gray-500)" })}>
            地域を検索
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
