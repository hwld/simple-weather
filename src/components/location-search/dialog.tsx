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
  IconAlertCircle,
  IconLoader2,
  IconMapPin,
  IconSearch,
} from "@tabler/icons-react";
import { Command } from "cmdk";
import { css } from "../../../styled-system/css";
import {
  ApiRoutes,
  Location,
  LocationSearchResponseSchema,
  Routes,
  isWeatherSummaryPage,
  isWeatherDetailPage,
} from "@/routes";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  ReactNode,
  SyntheticEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ky from "ky";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedValue } from "@mantine/hooks";

type Props = {
  onClose: () => void;
  floatingContext: FloatingContext;
  floatingProps: {
    getFloatingProps: UseInteractionsReturn["getFloatingProps"];
    setFloatingRef: UseFloatingReturn["refs"]["setFloating"];
  };
};

export function LocationSearchDialog({
  onClose,
  floatingContext,
  floatingProps: { getFloatingProps, setFloatingRef },
}: Props) {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(query, 350);

  const {
    data: locations = [],
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["search-location", debouncedQuery],
    enabled: debouncedQuery.length > 0,
    queryFn: async () => {
      const response = await ky
        .get(ApiRoutes.locationSearch({ query: debouncedQuery }), { retry: 0 })
        .json();
      const data = LocationSearchResponseSchema.parse(response);

      return data.locations;
    },
    placeholderData: keepPreviousData,
  });

  // cmdkはリストの高さを明示的に書く必要があるが、モバイルでは画面の高さに合わせたいため、この値を使用する
  const [listHeight, setListHeight] = useState(0);

  const headerRef = useRef<HTMLInputElement | null>(null);
  const footerRef = useRef<HTMLDivElement | null>(null);

  // 画面の高さに合わせてリストの高さを更新する
  const updateListHeight = () => {
    if (!headerRef.current || !footerRef.current) {
      return;
    }

    setListHeight(
      window.innerHeight -
        headerRef.current.clientHeight -
        footerRef.current.clientHeight
    );
  };

  useEffect(() => {
    window.addEventListener("resize", updateListHeight);
    return () => {
      window.removeEventListener("resize", updateListHeight);
    };
  }, []);

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
              ref={updateListHeight}
              style={{ ["--list-height" as string]: `${listHeight}px` }}
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
                  <LocationItem key={l.id} location={l} onClose={onClose} />
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

function LocationItem({
  location,
  onClose,
}: {
  location: Location;
  onClose: () => void;
}) {
  const router = useRouter();
  const currentPath = usePathname();
  const params = useParams();

  // 現在いるページに応じてリンクのパスを変える
  const getRoute = () => {
    const args = { currentPath, params };

    if (isWeatherSummaryPage(args)) {
      return Routes.weatherSummary({ locationId: `${location.id}` });
    }

    if (isWeatherDetailPage(args)) {
      return Routes.weatherDetail({
        locationId: `${location.id}`,
        date: args.params.date,
      });
    }

    return Routes.weatherSummary({ locationId: `${location.id}` });
  };

  const handleSelect = () => {
    // TODO: ページごとに遷移先を変える
    router.push(getRoute());
    onClose();
  };

  const handleItemClick = (e: SyntheticEvent) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <Command.Item
      value={`${location.id}`}
      onSelect={handleSelect}
      className={css({
        rounded: "var(--rounded-sm)",
        '&[data-selected="true"]': {
          bg: "var(--color-gray-200)",
        },
      })}
    >
      <Link
        className={css({
          padding: "var(--space-sm)",
          display: "flex",
          alignItems: "start",
          gap: "var(--space-sm)",
        })}
        href={getRoute()}
        onClick={handleItemClick}
      >
        <IconMapPin
          className={css({ flexShrink: 0, width: "20px", height: "20px" })}
        />
        <VStack className={css({ gap: "var(--space-sm)" })}>
          <div className={css({ fontSize: "16px", lineHeight: 1 })}>
            {location.name}
          </div>
          <div
            className={css({
              fontSize: "12px",
              color: "var(--color-gray-500)",
              lineHeight: 1,
            })}
          >{`${location.country} - ${location.region}`}</div>
        </VStack>
      </Link>
    </Command.Item>
  );
}

function KbdGuide({
  keys,
  description,
}: {
  keys: ReactNode;
  description: string;
}) {
  return (
    <HStack
      className={css({
        gap: "var(--space-xs)",
        display: "none",
        sm: { display: "flex" },
      })}
    >
      {keys}
      <p className={css({ fontSize: "12px" })}>{description}</p>
    </HStack>
  );
}

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd
      className={css({
        borderRadius: "var(--rounded-sm)",
        fontSize: "12px",
        border: "1px solid var(--color-gray-300)",
        bg: "var(--color-gray-200)",
        display: "grid",
        width: "fit",
        height: "20px",
        paddingInline: "var(--space-xs)",
      })}
    >
      {children}
    </kbd>
  );
}
