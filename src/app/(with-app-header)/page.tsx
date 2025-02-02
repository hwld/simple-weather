import { Metadata } from "next";
import { HStack, VStack } from "@/components/ui/stack";
import { IconHome, IconSearch } from "@tabler/icons-react";
import { css } from "../../../styled-system/css";
import { Card } from "@/components/ui/card";
import { PageLayout } from "@/components/ui/page-layout";

export const metadata: Metadata = {
  title: "ホーム - SimpleWeather",
};

export default async function HomePage() {
  return (
    <PageLayout
      title={
        <h2>
          <HStack
            className={css({
              gap: "var(--space-xs)",
              color: "var(--color-primary-500)",
            })}
          >
            <IconHome />
            <div className={css({ fontWeight: "bold", fontSize: "16px" })}>
              ホーム
            </div>
          </HStack>
        </h2>
      }
    >
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
    </PageLayout>
  );
}
