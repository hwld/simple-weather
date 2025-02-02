import { Suspense } from "react";
import { css } from "../../styled-system/css";
import { HomePageNavigation } from "@/components/home-page-navigation";
import { VStack, HStack } from "@/components/ui/stack";
import { LocationSearchDialogTrigger } from "@/components/location-search/dialog-trigger";
import { IconCloudFilled } from "@tabler/icons-react";

export function AppHeader() {
  return (
    <VStack
      className={css({
        minW: "0px",
        gap: "var(--space-lg)",
        backgroundColor: "var(--color-gray-50)",
        borderWidth: "0px 1px 1px 1px",
        borderColor: "var(--color-gray-200)",
        borderRadius: "0 0 var(--rounded-md) var(--rounded-md)",
        padding: "var(--space-md)",
        boxShadow: "var(--shadow-md)",
      })}
    >
      <h1>
        <HStack
          className={css({
            gap: "var(--space-sm)",
            flexWrap: "wrap",
            justifyContent: "space-between",
          })}
        >
          <HStack
            className={css({
              gap: "var(--space-sm)",
            })}
          >
            <IconCloudFilled
              size={20}
              className={css({
                flexShrink: 0,
                color: "var(--color-primary-500)",
              })}
            />
            <p
              className={css({
                fontSize: "16px",
                fontWeight: "bold",
                lineHeight: 1,
              })}
            >
              SimpleWeather
            </p>
          </HStack>
          <HomePageNavigation />
        </HStack>
      </h1>
      <Suspense>
        <LocationSearchDialogTrigger />
      </Suspense>
    </VStack>
  );
}
