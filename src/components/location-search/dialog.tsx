import { Button } from "@/components/ui/button";
import { HStack, VStack } from "@/components/ui/stack";
import {
  FloatingContext,
  FloatingFocusManager,
  FloatingOverlay,
  UseFloatingReturn,
  UseInteractionsReturn,
} from "@floating-ui/react";
import { IconAlertCircle, IconLoader2, IconSearch } from "@tabler/icons-react";
import { Command } from "cmdk";
import { css } from "../../../styled-system/css";
import { useMemo, useRef, useState } from "react";
import {
  GetLocationNavRoute,
  LocationSearchResultItem,
} from "@/components/location-search/result-item";
import { KbdGuide, Kbd } from "@/components/location-search/kbd";
import { useSearchLocationQuery } from "@/components/location-search/use-search-location-query";
import { useAvailableWindowHeight } from "@/components/location-search/use-available-window-height";
import { useDebouncedValue } from "@/components/use-debounced-value";

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

  const emptyContent = useMemo(() => {
    if (debouncedQuery.length === 0) {
      return <div>地域名や経緯度を入力してください</div>;
    }

    if (!isFetching) {
      if (isError) {
        return (
          <HStack
            className={css({
              gap: "var(--space-sm)",
              alignItems: "start",
              color: "var(--color-error)",
            })}
          >
            <IconAlertCircle />
            <VStack>
              <p>エラーが発生しました</p>
              <p>しばらく経ってからもう一度試してみてください</p>
            </VStack>
          </HStack>
        );
      } else {
        return <div>地域が見つかりませんでした</div>;
      }
    }

    return null;
  }, [debouncedQuery.length, isError, isFetching]);

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
            <HStack
              ref={headerRef}
              className={css({
                padding: "var(--space-sm)",
                borderBottom: "1px solid var(--color-gray-200)",
                gap: "var(--space-sm)",
              })}
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
                        color: "var(--color-gray-500)",
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
              <Command.Empty
                className={css({
                  fontSize: "12px",
                  padding: "var(--space-sm)",
                })}
              >
                {emptyContent}
              </Command.Empty>
              {locations.map((l) => {
                return (
                  <LocationSearchResultItem
                    key={l.id}
                    location={l}
                    onBeforeNavigate={onClose}
                    onGetLocationNavRoute={onGetLocationNavRoute}
                  />
                );
              })}
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
