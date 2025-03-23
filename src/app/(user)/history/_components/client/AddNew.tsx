"use client";

import { Input } from "@/components/ui/input";
import { useSearchParams, useRouter } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";
import { Send, X } from "lucide-react";
import { interactWithAIAction } from "@/actions/ai";
import {
  cn,
  handleBodyScroll,
  focusInput,
  getModalStyles,
} from "@/lib/utils/modal";
import { useTransactionCache } from "@/contexts/TransactionCacheContext";

const AddNew = ({
  trigger,
  type,
}: {
  trigger: React.ReactNode;
  type: "add_expense" | "add_income";
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isAddNew, setIsAddNew] = React.useState<boolean>(false);
  const [result, setResult] = React.useState<string>("");
  const [isPending, startTransition] = React.useTransition();
  const { invalidateCache } = useTransactionCache();
  const styles = getModalStyles(type);

  const handleSubmit = (formDate: FormData) => {
    const value = formDate.get("value") as string;
    const date = searchParams.get("date") || new Date().getTime().toString();

    if (!value) return;

    startTransition(async () => {
      const result = await interactWithAIAction(
        {
          content: value,
          role: "user",
          kind: null,
          timestamp: new Date(Number(date)).toISOString(),
        },
        false
      );

      let content = "Có vẻ như yêu cầu của bạn không hợp lệ, hãy thử lại";

      if (result.kind == "add_expense" || result.kind == "add_income") {
        content = result.content;
        invalidateCache(date);
      }

      setResult(content);
      router.refresh();
    });
  };

  React.useEffect(() => {
    if (result) {
      const timer = setTimeout(() => {
        setResult("");
        setIsAddNew(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [result]);

  React.useEffect(() => {
    handleBodyScroll(isAddNew);
  }, [isAddNew]);

  React.useEffect(() => {
    if (isAddNew) {
      focusInput("input");
    }
  }, [isAddNew]);

  return (
    <>
      <div onClick={() => setIsAddNew(true)}>{trigger}</div>
      {isAddNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with blur effect */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsAddNew(false)}
          />

          {/* Modal */}
          <div className="relative w-full max-w-md transform transition-all duration-300 scale-100">
            <div className="relative bg-gray-900/95 rounded-2xl p-6 shadow-2xl border border-gray-800/50 backdrop-blur-xl">
              {/* Close button */}
              <button
                onClick={() => setIsAddNew(false)}
                className="absolute right-4 top-4 p-2 rounded-full text-gray-400 hover:text-gray-300 hover:bg-gray-800/50 transition-colors"
              >
                <X size={20} />
              </button>

              {/* Title */}
              <h2 className="text-xl font-semibold text-gray-100 mb-6">
                Add New {type === "add_income" ? "Income" : "Expense"}
              </h2>

              {/* Form */}
              <form className="space-y-4">
                {/* Result message */}
                {(result || isPending) && (
                  <div
                    className={cn(
                      "p-4 rounded-xl text-sm font-medium transition-all duration-300",
                      isPending ? styles.status.pending : styles.status.success
                    )}
                  >
                    {isPending ? "✨ Đang suy nghĩ ..." : result}
                  </div>
                )}

                {/* Input group */}
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Input
                      id="input"
                      name="value"
                      placeholder="Input amount and description..."
                      disabled={isPending}
                      className="bg-gray-800/50 border-gray-700 focus:border-gray-600 h-12 px-4 rounded-xl"
                    />
                  </div>
                  <Button
                    disabled={isPending}
                    type="submit"
                    formAction={handleSubmit}
                    className={styles.button}
                  >
                    <Send
                      size={18}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddNew;
