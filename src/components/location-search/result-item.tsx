import { Icon, IconMapPin } from "@tabler/icons-react";
import { Command } from "cmdk";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SyntheticEvent, useMemo } from "react";
import { Location } from "@/backend/weather/schema";

/**
 *  locationをクリックしたときに遷移するRouteを取得する関数
 */
export type GetLocationNavRoute = (locationId: number) => string;

type Props = {
  location: Location;
  onGetLocationNavRoute: GetLocationNavRoute;
  onBeforeNavigate: (location: Location) => void;
  customIcon?: Icon;
};

export function LocationSearchResultItem({
  location,
  onGetLocationNavRoute,
  onBeforeNavigate,
  customIcon: icon,
}: Props) {
  const router = useRouter();

  const locationNavRoute = useMemo(() => {
    return onGetLocationNavRoute(location.id);
  }, [location.id, onGetLocationNavRoute]);

  const handleSelect = () => {
    onBeforeNavigate(location);
    router.push(locationNavRoute);
  };

  const handleLinkClick = (e: SyntheticEvent) => {
    e.stopPropagation();
    onBeforeNavigate(location);
  };

  const Icon = icon ? icon : IconMapPin;

  return (
    <Command.Item
      keywords={[location.name]}
      value={`${location.id}`}
      onSelect={handleSelect}
      className="rounded-sm data-[selected='true']:bg-base-200"
    >
      <Link
        className="p-2 grid grid-cols-[auto_1fr] items-start gap-2"
        href={locationNavRoute}
        onClick={handleLinkClick}
      >
        <Icon className="size-5" />
        <div className="flex flex-col gap-2">
          <div className="text-base leading-none">{location.name}</div>
          <div className="text-xs text-base-500 leading-none">{`${location.country} - ${location.region}`}</div>
        </div>
      </Link>
    </Command.Item>
  );
}
