import { Metadata } from "next";
import { IconHome, IconSearch } from "@tabler/icons-react";
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
          <div className="grid grid-cols-[auto_1fr] gap-1 text-primary-500">
            <IconHome />
            <div className="font-bold text-base">ホーム</div>
          </div>
        </h2>
      }
    >
      <Card>
        <div className="min-h-[300px] grid place-content-center place-items-center gap-4">
          <IconSearch size={50} className="text-primary-500" />
          <div className="text-center">
            <p>上の検索バーから地域を検索してください</p>
            <p>{`Cmd(Ctrl) + k キーで検索ダイアログを開くこともできます`}</p>
          </div>
        </div>
      </Card>
    </PageLayout>
  );
}
