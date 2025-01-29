import Form from "next/form";
import { IconSearch } from "@tabler/icons-react";
import { css } from "../../styled-system/css";

export function SearchForm() {
  return (
    <Form
      className={css({
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gap: "8px",
      })}
      action="/"
    >
      <input
        className={css({
          bg: "transparent",
          border: "solid 1px var(--color-gray-300)",
          borderRadius: "4px",
          paddingLeft: "8px",
          height: "28px",
          _placeholder: {
            color: "var(--color-gray-400)",
          },
          _focusVisible: {
            outlineColor: "var(--color-primary-500)",
          },
        })}
        name="locationQuery"
        placeholder="地域(アルファベット)・経緯度を入力してください..."
      />
      <button
        className={css({
          bg: "var(--color-primary-500)",
          color: "var(--color-gray-100)",
          borderRadius: "4px",
          height: "28px",
          minWidth: "64px",
          paddingInline: "8px",
          display: "flex",
          gap: "4px",
          alignItems: "center",
          justifyContent: "center",
          lineHeight: 1,
          cursor: "pointer",

          transition: "all",
          transitionDuration: "0.1s",
          _hover: {
            bg: "var(--color-primary-600)",
          },
        })}
        type="submit"
      >
        <IconSearch className={css({ width: "16px", height: "16px" })} />
        検索
      </button>
    </Form>
  );
}
