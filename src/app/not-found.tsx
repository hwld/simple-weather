"use client";
import { IconError404, IconHome } from "@tabler/icons-react";
import { ButtonLink } from "@/components/ui/button";
import { Routes } from "@/routes";

export default function NotFoundPage() {
  return (
    <div className="grid place-items-center gap-4 p-4 h-full place-content-center">
      <IconError404 size={80} className="text-base-700" />
      <div className="text-center">
        <p>URLが見つかりませんでした。</p>
        <p>ホーム画面に戻ってもう一度試してみてください。</p>
      </div>
      <ButtonLink
        className="bg-base-700 text-base-100 hover:bg-base-800"
        icon={IconHome}
        href={Routes.home()}
      >
        ホーム画面に戻る
      </ButtonLink>
    </div>
  );
}
