import { VStack } from "@/components/ui/stack";
import {
  isWeatherSummaryPage,
  Routes,
  isWeatherDetailPage,
  Location,
} from "@/routes";
import { IconMapPin } from "@tabler/icons-react";
import { Command } from "cmdk";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { SyntheticEvent } from "react";
import { css } from "../../../styled-system/css";

type Props = {
  location: Location;
  onClose: () => void;
};

export function LocationSearchResultItem({ location, onClose }: Props) {
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
