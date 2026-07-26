import { Pagination } from "@heroui/react";

import { getPageNumbers } from "./get-page-numbers";

type TablePaginationProps = {
  page: number;
  totalPages: number;
  totalCount: number;
  totalLabel: string;
  onPageChange: (page: number) => void;
};

export default function TablePagination({
  page,
  totalPages,
  totalCount,
  totalLabel,
  onPageChange,
}: TablePaginationProps) {
  return (
    <Pagination>
      <Pagination.Summary>
        Total {totalCount} {totalLabel}
      </Pagination.Summary>
      {totalPages > 1 && (
        <Pagination.Content>
          <Pagination.Item>
            <Pagination.Previous
              aria-label="Página anterior"
              isDisabled={page === 1}
              onPress={() => onPageChange(page - 1)}
            >
              <Pagination.PreviousIcon />
            </Pagination.Previous>
          </Pagination.Item>
          {getPageNumbers(page, totalPages).map((item, index) =>
            item === "ellipsis" ? (
              <Pagination.Item key={`ellipsis-${index}`}>
                <Pagination.Ellipsis />
              </Pagination.Item>
            ) : (
              <Pagination.Item key={item}>
                <Pagination.Link
                  isActive={item === page}
                  onPress={() => onPageChange(item)}
                >
                  {item}
                </Pagination.Link>
              </Pagination.Item>
            ),
          )}
          <Pagination.Item>
            <Pagination.Next
              aria-label="Página siguiente"
              isDisabled={page === totalPages}
              onPress={() => onPageChange(page + 1)}
            >
              <Pagination.NextIcon />
            </Pagination.Next>
          </Pagination.Item>
        </Pagination.Content>
      )}
    </Pagination>
  );
}
