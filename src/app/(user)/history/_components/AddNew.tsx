import { getExpenseParams } from "@/app/api/openai";
import { Input } from "@/components/ui/input";
import { Message } from "@/types/message";
import { formatCurrency } from "@/utils/curency";
import { useSearchParams, useRouter } from "next/navigation";
import React from "react";
import Typewriter from "./Typewriter";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

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
    const date = searchParams.get("date");
    const now = new Date();
    const dateWithTime = new Date(Number(date)).setHours(
      now.getHours(),
      now.getMinutes(),
      now.getSeconds()
    );
    if (!dateWithTime || !value) return;

    startTransition(async () => {
      const result = (await getExpenseParams(value, {
        timestamp: Number(dateWithTime),
        persistStorage: false,
      })) as Message;

      let content = "Có vẻ như yêu cầu của bạn không hợp lệ, hãy thử lại";
      if (result.kind == "add_expense") {
        const { amount, item } = result.params;

        content =
          "Đã thêm khoản chi mới: " + item + " " + formatCurrency(amount);
      }
      if (result.kind == "add_income") {
        const { amount, item } = result.params;

        content =
          "Đã thêm khoản thu mới: " + item + " " + formatCurrency(amount);
      }

      setResult(content);
      router.refresh();
    });
  };

  React.useEffect(() => {
    if (result) {
      const timer = setTimeout(() => {
        setResult("");
      }, 5000);
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
        <>
          <div
            className="absolute inset-0 w-screen h-screen bg-black opacity-75"
            onClick={() => setIsAddNew(false)}
          />

          <form>
            <div className="fixed bottom-20 right-0 px-2 w-full">
              {result && (
                <div className="text-sm bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent font-semibold transform-all animate-fadeIn overflow-hidden p-2 rounded-lg">
                  {result}
                </div>
              )}
              {isPending ? (
                <div className="text-sm bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent font-semibold transform-all animate-typing overflow-hidden p-2 rounded-lg">
                  ✨ Đang suy nghĩ ...
                </div>
              ) : (
                <></>
              )}
              <div className="flex items-center gap-1 mt-2">
                <div className="relative w-full">
                  <div className="group w-full p-[1.5px] bg-gradient-to-r from-blue-500 to-green-500 rounded focus-visible:from-blue-600 focus-visible:to-green-600 focus-within:from-blue-600 focus-within:to-green-600">
                    <Input
                      name="value"
                      className="bg-white w-full rounded outline-none border-none focus-visible:ring-0 focus-visible:relative focus-visible:z-10 text-gray-500"
                    />
                    {!isPending && (
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400 text-sm">
                        <Typewriter texts={messagePlaceholder} />
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  type="submit"
                  className="bg-[#2a7afc] text-white p-5 bg-gradient-to-r from-blue-500 to-green-500"
                  formAction={handleSubmit}
                >
                  <Send />
                </Button>
              </div>
            </div>
          </form>
        </>
      )}
    </>
  );
};

export default AddNew;
