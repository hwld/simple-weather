import { PageLayout } from "@/components/ui/page-layout";

export function LoadingPage() {
  return (
    <PageLayout
      title={
        <div className="h-[20px] bg-base-200 rounded-sm w-[30%] animate-pulse" />
      }
    >
      <div className="h-[60%] bg-base-100 rounded-lg animate-pulse delay-300" />
    </PageLayout>
  );
}
