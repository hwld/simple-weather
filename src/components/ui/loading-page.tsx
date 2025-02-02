import { PageLayout } from "@/components/ui/page-layout";
import { css } from "../../../styled-system/css";

export function LoadingPage() {
  return (
    <PageLayout
      title={
        <div
          className={css({
            height: "100%",
            width: "30%",
            backgroundColor: "var(--color-gray-200)",
            animation: "skeleton 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            borderRadius: "var(--rounded-sm)",
          })}
        />
      }
    >
      <div
        className={css({
          height: "60%",
          overflow: "hidden",
          borderRadius: "var(--rounded-md)",
          backgroundColor: "var(--color-gray-100)",
          animation: "skeleton 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          animationDelay: "0.3s",
        })}
      ></div>
    </PageLayout>
  );
}
