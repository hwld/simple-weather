import { Suspense } from "react";
import { css } from "../../styled-system/css";
import { HomePageNavigation } from "@/components/home-page-navigation";
import { VStack, HStack } from "@/components/ui/stack";
import { LocationSearchDialogTrigger } from "@/components/location-search/dialog-trigger";

export function AppHeader() {
  return (
    <VStack
      className={css({
        gap: "var(--space-lg)",
        backgroundColor: "var(--color-gray-50)",
        border: "1px solid var(--color-gray-200)",
        borderRadius: "0 0 var(--rounded-md) var(--rounded-md)",
        padding: "var(--space-md)",
        boxShadow: "var(--shadow-md)",
      })}
    >
      <h1>
        <HStack
          className={css({
            gap: "var(--space-md)",
            justifyContent: "space-between",
          })}
        >
          <div className={css({ fontSize: "16px", fontWeight: "bold" })}>
            SimpleWeather
          </div>
          <HomePageNavigation />
        </HStack>
      </h1>
      <Suspense>
        <LocationSearchDialogTrigger />
      </Suspense>
    </VStack>
  );
}
