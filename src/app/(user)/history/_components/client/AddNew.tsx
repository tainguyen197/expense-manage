"use client";

import { Input } from "@/components/ui/input";
import { useSearchParams, useRouter } from "next/navigation";
import React from "react";
import Typewriter from "./Typewriter";
import { Button } from "@/components/ui/button";
import { Send, X } from "lucide-react";
import { interactWithAIAction } from "@/actions/ai";
import { cn } from "@/lib/utils";

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

  const messagePlaceholder = React.useMemo(() => {
    switch (type) {
      case "add_expense":
        return ["50k trà sữa ...", "100k tiền lì xì ...", "5 triệu tiền phòng"];
      case "add_income":
        return ["100k lương ...", "500k thưởng ...", "1 triệu tiền thưởng"];
    }
  }, [type]);

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
    if (isAddNew) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isAddNew]);

  return (
    <>
      <div onClick={() => setIsAddNew(true)}>{trigger}</div>
      {isAddNew && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsAddNew(false)}
          />

          {/* Modal - adjusted positioning to be above navbar */}
          <div className="absolute inset-x-0 bottom-[64px] transform transition-transform">
            {" "}
            {/* 64px is typical navbar height */}
            <div className="relative mx-4 bg-gray-900 rounded-2xl p-4 shadow-xl border border-gray-800">
              {/* Close button */}
              <button
                onClick={() => setIsAddNew(false)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-300"
              >
                <X size={20} />
              </button>

              {/* Title */}
              <h2 className="text-lg font-medium text-gray-100 mb-6">
                Add New {type === "add_income" ? "Income" : "Expense"}
              </h2>

              {/* Form */}
              <form className="space-y-4">
                {/* Result message */}
                {(result || isPending) && (
                  <div
                    className={cn(
                      "p-3 rounded-lg text-sm font-medium transition-all",
                      isPending
                        ? "bg-blue-500/10 text-blue-400"
                        : "bg-emerald-500/10 text-emerald-400"
                    )}
                  >
                    {isPending ? "✨ Đang suy nghĩ ..." : result}
                  </div>
                )}

                {/* Input group */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      name="value"
                      className={cn(
                        "w-full bg-gray-800 border-0 focus-visible:ring-1 focus-visible:ring-gray-700 text-gray-100 placeholder-gray-500",
                        isPending && "opacity-50"
                      )}
                      placeholder="Input amount and description..."
                      disabled={isPending}
                    />
                    {/* {!isPending && !result && (
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-sm">
                        <Typewriter
                          texts={messagePlaceholder}
                          className="text-gray-500/70"
                        />
                      </div>
                    )} */}
                  </div>
                  <Button
                    disabled={isPending}
                    type="submit"
                    formAction={handleSubmit}
                    className={cn(
                      "px-6 transition-all shadow-lg hover:shadow-xl",
                      type === "add_income"
                        ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                        : "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                    )}
                  >
                    <Send size={18} />
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
