import { VStack } from "@/components/ui/stack";
import { IconMapPin } from "@tabler/icons-react";
import { Command } from "cmdk";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SyntheticEvent, useMemo } from "react";
import { css } from "../../../styled-system/css";
import { Location } from "@/backend/weather/schema";

/**
 *  locationをクリックしたときに遷移するRouteを取得する関数
 */
export type GetLocationNavRoute = (locationId: number) => string;

type Props = {
  location: Location;
  onGetLocationNavRoute: GetLocationNavRoute;
  onBeforeNavigate: () => void;
};

export function LocationSearchResultItem({
  location,
  onGetLocationNavRoute,
  onBeforeNavigate,
}: Props) {
  const router = useRouter();

  const locationNavRoute = useMemo(() => {
    return onGetLocationNavRoute(location.id);
  }, [location.id, onGetLocationNavRoute]);

  const handleSelect = () => {
    onBeforeNavigate();
    router.push(locationNavRoute);
  };

  const handleLinkClick = (e: SyntheticEvent) => {
    e.stopPropagation();
    onBeforeNavigate();
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
        href={locationNavRoute}
        onClick={handleLinkClick}
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
