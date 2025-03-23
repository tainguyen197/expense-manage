"use client";

import { Transaction } from "@/types/expense";
import React, { createContext, useContext, useCallback } from "react";

type CacheKey = string;
type CacheData = {
  income: Transaction[] | null;
  expense: Transaction[] | null;
  timestamp: number;
};

type TransactionCache = {
  [key: CacheKey]: CacheData;
};

type TransactionCacheContextType = {
  getCache: (date: string) => CacheData | null;
  setCache: (
    date: string,
    data: { income: Transaction[] | null; expense: Transaction[] | null }
  ) => void;
  invalidateCache: (date: string) => void;
  subscribeToInvalidation: (date: string, callback: () => void) => () => void;
};

const TransactionCacheContext =
  createContext<TransactionCacheContextType | null>(null);

export const useTransactionCache = () => {
  const context = useContext(TransactionCacheContext);
  if (!context) {
    throw new Error(
      "useTransactionCache must be used within a TransactionCacheProvider"
    );
  }
  return context;
};

export const TransactionCacheProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [cache, setCache] = React.useState<TransactionCache>({});
  const [subscribers, setSubscribers] = React.useState<{
    [key: string]: Set<() => void>;
  }>({});

  // Cache expiration time (5 minutes)
  const CACHE_EXPIRATION = 5 * 60 * 1000;

  const getCache = useCallback(
    (date: string) => {
      const cachedData = cache[date];
      if (!cachedData) return null;

      // Check if cache is expired
      if (Date.now() - cachedData.timestamp > CACHE_EXPIRATION) {
        // Remove expired cache
        const newCache = { ...cache };
        delete newCache[date];
        setCache(newCache);
        return null;
      }

      return cachedData;
    },
    [cache]
  );

  const setCacheData = useCallback(
    (
      date: string,
      data: { income: Transaction[] | null; expense: Transaction[] | null }
    ) => {
      setCache((prev) => ({
        ...prev,
        [date]: {
          ...data,
          timestamp: Date.now(),
        },
      }));
    },
    []
  );

  const invalidateCache = useCallback(
    (date: string) => {
      setCache((prev) => {
        const newCache = { ...prev };
        delete newCache[date];
        return newCache;
      });

      // Notify subscribers
      subscribers[date]?.forEach((callback) => callback());
    },
    [subscribers]
  );

  const subscribeToInvalidation = useCallback(
    (date: string, callback: () => void) => {
      setSubscribers((prev) => {
        const newSubscribers = { ...prev };
        if (!newSubscribers[date]) {
          newSubscribers[date] = new Set();
        }
        newSubscribers[date].add(callback);
        return newSubscribers;
      });

      // Return unsubscribe function
      return () => {
        setSubscribers((prev) => {
          const newSubscribers = { ...prev };
          newSubscribers[date]?.delete(callback);
          if (newSubscribers[date]?.size === 0) {
            delete newSubscribers[date];
          }
          return newSubscribers;
        });
      };
    },
    []
  );

  return (
    <TransactionCacheContext.Provider
      value={{
        getCache,
        setCache: setCacheData,
        invalidateCache,
        subscribeToInvalidation,
      }}
    >
      {children}
    </TransactionCacheContext.Provider>
  );
};
