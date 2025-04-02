import { useCallback, useState } from "react";
import {
  PaginatedRequestParams,
  PaginatedResponse,
  Transaction,
} from "../utils/types";
import { PaginatedTransactionsResult } from "./types";
import { useCustomFetch } from "./useCustomFetch";

export function usePaginatedTransactions(): PaginatedTransactionsResult {
  const { fetchWithCache, loading } = useCustomFetch();
  const [paginatedTransactions, setPaginatedTransactions] =
    useState<PaginatedResponse<Transaction[]> | null>(null);

  // const fetchAll = useCallback(async () => {
  //   const response = await fetchWithCache<
  //     PaginatedResponse<Transaction[]>,
  //     PaginatedRequestParams
  //   >("paginatedTransactions", {
  //     page: paginatedTransactions === null ? 0 : paginatedTransactions.nextPage,
  //   });

  //   setPaginatedTransactions((previousResponse) => {
  //     if (response === null) {
  //       return previousResponse;
  //     }

  //     return {
  //       data: [...(previousResponse?.data || []), ...response.data],
  //       nextPage: response.nextPage,
  //     };
  //   });
  // }, [fetchWithCache, paginatedTransactions]);

  const fetchAll = useCallback(async () => {
    const response = await fetchWithCache<
      PaginatedResponse<Transaction[]>,
      PaginatedRequestParams
    >("paginatedTransactions", {
      page: paginatedTransactions === null ? 0 : paginatedTransactions.nextPage,
    });

    setPaginatedTransactions((previousResponse) => {
      if (response === null || previousResponse === null) {
        return response;
      }

      return {
        // bug 4: view more button replacing rather than appending
        // fix 4: include previousResponse with response in data
        data: [...(previousResponse?.data || []), ...response.data],
        nextPage: response.nextPage,
      };
    });
  }, [fetchWithCache, paginatedTransactions]);

  const invalidateData = useCallback(() => {
    setPaginatedTransactions(null);
  }, []);

  return { data: paginatedTransactions, loading, fetchAll, invalidateData };
}
