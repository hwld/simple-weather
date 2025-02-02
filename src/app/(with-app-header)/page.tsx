import { Metadata } from "next";
import { VStack } from "@/components/ui/stack";
import { IconSearch } from "@tabler/icons-react";
import { css } from "../../../styled-system/css";
import { Card, CardContainer } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "ホーム - SimpleWeather",
};

export default async function HomePage() {
  return (
    <CardContainer>
      <Card>
        <VStack
          className={css({
            height: "300px",
            justifyContent: "center",
            alignItems: "center",
            gap: "var(--space-md)",
          })}
        >
          <IconSearch
            size={50}
            className={css({ color: "var(--color-primary-500)" })}
          />
          <div className={css({ textAlign: "center" })}>
            <p>上の検索バーから地域を検索してください</p>
            <p>{`Cmd(Ctrl) + k キーで検索ダイアログを開くこともできます`}</p>
          </div>
        </VStack>
      </Card>
    </CardContainer>
  );
}
