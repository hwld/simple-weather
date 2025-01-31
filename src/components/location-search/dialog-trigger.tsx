"use client";

import { LocationSearchDialog } from "@/components/location-search/dialog";
import {
  useFloating,
  useClick,
  useDismiss,
  useInteractions,
} from "@floating-ui/react";
import { IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import { css } from "../../../styled-system/css";

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

  return (
    <>
      <button
        className={css({
          display: "flex",
          alignItems: "center",
          bg: "var(--color-gray-100)",
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
          borderRadius: "4px",
          gap: "8px",
          paddingInline: "8px",
          cursor: "pointer",
        })}
        ref={refs.setReference}
        {...getReferenceProps()}
      >
        <IconSearch
          size={20}
          className={css({ color: "var(--color-gray-500)" })}
        />
        <div className={css({ color: "var(--color-gray-500)" })}>
          地域を検索
        </div>
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
