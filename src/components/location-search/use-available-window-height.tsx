import { RefObject, useCallback, useEffect, useState } from "react";

/**
 * ウィンドウの高さから指定された要素の合計の高さを引き、利用可能な高さを返すhook
 */
export function useAvailableWindowHeight(
  defaultRefs: RefObject<HTMLElement | null>[]
) {
  // 最初に渡されたrefsを使い続ける
  const [refs] = useState(defaultRefs);
  const [availableHeight, setAvailableHeight] = useState(0);

  const updateAvailableHeight = useCallback(() => {
    const elements = refs.map((r) => r.current);
    if (elements.includes(null)) {
      return;
    }

    const totalHeight = elements.reduce((acc, current) => {
      return acc + (current?.clientHeight ?? 0);
    }, 0);

    setAvailableHeight(window.innerHeight - totalHeight);
  }, [refs]);

  useEffect(() => {
    window.addEventListener("resize", updateAvailableHeight);
    return () => {
      window.removeEventListener("resize", updateAvailableHeight);
    };
  }, [updateAvailableHeight]);

  return { availableHeight, updateAvailableHeight };
}
