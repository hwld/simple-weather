import { css } from "../../styled-system/css";

type Props = { locationName: string };
export async function LocationNotFoundPage({ locationName }: Props) {
  return (
    <div
      className={css({
        bg: "var(--color-gray-50)",
        border: "solid 1px var(--color-gray-300)",
        padding: "16px",
        borderRadius: "8px",
        height: "300px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      })}
    >
      {`"${locationName}" が見つかりませんでした。`}
    </div>
  );
}
