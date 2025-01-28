import { css } from "../../styled-system/css";
import { SearchForm } from "./search-form";

export function AppHeader() {
  return (
    <div
      className={css({
        display: "grid",
        gap: "8px",
        width: "100%",
        backgroundColor: "var(--color-gray-50)",
        border: "1px solid var(--color-gray-300)",
        borderRadius: "0 0 8px 8px",
        padding: "16px",
      })}
    >
      <h1 className={css({ fontSize: "16px", fontWeight: "bold" })}>
        WeatherApp
      </h1>
      <SearchForm />
    </div>
  );
}
