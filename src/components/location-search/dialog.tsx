import { Button } from "@/components/ui/button";
import {
  FloatingContext,
  FloatingFocusManager,
  FloatingOverlay,
  UseFloatingReturn,
  UseInteractionsReturn,
} from "@floating-ui/react";
import { IconHistory, IconLoader2, IconSearch } from "@tabler/icons-react";
import { Command } from "cmdk";
import { useMemo, useRef, useState } from "react";
import {
  GetLocationNavRoute,
  LocationSearchResultItem,
} from "@/components/location-search/result-item";
import { KbdGuide, Kbd } from "@/components/ui/kbd";
import { useSearchLocationQuery } from "@/components/location-search/use-search-location-query";
import { useAvailableWindowHeight } from "@/components/location-search/use-available-window-height";
import { useDebouncedValue, useLocalStorage } from "@mantine/hooks";
import { Location } from "@/backend/weather/schema";
import { SearchStatus } from "@/components/location-search/search-status";

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
  const [debouncedQuery] = useDebouncedValue(query, 350);

  const { locations, isError, isFetching } =
    useSearchLocationQuery(debouncedQuery);

  const headerRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLDivElement | null>(null);

  // cmdkはリストの高さを明示的に書く必要があるが、モバイルでは画面の高さに合わせたいため、この値を使用する
  const { availableHeight, updateAvailableHeight } = useAvailableWindowHeight([
    headerRef,
    footerRef,
  ]);

  const status = useMemo(() => {
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

  const [histories, setHistories] = useLocalStorage<Location[]>({
    key: "search-history",
    defaultValue: [],
  });

  const isHistoryVisible =
    query.length === 0 && locations.length === 0 && histories.length > 0;

  const handleBeforeNavigate = (location: Location) => {
    setHistories((histories) => {
      const filtered = histories.filter((h) => h.id !== location.id);
      return [location, ...filtered].slice(0, 3);
    });
    onClose();
  };

  return (
    <FloatingOverlay lockScroll className="bg-black/20">
      <FloatingFocusManager context={floatingContext}>
        <div
          ref={setFloatingRef}
          className="bg-base-100 text-base-700 border border-base-300 shadow-lg inset-0 fixed overflow-hidden sm:rounded-lg sm:inset-[auto_0] sm:m-[60px_auto_0_auto] sm:w-[400px]"
          {...getFloatingProps()}
        >
          <Command
            shouldFilter={false}
            className="flex flex-col gap-2 focus-visible:outline-none"
          >
            <div
              ref={headerRef}
              className="flex flex-col gap-2 p-2 border-b border-base-200"
            >
              <div className="flex items-center gap-2">
                <div className="flex items-center w-full border border-base-300 h-8 rounded-sm overflow-hidden px-1 gap-1 has-focus-visible:border-primary-500 has-focus-visible:outline-primary-500 has-focus-visible:outline">
                  <IconSearch className="size-5 shrink-0 text-base-500 has-[~input:focus-visible]:text-primary-500" />
                  <Command.Input
                    placeholder="地域名(アルファベット)・緯度,軽度"
                    value={query}
                    onValueChange={setQuery}
                    className="grow h-full w-full focus-visible:outline-none placeholder:text-xs"
                  />
                  {isFetching ? (
                    <Command.Loading>
                      <IconLoader2 className="text-primary-600 animate-spin" />
                    </Command.Loading>
                  ) : null}
                </div>
                <div className="block sm:hidden">
                  <Button onClick={onClose} type="subtile">
                    Cancel
                  </Button>
                </div>
              </div>
              {status}
            </div>
            <Command.List
              ref={updateAvailableHeight}
              style={{ ["--list-height" as string]: `${availableHeight}px` }}
              className="overflow-auto h-(--list-height) sm:h-[300px] px-2"
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
              {isHistoryVisible ? (
                <Command.Group
                  className="flex flex-col gap-1"
                  heading={<p className="text-xs text-base-500">検索履歴</p>}
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
            <div
              ref={footerRef}
              className="flex items-center border-t border-base-200 p-2 gap-4 h-10"
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
            </div>
          </Command>
        </div>
      </FloatingFocusManager>
    </FloatingOverlay>
  );
}
