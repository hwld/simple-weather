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
  BasePaths,
  DetailSearchParamsSchema,
  Location,
  LocationSearchResponseSchema,
  Routes,
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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { searchParamsToObject } from "@/app/utils";
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
              gap: "8px",
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
      className={css({
        backgroundColor: "rgb(0 0 0 / 0.2)",
      })}
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
              rounded: "8px",
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
              gap: "8px",
              _focusVisible: {
                outline: "none",
              },
            })}
          >
            <HStack
              ref={headerRef}
              className={css({
                padding: "8px",
                borderBottom: "1px solid var(--color-gray-200)",
                gap: "8px",
              })}
            >
              <HStack
                className={css({
                  width: "100%",
                  border: "1px solid var(--color-gray-300)",
                  height: "32px",
                  rounded: "4px",
                  overflow: "hidden",
                  paddingInline: "4px",
                  gap: "4px",
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
                paddingInline: "8px",
                overflow: "auto",
                height: "var(--list-height)",
                sm: { height: "300px" },
              })}
            >
              <Command.Empty
                className={css({ fontSize: "12px", padding: "8px" })}
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
                padding: "8px",
                gap: "16px",
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
  const searchParams = useSearchParams();
  const currentPath = usePathname();

  const getRoute = () => {
    switch (currentPath) {
      case BasePaths.home: {
        return Routes.home({ locationId: `${location.id}` });
      }
      case BasePaths.detail: {
        const params = DetailSearchParamsSchema.parse(
          searchParamsToObject(searchParams)
        );

        return Routes.detail({
          locationId: `${location.id}`,
          date: params.date,
        });
      }
      default: {
        return Routes.home({ locationId: `${location.id}` });
      }
    }
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
        rounded: "4px",
        '&[data-selected="true"]': {
          bg: "var(--color-gray-200)",
        },
      })}
    >
      <Link
        className={css({
          padding: "8px",
          display: "flex",
          alignItems: "start",
          gap: "8px",
        })}
        href={getRoute()}
        onClick={handleItemClick}
      >
        <IconMapPin
          className={css({ flexShrink: 0, width: "20px", height: "20px" })}
        />
        <VStack className={css({ gap: "8px" })}>
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
        gap: "4px",
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
        borderRadius: "4px",
        fontSize: "12px",
        border: "1px solid var(--color-gray-300)",
        bg: "var(--color-gray-200)",
        display: "grid",
        width: "fit",
        height: "20px",
        paddingInline: "4px",
      })}
    >
      {children}
    </kbd>
  );
}
