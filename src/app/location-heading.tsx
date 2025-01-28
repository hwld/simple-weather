import { css } from "../../styled-system/css";

type Props = { location: string };

export function LocationHeading({ location }: Props) {
  return (
    <div className={css({ display: "flex", alignItems: "end", gap: "4px" })}>
      <div
        className={css({
          fontSize: "20px",
          fontWeight: "bold",
          flexWrap: "wrap",
        })}
      >
        {location}
      </div>
      <div className={css({ wordBreak: "keep-all" })}>の天気予報</div>
    </div>
  );
}
