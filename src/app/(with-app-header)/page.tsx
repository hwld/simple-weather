import { Metadata } from "next";
import { VStack } from "@/components/ui/stack";
import { IconSearch } from "@tabler/icons-react";
import { css } from "../../../styled-system/css";

export const metadata: Metadata = {
  title: "ホーム - SimpleWeather",
};

export default async function HomePage() {
  return (
    <VStack
      className={css({
        bg: "var(--color-gray-50)",
        border: "solid 1px var(--color-primary-500)",
        padding: "32px",
        borderRadius: "8px",
        height: "300px",
        gap: "24px",
        justifyContent: "center",
        alignItems: "center",
      })}
    >
      <IconSearch
        size={50}
        className={css({ color: "var(--color-primary-500)" })}
      />
      <p className={css({ maxWidth: "300px", textAlign: "center" })}>
        上の検索バーから地域を検索してください
      </p>
    </VStack>
  );
}
