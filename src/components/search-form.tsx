"use client";

import Form from "next/form";
import { IconSearch } from "@tabler/icons-react";
import { css } from "../../styled-system/css";
import { BasePaths, HomeSearchParams, DetailSearchParams } from "@/routes";
import { usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export function SearchForm() {
  const searchParams = useSearchParams();
  const path = usePathname();

  const { actionPath, queryName } = getFormConfig(path);

  return (
    <Form
      className={css({
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gap: "8px",
      })}
      action={actionPath}
    >
      {[...searchParams.entries()].map(([key, value], i) => {
        if (key === queryName) {
          return;
        }
        return <input key={i} type="hidden" name={key} value={value} />;
      })}
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
        name={queryName}
        placeholder="地域(アルファベット)・経緯度を入力してください..."
      />
      <Button
        type="submit"
        className={css({
          background: "var(--color-primary-500)",
          color: "var(--color-gray-100)",
          _hover: {
            bg: "var(--color-primary-600)",
          },
        })}
        icon={IconSearch}
      >
        検索
      </Button>
    </Form>
  );
}

/**
 *  Path事にフォームの挙動を変える
 */
function getFormConfig(path: string) {
  switch (path) {
    case BasePaths.home: {
      return {
        actionPath: BasePaths.home,
        queryName: "locationQuery" satisfies keyof HomeSearchParams,
      };
    }
    case BasePaths.detail: {
      return {
        actionPath: BasePaths.detail,
        queryName: "locationQuery" satisfies keyof DetailSearchParams,
      };
    }
    default: {
      return {
        actionPath: BasePaths.home,
        queryName: "locationQuery" satisfies keyof HomeSearchParams,
      };
    }
  }
}
