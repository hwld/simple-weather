import { Metadata } from "next";
import { VStack } from "@/components/ui/stack";
import { IconSearch } from "@tabler/icons-react";
import { css } from "../../../styled-system/css";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "ホーム - SimpleWeather",
};

export default async function HomePage() {
  return (
    <Card>
      <VStack
        className={css({
          height: "300px",
          justifyContent: "center",
          alignItems: "center",
          gap: "16px",
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
    </Card>
  );
}
