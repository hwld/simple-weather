import { Suspense } from "react";
import { css } from "../../styled-system/css";
import { PageNavigation } from "@/components/page-navigation";
import { SearchForm } from "@/components/search-form";
import { VStack, HStack } from "@/components/ui/stack";

export function AppHeader() {
  return (
    <VStack
      className={css({
        gap: "24px",
        backgroundColor: "var(--color-gray-50)",
        border: "1px solid var(--color-gray-300)",
        borderRadius: "0 0 8px 8px",
        padding: "16px",
      })}
    >
      <h1>
        <HStack className={css({ gap: "16", justifyContent: "space-between" })}>
          <div className={css({ fontSize: "16px", fontWeight: "bold" })}>
            SimpleWeather
          </div>
          <PageNavigation />
        </HStack>
      </h1>
      <Suspense>
        <SearchForm />
      </Suspense>
    </VStack>
  );
}
