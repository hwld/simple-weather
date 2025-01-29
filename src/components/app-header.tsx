import { Suspense } from "react";
import { css } from "../../styled-system/css";
import { SearchForm } from "./search-form";
import { PageNavigation } from "./page-navigation";

export function AppHeader() {
  return (
    <div
      className={css({
        display: "flex",
        flexDir: "column",
        gap: "24px",
        width: "100%",
        backgroundColor: "var(--color-gray-50)",
        border: "1px solid var(--color-gray-300)",
        borderRadius: "0 0 8px 8px",
        padding: "16px",
      })}
    >
      <h1
        className={css({
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
        })}
      >
        <div className={css({ fontSize: "16px", fontWeight: "bold" })}>
          SimpleWeather
        </div>
        <PageNavigation />
      </h1>
      <Suspense>
        <SearchForm />
      </Suspense>
    </div>
  );
}
