"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";

type UpdateOptions = {
  replace?: boolean; // If true, replaces all params. If false, merges them.
  scroll?: boolean; // If false, prevents scrolling after updating the URL.
};

export function useUpdateSearchParams() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace, push } = useRouter();

  const updateSearchParams = (
    newParams: Record<string, string | null>,
    options?: UpdateOptions
  ) => {
    const params = options?.replace
      ? new URLSearchParams()
      : new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    const newUrl = `${pathname}?${params.toString()}`;
    const method = options?.replace ? replace : push;

    method(newUrl, { scroll: options?.scroll ?? false });
  };

  return updateSearchParams;
}
