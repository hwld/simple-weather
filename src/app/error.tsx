"use client";
import { IconExclamationCircle, IconHome } from "@tabler/icons-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Routes } from "@/routes";

type Props = { error: Error; reset: () => void };

export default function UnhandledErrorPage({ error }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const handleGoToHome = () => {
    // useRouter()を使用してもエラー画面がリセットされないので、windowを直接操作する
    window.location.replace(Routes.home());
  };

  return (
    <div className="grid place-items-center gap-4 p-4 h-full place-content-center">
      <IconExclamationCircle size={50} className="text-red-500" />
      <div className="text-center max-w-[350px]">
        <p>アプリケーションでエラーが発生しました。</p>
        <p>
          URLが正しくない可能性があるため、ホーム画面に戻ってもう一度試してみてください。
        </p>
      </div>
      <Button
        className="bg-red-500 text-base-100 hover:bg-red-600"
        icon={IconHome}
        onClick={handleGoToHome}
      >
        ホーム画面に戻る
      </Button>
    </div>
  );
}
