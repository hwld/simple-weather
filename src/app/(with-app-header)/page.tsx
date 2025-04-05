import { Metadata } from "next";
import { IconHome, IconSearch } from "@tabler/icons-react";
import { Card } from "@/components/ui/card";
import { PageLayout } from "@/components/ui/page-layout";
import { TextLink } from "@/components/ui/text-link";
import { fetchRequestLocation } from "@/backend/weather/fetch";
import { headers } from "next/headers";
import { Routes } from "@/routes";

export const metadata: Metadata = {
  title: "ホーム - SimpleWeather",
};

export default async function HomePage() {
  const location = await fetchRequestLocation(await headers());

  return (
    <PageLayout
      title={
        <h2>
          <div className="grid grid-cols-[auto_1fr] gap-1 text-primary-500">
            <IconHome />
            <div className="font-bold text-base">ホーム</div>
          </div>
        </h2>
      }
    >
      <Card>
        <div className="min-h-[300px] grid place-content-center place-items-center gap-4">
          <IconSearch className="text-primary-500 size-[50px]" />
          <div className="text-center">
            <p>上の検索バーから地域を検索してください</p>
            <p>{`Cmd(Ctrl) + k キーで検索ダイアログを開くこともできます`}</p>
          </div>
          {location.status === "ok" && (
            <TextLink
              href={Routes.weatherSummary({
                locationId: location.value.id.toString(),
              })}
            >
              {location.value.name}の天気予報
            </TextLink>
          )}
        </div>
      </Card>
    </PageLayout>
  );
}
