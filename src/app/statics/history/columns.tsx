"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string;
  amount: number;
  email: string;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "email",
    header: "Tên",
  },
  {
    accessorKey: "amount",
    header: "Giá",
  },
];
