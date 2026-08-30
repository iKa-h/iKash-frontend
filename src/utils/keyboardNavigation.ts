export type NavigationOrientation = "horizontal" | "vertical";

export function getRovingFocusIndex(
    key: string,
    currentIndex: number,
    itemCount: number,
    orientation: NavigationOrientation,
): number | null {
    if (itemCount <= 0) return null;

    if (key === "Home") return 0;
    if (key === "End") return itemCount - 1;

    const nextKey = orientation === "horizontal" ? "ArrowRight" : "ArrowDown";
    const previousKey = orientation === "horizontal" ? "ArrowLeft" : "ArrowUp";

    if (key === nextKey) return (currentIndex + 1) % itemCount;
    if (key === previousKey) return (currentIndex - 1 + itemCount) % itemCount;

    return null;
}
