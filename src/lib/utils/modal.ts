import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const handleBodyScroll = (isOpen: boolean) => {
  if (isOpen) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
};

export const focusInput = (inputId: string) => {
  const input = document.getElementById(inputId);
  if (input) {
    input.focus();
  }
};

export const getModalStyles = (type: "add_expense" | "add_income") => {
  const baseButtonStyles =
    "h-12 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50";
  const incomeStyles =
    "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30";
  const expenseStyles =
    "bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/30";

  return {
    button: cn(
      baseButtonStyles,
      type === "add_income" ? incomeStyles : expenseStyles
    ),
    status: {
      pending: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
      success:
        "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    },
  };
};
