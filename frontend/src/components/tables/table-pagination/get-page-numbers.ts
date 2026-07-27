function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export function getPageNumbers(
  page: number,
  totalPages: number,
): (number | "ellipsis")[] {
  const siblings = 1;
  const boundaries = 1;
  const totalPageNumbers = siblings * 2 + 3 + boundaries * 2;

  if (totalPageNumbers >= totalPages) {
    return range(1, totalPages);
  }

  const leftSiblingIndex = Math.max(page - siblings, boundaries);
  const rightSiblingIndex = Math.min(page + siblings, totalPages - boundaries);

  const shouldShowLeftEllipsis = leftSiblingIndex > boundaries + 2;
  const shouldShowRightEllipsis =
    rightSiblingIndex < totalPages - (boundaries + 1);

  if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
    const leftItemCount = siblings * 2 + boundaries + 2;

    return [
      ...range(1, leftItemCount),
      "ellipsis",
      ...range(totalPages - (boundaries - 1), totalPages),
    ];
  }

  if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
    const rightItemCount = boundaries + 1 + 2 * siblings;

    return [
      ...range(1, boundaries),
      "ellipsis",
      ...range(totalPages - rightItemCount, totalPages),
    ];
  }

  return [
    ...range(1, boundaries),
    "ellipsis",
    ...range(leftSiblingIndex, rightSiblingIndex),
    "ellipsis",
    ...range(totalPages - boundaries + 1, totalPages),
  ];
}
