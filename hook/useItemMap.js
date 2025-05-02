import { useMemo } from "react";

export default function useItemsMap(allItems) {
  return useMemo(() => {
    const map = new Map();
    allItems.forEach((item) => map.set(item.id, item));
    return map;
  }, [allItems]);
}
