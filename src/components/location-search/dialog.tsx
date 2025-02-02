import { Button } from "@/components/ui/button";
import { HStack, VStack } from "@/components/ui/stack";
import {
  FloatingContext,
  FloatingFocusManager,
  FloatingOverlay,
  UseFloatingReturn,
  UseInteractionsReturn,
} from "@floating-ui/react";
import {
  IconCircleDashed,
  IconExclamationCircle,
  IconHistory,
  IconInfoCircle,
  IconLoader2,
  IconSearch,
} from "@tabler/icons-react";
import { Command } from "cmdk";
import { css, sva } from "../../../styled-system/css";
import { ReactNode, useMemo, useRef, useState } from "react";
import {
  GetLocationNavRoute,
  LocationSearchResultItem,
} from "@/components/location-search/result-item";
import { KbdGuide, Kbd } from "@/components/location-search/kbd";
import { useSearchLocationQuery } from "@/components/location-search/use-search-location-query";
import { useAvailableWindowHeight } from "@/components/location-search/use-available-window-height";
import { useDebouncedValue } from "@/components/use-debounced-value";
import { useLocalStorage } from "@mantine/hooks";
import { Location } from "@/backend/weather/schema";

type Props = {
  onClose: () => void;
  onGetLocationNavRoute: GetLocationNavRoute;
  floatingContext: FloatingContext;
  floatingProps: {
    getFloatingProps: UseInteractionsReturn["getFloatingProps"];
    setFloatingRef: UseFloatingReturn["refs"]["setFloating"];
  };
};

export function LocationSearchDialog({
  onGetLocationNavRoute,
  onClose,
  floatingContext,
  floatingProps: { getFloatingProps, setFloatingRef },
}: Props) {
  const [histories, setHistories] = useLocalStorage<Location[]>({
    key: "search-history",
    defaultValue: [],
  });

  const handleBeforeNavigate = (location: Location) => {
    setHistories((histories) => {
      return Array.from(new Set([location, ...histories])).slice(0, 3);
    });
    onClose();
  };

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 350);

  const { locations, isError, isFetching } =
    useSearchLocationQuery(debouncedQuery);

  const headerRef = useRef<HTMLInputElement | null>(null);
  const footerRef = useRef<HTMLDivElement | null>(null);

  // cmdkはリストの高さを明示的に書く必要があるが、モバイルでは画面の高さに合わせたいため、この値を使用する
  const { availableHeight, updateAvailableHeight } = useAvailableWindowHeight([
    headerRef,
    footerRef,
  ]);

  const statusText = useMemo(() => {
    if (debouncedQuery.length === 0) {
      return (
        <SearchStatus status="empty">
          地域名や経緯度を入力してください
        </SearchStatus>
      );
    } else if (!isFetching && locations.length === 0) {
      if (isError) {
        return <SearchStatus status="error">エラーが発生しました</SearchStatus>;
      } else {
        return (
          <SearchStatus status="nodata">
            地域が見つかりませんでした
          </SearchStatus>
        );
      }
    }

    return null;
  }, [debouncedQuery.length, isError, isFetching, locations.length]);

  return (
    <FloatingOverlay
      lockScroll
      className={css({ backgroundColor: "rgb(0 0 0 / 0.2)" })}
    >
      <FloatingFocusManager context={floatingContext}>
        <div
          ref={setFloatingRef}
          className={css({
            backgroundColor: "var(--color-gray-100)",
            color: "var(--color-gray-700)",
            border: "1px solid var(--color-gray-300)",
            position: "fixed",
            inset: 0,
            overflow: "hidden",
            sm: {
              rounded: "var(--rounded-md)",
              inset: "auto 0",
              margin: "60px auto 0 auto",
              width: "400px",
            },
            boxShadow: "var(--shadow-md)",
          })}
          {...getFloatingProps()}
        >
          <Command
            shouldFilter={false}
            className={css({
              display: "flex",
              flexDir: "column",
              gap: "var(--space-sm)",
              _focusVisible: {
                outline: "none",
              },
            })}
          >
            <VStack
              className={css({
                gap: "var(--space-sm)",
                padding: "var(--space-sm)",
                borderBottom: "1px solid var(--color-gray-200)",
              })}
            >
              <HStack
                ref={headerRef}
                className={css({ gap: "var(--space-sm)" })}
              >
                <HStack
                  className={css({
                    width: "100%",
                    border: "1px solid var(--color-gray-300)",
                    height: "32px",
                    rounded: "var(--rounded-sm)",
                    overflow: "hidden",
                    paddingInline: "var(--space-xs)",
                    gap: "var(--space-xs)",
                    ["&:has(input:focus-visible)"]: {
                      borderColor: "var(--color-primary-500)",
                      outline: "1px solid var(--color-primary-500)",
                    },
                  })}
                >
                  <IconSearch
                    size={20}
                    className={css({
                      flexShrink: 0,
                      color: "var(--color-gray-500)",
                      ["&:has(~ input:focus-visible)"]: {
                        color: "var(--color-primary-500)",
                      },
                    })}
                  />
                  <Command.Input
                    placeholder="地域名(アルファベット)・緯度,軽度"
                    value={query}
                    onValueChange={setQuery}
                    className={css({
                      flexGrow: 1,
                      height: "100%",
                      width: "100%",
                      _focusVisible: {
                        outline: "none",
                        borderColor: "var(--color-primary-500)",
                      },
                      _placeholder: {
                        fontSize: "12px",
                      },
                    })}
                  />
                  {isFetching ? (
                    <Command.Loading>
                      <IconLoader2
                        className={css({
                          color: "var(--color-primary-600)",
                          animation: "loading 1s linear infinite",
                        })}
                      />
                    </Command.Loading>
                  ) : null}
                </HStack>
                <Button
                  onClick={onClose}
                  className={css({
                    display: "block",
                    sm: { display: "none" },
                    _hover: {
                      bg: "var(--color-gray-200)",
                    },
                    height: "32px",
                  })}
                >
                  Cancel
                </Button>
              </HStack>
              {statusText}
            </VStack>
            <Command.List
              ref={updateAvailableHeight}
              style={{ ["--list-height" as string]: `${availableHeight}px` }}
              className={css({
                paddingInline: "var(--space-sm)",
                overflow: "auto",
                height: "var(--list-height)",
                sm: { height: "300px" },
              })}
            >
              {locations.map((l) => {
                return (
                  <LocationSearchResultItem
                    key={l.id}
                    location={l}
                    onBeforeNavigate={handleBeforeNavigate}
                    onGetLocationNavRoute={onGetLocationNavRoute}
                  />
                );
              })}
              {query.length === 0 &&
              locations.length === 0 &&
              histories.length > 0 ? (
                <Command.Group
                  className={css({
                    display: "flex",
                    flexDir: "column",
                    gap: "var(--space-xs)",
                  })}
                  heading={
                    <p
                      className={css({
                        fontSize: "12px",
                        color: "var(--color-gray-500)",
                      })}
                    >
                      検索履歴
                    </p>
                  }
                >
                  {histories.map((l, i) => {
                    return (
                      <LocationSearchResultItem
                        customIcon={IconHistory}
                        key={i}
                        location={l}
                        onBeforeNavigate={handleBeforeNavigate}
                        onGetLocationNavRoute={onGetLocationNavRoute}
                      />
                    );
                  })}
                </Command.Group>
              ) : null}
            </Command.List>
            <HStack
              ref={footerRef}
              className={css({
                borderTop: "1px solid var(--color-gray-200)",
                padding: "var(--space-sm)",
                gap: "var(--space-md)",
                height: "40px",
              })}
            >
              <KbdGuide keys={<Kbd>Enter</Kbd>} description="で表示" />
              <KbdGuide
                keys={
                  <>
                    <Kbd>Up</Kbd>
                    <Kbd>Down</Kbd>
                  </>
                }
                description="で移動"
              />
              <KbdGuide keys={<Kbd>Esc</Kbd>} description="で閉じる" />
            </HStack>
          </Command>
        </div>
      </FloatingFocusManager>
    </FloatingOverlay>
  );
}

const statusClass = sva({
  slots: ["root", "icon", "text"],
  base: {
    root: { gap: "var(--space-xs)" },
    icon: { flexShrink: 0, marginBottom: "1px" },
    text: { fontSize: "12px", lineHeight: 1 },
  },
  variants: {
    status: {
      empty: { root: { color: "var(--color-gray-700)" } },
      error: { root: { color: "var(--color-error)" } },
      nodata: { root: { color: "var(--color-gray-500)" } },
    },
  },
});

export function SearchStatus({
  children,
  status,
}: {
  children: ReactNode;
  status: "error" | "empty" | "nodata";
}) {
  const classes = statusClass({ status });

  const Icon = {
    empty: IconInfoCircle,
    error: IconExclamationCircle,
    nodata: IconCircleDashed,
  }[status];

  return (
    <HStack className={classes.root}>
      <Icon size={14} className={classes.icon} />
      <p className={classes.text}>{children}</p>
    </HStack>
  );
}
